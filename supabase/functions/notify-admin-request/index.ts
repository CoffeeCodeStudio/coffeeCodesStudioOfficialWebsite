import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const categoryLabels: Record<string, string> = {
  bugfix: "🐛 Bugfix",
  upgrade: "⚡ Uppgradering",
  new_feature: "✨ Ny funktion",
  other: "💬 Övrigt",
};

const priorityLabels: Record<string, string> = {
  low: "Låg",
  normal: "Normal",
  urgent: "🔥 Brådskande",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, category, priority, projectName, clientEmail } = await req.json();

    const catLabel = categoryLabels[category] || category;
    const prioLabel = priorityLabels[priority] || priority;
    const isUrgent = priority === "urgent";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Coffee Code Studio <onboarding@resend.dev>",
        to: ["CoffeeCodeStudios@gmail.com"],
        subject: `${isUrgent ? "🔥 BRÅDSKANDE: " : ""}Nytt ärende från ${clientEmail || "kund"}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#1A1A2E;border-radius:16px;border:1px solid rgba(255,193,7,0.2);">
            <h1 style="color:#FFC107;font-size:20px;text-align:center;">Nytt kundärende</h1>
            <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin:16px 0;">
              <p style="color:#E0E0E0;margin:6px 0;"><strong style="color:#FFC107;">Projekt:</strong> ${projectName || "—"}</p>
              <p style="color:#E0E0E0;margin:6px 0;"><strong style="color:#FFC107;">Kund:</strong> ${clientEmail || "—"}</p>
              <p style="color:#E0E0E0;margin:6px 0;"><strong style="color:#FFC107;">Kategori:</strong> ${catLabel}</p>
              <p style="color:#E0E0E0;margin:6px 0;"><strong style="color:#FFC107;">Prioritet:</strong> ${prioLabel}</p>
            </div>
            <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;">
              <h2 style="color:#FFC107;font-size:16px;margin-top:0;">Meddelande</h2>
              <p style="color:#E0E0E0;white-space:pre-wrap;">${message}</p>
            </div>
            <p style="color:#666;font-size:11px;text-align:center;margin-top:16px;">Logga in på admin-panelen för att hantera ärendet.</p>
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
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
