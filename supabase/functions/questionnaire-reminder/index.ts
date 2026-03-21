import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Verify authorization - only allow calls with the dedicated CRON_SECRET
  const authHeader = req.headers.get("Authorization");
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (!cronSecret || !authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    // Find projects with status 'questionnaire', created > 24h ago, not yet reminded
    const { data: projects, error: projError } = await supabase
      .from("projects")
      .select("id, name, client_user_id, created_at")
      .eq("status", "questionnaire")
      .lt("created_at", cutoff)
      .is("questionnaire_reminded_at", null);

    if (projError) throw projError;
    if (!projects?.length) {
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let sent = 0;

    for (const project of projects) {
      // Get client email from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("id", project.client_user_id)
        .single();

      if (!profile?.email) continue;

      const firstName = profile.full_name?.split(" ")[0] || "";
      const greeting = firstName ? `Hej ${firstName}!` : "Hej!";

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Coffee Code Studio <hej@coffeecodestudio.se>",
          to: [profile.email],
          subject: "Påminnelse: Dina projektfrågor väntar",
          html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#1A1A2E;border-radius:16px;border:1px solid rgba(255,193,7,0.2);">
              <div style="text-align:center;margin-bottom:24px;">
                <span style="font-size:32px;">☕</span>
                <h2 style="color:#FFC107;font-size:18px;margin:8px 0 0;">Coffee Code Studio</h2>
              </div>
              <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:24px;">
                <p style="color:#E0E0E0;font-size:15px;line-height:1.7;margin:0 0 16px;">
                  ${greeting}
                </p>
                <p style="color:#E0E0E0;font-size:15px;line-height:1.7;margin:0 0 16px;">
                  Jag hoppas allt är bra. Jag ser fram emot att komma igång med ditt projekt <strong style="color:#FFC107;">${project.name}</strong>, men behöver dina svar på projektfrågorna för att kunna börja designa.
                </p>
                <p style="color:#E0E0E0;font-size:15px;line-height:1.7;margin:0;">
                  Har du hunnit kika på dem? Svara gärna så snart du kan så att vi inte tappar momentum!
                </p>
              </div>
              <p style="color:#666;font-size:11px;text-align:center;margin-top:20px;">
                Coffee Code Studio · coffeecodestudio.se
              </p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        // Mark as reminded
        await supabase
          .from("projects")
          .update({ questionnaire_reminded_at: new Date().toISOString() })
          .eq("id", project.id);

        // Log it
        await supabase.from("status_logs").insert({
          project_id: project.id,
          message: "Automatisk påminnelse skickad om projektfrågor",
          author_name: "System",
          event_type: "reminder",
        });

        sent++;
      } else {
        const err = await res.json();
        console.error(`Failed to send reminder for ${project.id}:`, err);
      }
    }

    return new Response(JSON.stringify({ sent }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("questionnaire-reminder error:", error);
    return new Response(JSON.stringify({ error: 'Ett internt fel uppstod.' }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
