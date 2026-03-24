const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const PRIMARY_FROM = "Coffee Code Studio <hej@coffeecodestudio.se>";
const FALLBACK_FROM = "Coffee Code Studio <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// --- In-memory IP rate limiting ---
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3; // max 3 emails per IP per hour

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

interface ContactEmailRequest {
  name: string;
  company?: string;
  email: string;
  projectType: string;
  budget?: string;
  message: string;
  website?: string; // honeypot field — should always be empty
}

interface ResendResult {
  ok: boolean;
  status: number;
  data: Record<string, unknown>;
}

const projectTypeLabels: Record<string, string> = {
  webapp: "Webbapplikation",
  internal: "Internt verktyg",
  saas: "SaaS-plattform",
  other: "Annat",
};

async function sendEmailViaResend(
  payload: {
    to: string[];
    reply_to: string;
    subject: string;
    html: string;
  },
  from: string,
): Promise<ResendResult> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({ ...payload, from }),
  });

  const rawBody = await response.text();
  let data: Record<string, unknown> = {};

  try {
    data = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    data = { message: rawBody };
  }

  return { ok: response.ok, status: response.status, data };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Rate limiting by IP ---
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: "För många förfrågningar. Försök igen senare." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } },
      );
    }

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Serverfel. Försök igen senare." }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { name, company, email, projectType, budget, message, website }: ContactEmailRequest = await req.json();

    // --- Honeypot check: if filled, silently succeed ---
    if (website) {
      return new Response(JSON.stringify({ success: true, message: "E-post skickad!" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!name || !email || !projectType || !message) {
      return new Response(JSON.stringify({ error: "Alla obligatoriska fält måste fyllas i" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Ogiltig e-postadress" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (name.length > 100 || email.length > 255 || message.length > 5000) {
      return new Response(JSON.stringify({ error: "Fälten överskrider maxlängd" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company || "Ej angivet");
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const projectTypeLabel = projectTypeLabels[projectType] || escapeHtml(projectType);

    const payload = {
      to: ["coffeecodestudios@gmail.com"],
      reply_to: email,
      subject: `Ny kontaktförfrågan från ${safeName}`,
      html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
          <body style="font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #1A1A2E;">
            <div style="background: linear-gradient(135deg, #2D2D44 0%, #1A1A2E 100%); border-radius: 16px; padding: 32px; border: 1px solid rgba(255, 193, 7, 0.2);">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 48px;">☕</span>
                <h1 style="color: #FFC107; margin: 16px 0 8px; font-size: 24px;">Ny Kontaktförfrågan</h1>
                <p style="color: #8B8B9E; margin: 0;">Coffee Code Studio</p>
              </div>
              <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                <h2 style="color: #FFC107; font-size: 18px; margin-top: 0;">Kontaktuppgifter</h2>
                <p style="color: #E0E0E0; margin: 8px 0;"><strong style="color: #FFC107;">Namn:</strong> ${safeName}</p>
                <p style="color: #E0E0E0; margin: 8px 0;"><strong style="color: #FFC107;">Företag:</strong> ${safeCompany}</p>
                <p style="color: #E0E0E0; margin: 8px 0;"><strong style="color: #FFC107;">E-post:</strong> ${safeEmail}</p>
                <p style="color: #E0E0E0; margin: 8px 0;"><strong style="color: #FFC107;">Projekttyp:</strong> ${projectTypeLabel}</p>
              </div>
              <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px;">
                <h2 style="color: #FFC107; font-size: 18px; margin-top: 0;">Meddelande</h2>
                <p style="color: #E0E0E0; white-space: pre-wrap;">${safeMessage}</p>
              </div>
              <p style="color: #666; font-size: 12px; text-align: center; margin-top: 24px;">
                Detta meddelande skickades via kontaktformuläret på coffeecodestudio.lovable.app
              </p>
            </div>
          </body>
          </html>
        `,
    };

    const primarySend = await sendEmailViaResend(payload, PRIMARY_FROM);

    if (!primarySend.ok) {
      console.error("Resend API error (primary):", primarySend.data);

      const resendMessage = String(primarySend.data?.message || "");
      const isDomainNotVerified = primarySend.status === 403 && /domain is not verified/i.test(resendMessage);

      if (isDomainNotVerified) {
        const fallbackSend = await sendEmailViaResend(payload, FALLBACK_FROM);

        if (fallbackSend.ok) {
          return new Response(
            JSON.stringify({
              success: true,
              message: "E-post skickad via tillfällig avsändare (onboarding@resend.dev)",
              sender: "fallback",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        console.error("Resend API error (fallback):", fallbackSend.data);
        throw new Error("Failed to send email");
      }

      throw new Error("Failed to send email");
    }

    return new Response(JSON.stringify({ success: true, message: "E-post skickad!", sender: "primary" }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ error: 'Kunde inte skicka e-post. Försök igen.' }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
