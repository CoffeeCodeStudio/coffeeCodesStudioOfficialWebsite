import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getUser(token);
    if (claimsError || !claimsData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { projectName } = await req.json();
    const safeProjectName = escapeHtml(String(projectName || "Okänt projekt"));

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Coffee Code Studio <onboarding@resend.dev>",
        to: ["CoffeeCodeStudios@gmail.com"],
        subject: `✅ Alla blockerande punkter klara: ${safeProjectName}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#1A1A2E;border-radius:16px;border:1px solid rgba(16,185,129,0.3);">
            <h1 style="color:#10B981;font-size:22px;text-align:center;">🚀 Redo för lansering!</h1>
            <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
              <p style="color:#E0E0E0;font-size:16px;margin:6px 0;">
                <strong style="color:#FFC107;">${safeProjectName}</strong>
              </p>
              <p style="color:#10B981;font-size:14px;margin:12px 0;">
                Alla 6 blockerande checklistpunkter är nu avklarade.
              </p>
              <p style="color:#E0E0E0;font-size:13px;margin:8px 0;">
                Projektet är redo att gå live.
              </p>
            </div>
            <p style="color:#666;font-size:11px;text-align:center;margin-top:16px;">
              Logga in på admin-panelen för att granska och publicera.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Resend error:", err);
      throw new Error(err.message || "Email failed");
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("notify-checklist-complete error:", error);
    return new Response(JSON.stringify({ error: "Ett internt fel uppstod." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
