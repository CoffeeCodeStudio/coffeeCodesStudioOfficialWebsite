import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Parse body first
    const body = await req.json();
    const { user_id } = body;
    if (!user_id) throw new Error("user_id is required");

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");

    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await supabaseAdmin.auth.getUser(token);
    if (!caller) throw new Error("Unauthorized");

    const { data: roleCheck } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id)
      .eq("role", "admin")
      .single();

    if (!roleCheck) throw new Error("Not an admin");

    // Prevent deleting yourself
    if (user_id === caller.id) {
      throw new Error("Cannot delete your own account");
    }

    // Get all projects for this user
    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("id")
      .eq("client_user_id", user_id);

    const projectIds = (projects || []).map((p: { id: string }) => p.id);

    // Delete all related data for each project (order matters for FK constraints)
    if (projectIds.length > 0) {
      await supabaseAdmin.from("workflow_checklists").delete().in("project_id", projectIds);
      await supabaseAdmin.from("ai_chat_messages").delete().in("project_id", projectIds);
      await supabaseAdmin.from("client_requests").delete().in("project_id", projectIds);
      await supabaseAdmin.from("project_messages").delete().in("project_id", projectIds);
      await supabaseAdmin.from("project_todos").delete().in("project_id", projectIds);
      await supabaseAdmin.from("status_logs").delete().in("project_id", projectIds);
      await supabaseAdmin.from("project_files").delete().in("project_id", projectIds);
      await supabaseAdmin.from("project_agreements").delete().in("project_id", projectIds);
      await supabaseAdmin.from("projects").delete().in("id", projectIds);
    }

    // Delete user role and profile
    await supabaseAdmin.from("user_roles").delete().eq("user_id", user_id);
    await supabaseAdmin.from("profiles").delete().eq("id", user_id);

    // Delete auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);
    if (deleteError) throw deleteError;

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("delete-client error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
