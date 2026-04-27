import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://coffeecodestudio.se',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function drawLine(page: any, y: number) {
  page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) });
}

function drawSection(page: any, lines: string[], startY: number, font: any, boldFont: any, fontSize = 10): number {
  let y = startY;
  for (const line of lines) {
    if (y < 60) break;
    const isBold = line.startsWith('##');
    const text = isBold ? line.slice(2).trim() : line;
    const usedFont = isBold ? boldFont : font;
    const size = isBold ? 11 : fontSize;
    page.drawText(text, { x: 50, y, size, font: usedFont, color: rgb(0.15, 0.15, 0.15) });
    y -= size + 6;
  }
  return y;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const userClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { agreement_id } = await req.json();
    if (!agreement_id) {
      return new Response(JSON.stringify({ error: 'agreement_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    const { data: agreement, error: agError } = await adminClient
      .from('project_pub_agreements')
      .select('id, project_id, status')
      .eq('id', agreement_id)
      .single();

    if (agError || !agreement) {
      return new Response(JSON.stringify({ error: 'Agreement not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (agreement.status !== 'sent') {
      return new Response(JSON.stringify({ error: 'Agreement is not in sent status' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: project } = await adminClient
      .from('projects')
      .select('client_user_id, name')
      .eq('id', agreement.project_id)
      .single();

    if (!project || project.client_user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: profile } = await adminClient
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const clientName = profile?.full_name || profile?.email || user.email || 'Okänd';
    const clientEmail = profile?.email || user.email || '';

    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || 'Okänd';

    const now = new Date().toISOString();
    const signedDate = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' });
    const currentYear = new Date().getFullYear();

    const { error: updateError } = await adminClient
      .from('project_pub_agreements')
      .update({
        status: 'signed',
        signed_at: now,
        signed_ip: clientIp,
      })
      .eq('id', agreement_id);

    if (updateError) {
      console.error('sign-pub-agreement update error:', updateError);
      return new Response(JSON.stringify({ error: 'Kunde inte signera avtalet. Försök igen.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate PDF
    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const page = pdfDoc.addPage([595, 842]);
      let y = 780;

      // Embed logo
      try {
        const logoRes = await fetch(`${supabaseUrl}/storage/v1/object/public/portfolio-images/logo-pdf.png`);
        if (logoRes.ok) {
          const logoBytes = new Uint8Array(await logoRes.arrayBuffer());
          const logoImage = await pdfDoc.embedPng(logoBytes);
          const logoDim = logoImage.scale(0.1);
          page.drawImage(logoImage, { x: 50, y: y - logoDim.height + 20, width: logoDim.width, height: logoDim.height });
          page.drawText('PERSONUPPGIFTSBITRADESAVTAL', { x: 50 + logoDim.width + 12, y, size: 18, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
          y -= 28;
          page.drawText('Coffee Code Studio', { x: 50 + logoDim.width + 12, y, size: 12, font: boldFont, color: rgb(0.25, 0.25, 0.25) });
          y -= 16;
          page.drawText('Goteborg, Sverige | hej@coffeecodestudio.se', { x: 50 + logoDim.width + 12, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
          y -= 24;
        } else {
          throw new Error('Logo fetch failed');
        }
      } catch {
        page.drawText('PERSONUPPGIFTSBITRADESAVTAL', { x: 50, y, size: 18, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
        y -= 28;
        page.drawText('Coffee Code Studio', { x: 50, y, size: 12, font: boldFont, color: rgb(0.25, 0.25, 0.25) });
        y -= 16;
        page.drawText('Goteborg, Sverige | hej@coffeecodestudio.se', { x: 50, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
        y -= 24;
      }

      drawLine(page, y);
      y -= 20;

      // Parties
      y = drawSection(page, [
        '##PERSONUPPGIFTSANSVARIG (KUND)',
        clientName,
        clientEmail,
      ], y, font, boldFont, 9);
      y -= 10;

      y = drawSection(page, [
        '##PERSONUPPGIFTSBITRADE (LEVERANTOR)',
        'Coffee Code Studio, enskild firma',
        'Goteborg, Sverige',
        'hej@coffeecodestudio.se',
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y);
      y -= 20;

      // Project
      y = drawSection(page, [
        '##PROJEKT',
        `Projektnamn: ${project.name}`,
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y);
      y -= 20;

      // Scope
      y = drawSection(page, [
        '##BEHANDLINGENS SYFTE OCH OMFATTNING',
        'Personuppgiftsbitradet behandlar personuppgifter for att tillhandahalla',
        'den tjanst som avtalats i projektavtalet. Behandlingen omfattar:',
        '',
        '  - Namn och kontaktuppgifter',
        '  - E-postadresser',
        '  - IP-adresser (for sakerhetsloggning)',
        '  - Ovriga uppgifter som lagras i projektets databas',
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y);
      y -= 20;

      // Sub-processors
      y = drawSection(page, [
        '##UNDERBITRADEN',
        'Foljande underbitraden anvands for att leverera tjansten:',
        '',
        '  - Supabase Inc. (databas och autentisering, EU/US)',
        '  - Resend Inc. (e-postutskick, US)',
        '  - Lovable / GPT Engineer (hosting, EU)',
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y);
      y -= 20;

      // Security & deletion
      y = drawSection(page, [
        '##SAKERHET OCH RADERING',
        'Personuppgiftsbitradet vidtar lampliga tekniska och organisatoriska',
        'atgarder for att skydda personuppgifter, inklusive kryptering vid',
        'overforing och lagring, samt raderar personuppgifter automatiskt',
        'efter 24 manader eller vid avtalets upphorande.',
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y);
      y -= 20;

      // Digital signature
      y = drawSection(page, [
        '##DIGITAL SIGNERING',
        `Godkant digitalt av: ${clientName}`,
        `Datum: ${signedDate}`,
        `IP-adress: ${clientIp}`,
        '',
        'Detta avtal ar juridiskt bindande i enlighet med',
        'lag (2000:832) om kvalificerade elektroniska',
        'signaturer och eIDAS-forordningen.',
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y);
      y -= 16;

      page.drawText(`© ${currentYear} Coffee Code Studio`, { x: 50, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) });

      const pdfBytes = await pdfDoc.save();

      const filePath = `${agreement.project_id}/pub_avtal_${agreement_id}.pdf`;
      const { error: uploadError } = await adminClient.storage
        .from('project-files')
        .upload(filePath, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.error('PUB PDF upload error:', uploadError);
      } else {
        await adminClient
          .from('project_pub_agreements')
          .update({ pdf_url: filePath })
          .eq('id', agreement_id);
      }
    } catch (pdfErr) {
      console.error('PUB PDF generation error:', pdfErr);
    }

    // Log
    await adminClient
      .from('status_logs')
      .insert({
        project_id: agreement.project_id,
        message: `PUB-avtal signerat av ${clientName} (IP: ${clientIp})`,
        author_name: clientName,
        event_type: 'pub_agreement_signed',
      });

    // Notify
    try {
      const { data: projectData } = await adminClient
        .from('projects')
        .select('name')
        .eq('id', agreement.project_id)
        .single();

      await fetch(`${supabaseUrl}/functions/v1/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          type: 'email_agreement_signed',
          project_id: agreement.project_id,
          project_name: projectData?.name || '',
          target_user_id: user.id,
        }),
      });
    } catch (e) {
      console.error('PUB agreement notification error:', e);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('sign-pub-agreement error:', err);
    return new Response(JSON.stringify({ error: 'Ett internt fel uppstod. Forsok igen.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
