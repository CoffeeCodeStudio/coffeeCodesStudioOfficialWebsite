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

    const { email, full_name, project_name, project_description } = await req.json();

    if (!email || !project_name) {
      throw new Error("Email and project name are required");
    }

    // Use inviteUserByEmail instead of createUser
    // This sends an invite email with a link to set password
    const redirectUrl = Deno.env.get("SUPABASE_URL")?.replace('.supabase.co', '.lovable.app') || 'https://coffeecodestudio.lovable.app';
    
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { full_name },
      redirectTo: `${redirectUrl}/set-password`,
    });

    if (inviteError) throw inviteError;

    const newUserId = inviteData.user.id;

    // Assign 'user' role
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: newUserId, role: "user" });

    if (roleError) {
      console.error("Failed to assign user role:", roleError.message);
    }

    // Create profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({ 
        id: newUserId, 
        email, 
        full_name: full_name || null 
      });

    if (profileError) {
      console.error("Failed to create profile:", profileError.message);
    }

    // Create project linked to user
    const { data: project, error: projError } = await supabaseAdmin
      .from("projects")
      .insert({
        client_user_id: newUserId,
        name: project_name,
        description: project_description || null,
        status: "design",
      })
      .select()
      .single();

    if (projError) throw projError;

    return new Response(JSON.stringify({ 
      user: inviteData.user, 
      project,
      message: "Invitation sent successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
