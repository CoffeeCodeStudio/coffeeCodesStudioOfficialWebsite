const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

interface ContactEmailRequest {
  name: string;
  company?: string;
  email: string;
  projectType: string;
  message: string;
}

const projectTypeLabels: Record<string, string> = {
  webapp: "Webbapplikation",
  internal: "Internt verktyg",
  saas: "SaaS-plattform",
  other: "Annat",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, company, email, projectType, message }: ContactEmailRequest = await req.json();

    // Validate required fields
    if (!name || !email || !projectType || !message) {
      return new Response(
        JSON.stringify({ error: "Alla obligatoriska fält måste fyllas i" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Ogiltig e-postadress" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate input lengths
    if (name.length > 100 || email.length > 255 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Fälten överskrider maxlängd" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company || "Ej angivet");
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);
    const projectTypeLabel = projectTypeLabels[projectType] || escapeHtml(projectType);

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Coffee Code Studio <hej@coffeecodestudio.se>",
        to: ["hej@coffeecodestudio.se"],
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
                <p style="color: #E0E0E0; margin: 8px 0;"><strong style="color: #FFC107;">E-post:</strong> <a href="mailto:${safeEmail}" style="color: #00BCD4;">${safeEmail}</a></p>
                <p style="color: #E0E0E0; margin: 8px 0;"><strong style="color: #FFC107;">Projekttyp:</strong> ${projectTypeLabel}</p>
              </div>
              <div style="background: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px;">
                <h2 style="color: #FFC107; font-size: 18px; margin-top: 0;">Meddelande</h2>
                <p style="color: #E0E0E0; white-space: pre-wrap;">${safeMessage}</p>
              </div>
              <div style="text-align: center; margin-top: 24px;">
                <a href="mailto:${safeEmail}" style="display: inline-block; background: linear-gradient(135deg, #FFC107 0%, #E8A87C 100%); color: #1A1A2E; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">Svara kunden</a>
              </div>
              <p style="color: #666; font-size: 12px; text-align: center; margin-top: 24px;">
                Detta meddelande skickades via kontaktformuläret på coffeecodestudio.lovable.app
              </p>
            </div>
          </body>
          </html>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json();
      console.error("Resend API error:", errorData);
      throw new Error(errorData.message || "Failed to send email");
    }

    return new Response(
      JSON.stringify({ success: true, message: "E-post skickad!" }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Kunde inte skicka e-post" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});
