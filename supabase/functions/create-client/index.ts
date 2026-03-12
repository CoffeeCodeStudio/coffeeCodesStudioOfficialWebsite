import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

function buildWelcomeEmail(clientName: string, projectName: string, loginUrl: string): string {
  const name = clientName || "Kund";
  return `
<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0F0F1A;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0F0F1A;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1A1A2E 0%,#16162A 100%);border-radius:20px;border:1px solid rgba(255,193,7,0.15);overflow:hidden;">
        
        <!-- Header with logo area -->
        <tr><td style="padding:40px 40px 24px;text-align:center;border-bottom:1px solid rgba(255,193,7,0.1);">
          <div style="display:inline-block;background:rgba(255,193,7,0.1);border-radius:16px;padding:16px 24px;margin-bottom:16px;">
            <span style="font-size:36px;">☕</span>
            <span style="font-size:20px;color:#FFC107;font-weight:700;margin-left:8px;vertical-align:middle;letter-spacing:0.5px;">Coffee Code Studio</span>
          </div>
        </td></tr>

        <!-- Welcome message -->
        <tr><td style="padding:40px;">
          <h1 style="color:#FFC107;font-size:26px;font-weight:700;margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;">Välkommen, ${name}!</h1>
          <p style="color:#B0B0C8;font-size:15px;line-height:1.7;margin:0 0 24px;">
            Vi är glada att ha dig ombord. Ditt konto hos Coffee Code Studio har skapats och ditt projekt är redo.
          </p>

          <!-- Project card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,193,7,0.06);border:1px solid rgba(255,193,7,0.12);border-radius:14px;margin-bottom:28px;">
            <tr><td style="padding:20px 24px;">
              <p style="color:#FFC107;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin:0 0 6px;font-weight:600;">Ditt projekt</p>
              <p style="color:#E8E8F0;font-size:18px;font-weight:600;margin:0;">${projectName}</p>
            </td></tr>
          </table>

          <!-- What's next -->
          <p style="color:#FFC107;font-size:13px;text-transform:uppercase;letter-spacing:1.2px;font-weight:600;margin:0 0 14px;">Så här kommer du igång</p>
          
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr><td style="padding:10px 0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="background:rgba(255,193,7,0.12);border-radius:50%;width:32px;height:32px;text-align:center;vertical-align:middle;"><span style="color:#FFC107;font-size:14px;font-weight:700;">1</span></td>
                <td style="padding-left:14px;color:#C8C8DA;font-size:14px;line-height:1.5;">Klicka på länken i ditt inbjudningsmail för att sätta ditt lösenord</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:10px 0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="background:rgba(255,193,7,0.12);border-radius:50%;width:32px;height:32px;text-align:center;vertical-align:middle;"><span style="color:#FFC107;font-size:14px;font-weight:700;">2</span></td>
                <td style="padding-left:14px;color:#C8C8DA;font-size:14px;line-height:1.5;">Logga in på din kundportal</td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:10px 0;">
              <table cellpadding="0" cellspacing="0"><tr>
                <td style="background:rgba(255,193,7,0.12);border-radius:50%;width:32px;height:32px;text-align:center;vertical-align:middle;"><span style="color:#FFC107;font-size:14px;font-weight:700;">3</span></td>
                <td style="padding-left:14px;color:#C8C8DA;font-size:14px;line-height:1.5;">Följ projektets framsteg, chatta med oss och ladda upp filer</td>
              </tr></table>
            </td></tr>
          </table>

          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center">
              <a href="${loginUrl}" style="display:inline-block;background:linear-gradient(135deg,#FFC107 0%,#E8A817 100%);color:#1A1A2E;padding:14px 40px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.3px;">
                Gå till kundportalen →
              </a>
            </td></tr>
          </table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:24px 40px;border-top:1px solid rgba(255,193,7,0.1);text-align:center;">
          <p style="color:#5A5A72;font-size:12px;margin:0;line-height:1.6;">
            Coffee Code Studio · Skräddarsydda webbapplikationer<br/>
            Om du har frågor, svara gärna på detta mail.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

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
    console.log("Auth header present:", !!authHeader);
    if (!authHeader || !authHeader.startsWith("Bearer ")) throw new Error("Unauthorized - no valid auth header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller }, error: userError } = await supabaseAdmin.auth.getUser(token);
    console.log("getUser result:", caller?.id, "error:", userError?.message);
    if (userError || !caller) throw new Error("Unauthorized - invalid token");

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

    // Invite user
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { full_name },
      redirectTo: 'https://coffeecodestudio.lovable.app/set-password',
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

    // Send branded welcome email via Resend
    if (RESEND_API_KEY) {
      try {
        const loginUrl = "https://coffeecodestudio.lovable.app/client-login";
        const emailHtml = buildWelcomeEmail(full_name, project_name, loginUrl);

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "Coffee Code Studio <onboarding@resend.dev>",
            to: [email],
            subject: `Välkommen till Coffee Code Studio, ${full_name || ""}!`.trim(),
            html: emailHtml,
          }),
        });

        if (!emailRes.ok) {
          const err = await emailRes.json();
          console.error("Welcome email failed:", err);
        } else {
          console.log("Welcome email sent to", email);
        }
      } catch (emailErr) {
        console.error("Error sending welcome email:", emailErr);
      }
    }

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