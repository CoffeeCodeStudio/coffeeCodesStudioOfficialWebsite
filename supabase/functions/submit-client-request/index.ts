import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const body = await req.json();
    const { project_id, message, category, priority } = body;

    // Validate inputs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!project_id || !uuidRegex.test(project_id)) {
      return new Response(JSON.stringify({ error: "Ogiltigt projekt-ID." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 5000) {
      return new Response(JSON.stringify({ error: "Ogiltigt meddelande." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const validCategories = ["bugfix", "upgrade", "new_feature", "other"];
    const validPriorities = ["low", "normal", "urgent"];
    const safeCategory = validCategories.includes(category) ? category : "other";
    const safePriority = validPriorities.includes(priority) ? priority : "normal";

    // Use service role for quota check to bypass RLS
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify user owns this project
    const { data: project, error: projectError } = await serviceClient
      .from("projects")
      .select("id, monthly_quota, client_user_id")
      .eq("id", project_id)
      .single();

    if (projectError || !project) {
      return new Response(JSON.stringify({ error: "Projektet hittades inte." }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (project.client_user_id !== userId) {
      return new Response(JSON.stringify({ error: "Åtkomst nekad." }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Count non-cancelled requests this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count, error: countError } = await serviceClient
      .from("client_requests")
      .select("id", { count: "exact", head: true })
      .eq("project_id", project_id)
      .neq("status", "cancelled")
      .gte("created_at", monthStart);

    if (countError) {
      console.error("Count error:", countError);
      return new Response(JSON.stringify({ error: "Ett fel uppstod." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if ((count ?? 0) >= project.monthly_quota) {
      return new Response(
        JSON.stringify({ error: "Du har använt alla dina ärenden för denna månad." }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Insert using the user's auth context (respects RLS)
    const { data: inserted, error: insertError } = await supabase
      .from("client_requests")
      .insert({
        project_id,
        user_id: userId,
        message: message.trim(),
        category: safeCategory,
        priority: safePriority,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Kunde inte skicka ärendet." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send notification to admins
    try {
      const notifyRes = await fetch(
        `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-notification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          },
          body: JSON.stringify({
            type: "email_new_request",
            project_id,
            project_name: project.name || project_id,
            preview: message.trim().substring(0, 200),
          }),
        }
      );
      if (!notifyRes.ok) console.error("Notification failed:", await notifyRes.text());
    } catch (e) {
      console.error("Notification error:", e);
    }

    return new Response(JSON.stringify({ data: inserted }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Ett oväntat fel uppstod." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
