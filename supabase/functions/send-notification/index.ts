import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = "Coffee Code Studio <hej@coffeecodestudio.se>";
const PORTAL_URL = "https://coffeecodestudio.lovable.app/portal";
const ADMIN_URL = "https://coffeecodestudio.lovable.app/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://coffeecodestudio.se",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NotificationPayload {
  type: string;
  user_id?: string;
  target_user_id?: string;
  project_id?: string;
  project_name?: string;
  is_admin_sender?: boolean;
  preview?: string;
  file_name?: string;
  old_status?: string;
  new_status?: string;
  category?: string;
  subject?: string;
  html?: string;
}

function brandedHtml(title: string, body: string, ctaUrl: string, ctaText: string): string {
  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#0f1225;font-family:Arial,sans-serif;">
<div style="max-width:560px;margin:40px auto;background:#161a33;border-radius:16px;border:1px solid rgba(235,195,60,0.15);overflow:hidden;">
  <div style="padding:24px 32px;border-bottom:1px solid rgba(235,195,60,0.1);text-align:center;">
    <span style="font-size:20px;font-weight:700;color:#ebc33c;font-family:Georgia,serif;">Coffee Code Studio</span>
  </div>
  <div style="padding:32px;">
    <h2 style="color:#f0e6c8;font-size:18px;margin:0 0 16px;font-family:Georgia,serif;">${title}</h2>
    <div style="color:#9098b8;font-size:14px;line-height:1.6;">${body}</div>
    <div style="margin-top:28px;text-align:center;">
      <a href="${ctaUrl}" style="display:inline-block;padding:12px 28px;background:#ebc33c;color:#0f1225;border-radius:8px;font-size:14px;font-weight:600;text-decoration:none;">${ctaText}</a>
    </div>
  </div>
  <div style="padding:16px 32px;border-top:1px solid rgba(255,255,255,0.05);text-align:center;">
    <p style="color:#555b78;font-size:11px;margin:0;">© ${new Date().getFullYear()} Coffee Code Studio</p>
  </div>
</div>
</body></html>`;
}

const templates: Record<string, (p: NotificationPayload) => { subject: string; html: string }> = {
  email_new_message: (p) => ({
    subject: `Nytt meddelande – ${p.project_name || 'ditt projekt'}`,
    html: brandedHtml(
      'Nytt meddelande',
      `<p>Du har fått ett nytt meddelande i projektet <strong>${p.project_name || ''}</strong>.</p>
       ${p.preview ? `<p style="background:rgba(255,255,255,0.04);padding:12px 16px;border-radius:8px;border-left:3px solid #ebc33c;margin:16px 0;color:#c0c6de;font-style:italic;">"${p.preview}"</p>` : ''}`,
      p.is_admin_sender ? PORTAL_URL : ADMIN_URL,
      p.is_admin_sender ? 'Öppna kundportalen' : 'Öppna admin'
    ),
  }),
  email_status_update: (p) => ({
    subject: `Statusuppdatering – ${p.project_name || 'ditt ärende'}`,
    html: brandedHtml(
      'Statusuppdatering',
      `<p>Ditt ärende i <strong>${p.project_name || ''}</strong> (${p.category || ''}) har uppdaterats:</p>
       <p style="margin:12px 0;"><span style="color:#ef5350;text-decoration:line-through;">${p.old_status}</span> → <span style="color:#66bb6a;font-weight:600;">${p.new_status}</span></p>`,
      PORTAL_URL,
      'Se status i portalen'
    ),
  }),
  email_file_upload: (p) => ({
    subject: `Ny fil uppladdad – ${p.project_name || ''}`,
    html: brandedHtml(
      'Ny fil uppladdad',
      `<p>En kund har laddat upp en ny fil i projektet <strong>${p.project_name || ''}</strong>:</p>
       <p style="color:#ebc33c;font-weight:600;">📎 ${p.file_name || 'Okänd fil'}</p>`,
      ADMIN_URL,
      'Öppna admin'
    ),
  }),
  email_agreement_signed: (p) => ({
    subject: `Avtal signerat – ${p.project_name || ''}`,
    html: brandedHtml(
      'Avtal signerat',
      `<p>Avtalet för projektet <strong>${p.project_name || ''}</strong> har signerats.</p>`,
      ADMIN_URL,
      'Visa i admin'
    ),
  }),
  email_new_request: (p) => ({
    subject: `Nytt ärende – ${p.project_name || ''}`,
    html: brandedHtml(
      'Nytt ärende inkommet',
      `<p>Ett nytt ärende har skapats i projektet <strong>${p.project_name || ''}</strong>.</p>
       ${p.preview ? `<p style="background:rgba(255,255,255,0.04);padding:12px 16px;border-radius:8px;border-left:3px solid #ebc33c;margin:16px 0;color:#c0c6de;">"${p.preview}"</p>` : ''}`,
      ADMIN_URL,
      'Hantera i admin'
    ),
  }),
  test: (p) => ({
    subject: 'Testmail – Coffee Code Studio',
    html: brandedHtml(
      'Testmail',
      '<p>Det här är ett testmail för att verifiera att dina notifieringsinställningar fungerar korrekt.</p><p>✅ Allt fungerar!</p>',
      PORTAL_URL,
      'Öppna portalen'
    ),
  }),
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload: NotificationPayload = await req.json();
    const { type } = payload;
    console.log("[send-notification] Incoming payload:", JSON.stringify({ type, project_id: payload.project_id, project_name: payload.project_name }));

    if (!type) {
      return new Response(JSON.stringify({ error: "type required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    // Look up project info if needed
    if (payload.project_id && !payload.project_name) {
      const { data: proj } = await adminClient
        .from("projects")
        .select("name, client_user_id")
        .eq("id", payload.project_id)
        .single();
      if (proj) {
        payload.project_name = proj.name;
        if (payload.is_admin_sender && !payload.target_user_id) {
          payload.target_user_id = proj.client_user_id;
        }
      }
    }

    // Determine recipients
    const recipientEmails: string[] = [];

    if (payload.subject && payload.html && payload.user_id) {
      // Direct send mode (custom subject/html)
      const { data: profile } = await adminClient
        .from("profiles")
        .select("email")
        .eq("id", payload.user_id)
        .single();
      if (profile?.email) recipientEmails.push(profile.email);
    } else if (type === "test" && payload.user_id) {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("email")
        .eq("id", payload.user_id)
        .single();
      if (profile?.email) recipientEmails.push(profile.email);
    } else if (type === "email_new_message") {
      if (payload.is_admin_sender && payload.target_user_id) {
        // Admin sent message → notify client
        const { data: pref } = await adminClient
          .from("notification_preferences")
          .select("email_new_message")
          .eq("user_id", payload.target_user_id)
          .maybeSingle();
        if (pref === null || pref.email_new_message !== false) {
          const { data: profile } = await adminClient
            .from("profiles")
            .select("email")
            .eq("id", payload.target_user_id)
            .single();
          if (profile?.email) recipientEmails.push(profile.email);
        }
      } else {
        // Client sent message → notify all admins
        const { data: admins } = await adminClient
          .from("user_roles")
          .select("user_id")
          .eq("role", "admin");
        if (admins) {
          for (const admin of admins) {
            const { data: pref } = await adminClient
              .from("notification_preferences")
              .select("email_new_message")
              .eq("user_id", admin.user_id)
              .maybeSingle();
            if (pref === null || pref.email_new_message !== false) {
              const { data: profile } = await adminClient
                .from("profiles")
                .select("email")
                .eq("id", admin.user_id)
                .single();
              if (profile?.email) recipientEmails.push(profile.email);
            }
          }
        }
      }
    } else if (type === "email_status_update" && payload.user_id) {
      const { data: pref } = await adminClient
        .from("notification_preferences")
        .select("email_status_update")
        .eq("user_id", payload.user_id)
        .maybeSingle();
      if (pref === null || pref.email_status_update !== false) {
        const { data: profile } = await adminClient
          .from("profiles")
          .select("email")
          .eq("id", payload.user_id)
          .single();
        if (profile?.email) recipientEmails.push(profile.email);
      }
    } else if (type === "email_file_upload") {
      // Notify all admins
      const { data: admins } = await adminClient
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (admins) {
        for (const admin of admins) {
          const { data: pref } = await adminClient
            .from("notification_preferences")
            .select("email_file_upload")
            .eq("user_id", admin.user_id)
            .maybeSingle();
          if (pref !== null && pref.email_file_upload === true) {
            const { data: profile } = await adminClient
              .from("profiles")
              .select("email")
              .eq("id", admin.user_id)
              .single();
            if (profile?.email) recipientEmails.push(profile.email);
          }
        }
      }
    } else if (type === "email_agreement_signed") {
      // Notify all admins
      const { data: admins } = await adminClient
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (admins) {
        for (const admin of admins) {
          const { data: pref } = await adminClient
            .from("notification_preferences")
            .select("email_agreement_signed")
            .eq("user_id", admin.user_id)
            .maybeSingle();
          if (pref === null || pref.email_agreement_signed !== false) {
            const { data: profile } = await adminClient
              .from("profiles")
              .select("email")
              .eq("id", admin.user_id)
              .single();
            if (profile?.email) recipientEmails.push(profile.email);
          }
        }
      }
      // Also notify client if they have target_user_id
      if (payload.target_user_id) {
        const { data: pref } = await adminClient
          .from("notification_preferences")
          .select("email_agreement_signed")
          .eq("user_id", payload.target_user_id)
          .maybeSingle();
        if (pref === null || pref.email_agreement_signed !== false) {
          const { data: profile } = await adminClient
            .from("profiles")
            .select("email")
            .eq("id", payload.target_user_id)
            .single();
          if (profile?.email) recipientEmails.push(profile.email);
        }
      }
    } else if (type === "email_new_request") {
      // Notify all admins
      const { data: admins } = await adminClient
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (admins) {
        for (const admin of admins) {
          const { data: pref } = await adminClient
            .from("notification_preferences")
            .select("email_new_request")
            .eq("user_id", admin.user_id)
            .maybeSingle();
          if (pref === null || pref.email_new_request !== false) {
            const { data: profile } = await adminClient
              .from("profiles")
              .select("email")
              .eq("id", admin.user_id)
              .single();
            if (profile?.email) recipientEmails.push(profile.email);
          }
        }
      }
    }

    if (recipientEmails.length === 0) {
      return new Response(JSON.stringify({ skipped: true, reason: "No recipients (preference disabled or not found)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate email content
    let subject: string;
    let html: string;

    if (payload.subject && payload.html) {
      subject = payload.subject;
      html = payload.html;
    } else {
      const templateFn = templates[type];
      if (!templateFn) {
        return new Response(JSON.stringify({ error: `Unknown notification type: ${type}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const result = templateFn(payload);
      subject = result.subject;
      html = result.html;
    }

    // Send to each recipient
    const results = [];
    for (const email of recipientEmails) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject,
          html,
        }),
      });
      const data = await res.json();
      results.push({ email, status: res.status, data });
    }

    return new Response(JSON.stringify({ sent: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-notification error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
