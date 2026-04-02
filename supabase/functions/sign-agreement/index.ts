import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function drawLine(page: any, y: number, font: any) {
  page.drawText('─'.repeat(50), { x: 50, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) });
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

    // Fetch full agreement
    const { data: agreement, error: agError } = await adminClient
      .from('project_agreements')
      .select('*')
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

    // Verify project belongs to user
    const { data: projectData } = await adminClient
      .from('projects')
      .select('client_user_id, name')
      .eq('id', agreement.project_id)
      .single();

    if (!projectData || projectData.client_user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get client profile
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

    // Update agreement status
    const { error: updateError } = await adminClient
      .from('project_agreements')
      .update({
        status: 'signed',
        signed_at: now,
        signed_by_name: clientName,
        signed_by_ip: clientIp,
      })
      .eq('id', agreement_id);

    if (updateError) {
      console.error('sign-agreement update error:', updateError);
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
      const page = pdfDoc.addPage([595, 842]); // A4
      let y = 780;

      // Title
      page.drawText('PROJEKTAVTAL', { x: 50, y, size: 22, font: boldFont, color: rgb(0.1, 0.1, 0.1) });
      y -= 28;
      page.drawText('Coffee Code Studio', { x: 50, y, size: 12, font: boldFont, color: rgb(0.25, 0.25, 0.25) });
      y -= 16;
      page.drawText('Göteborg, Sverige | hej@coffeecodestudio.se', { x: 50, y, size: 9, font, color: rgb(0.4, 0.4, 0.4) });
      y -= 24;

      drawLine(page, y, font);
      y -= 20;

      // Supplier
      y = drawSection(page, [
        '##LEVERANTÖR',
        'Coffee Code Studio, enskild firma',
        'Göteborg, Sverige',
        'hej@coffeecodestudio.se',
      ], y, font, boldFont, 9);
      y -= 10;

      // Client
      y = drawSection(page, [
        '##KUND',
        clientName,
        clientEmail,
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y, font);
      y -= 20;

      // Project
      y = drawSection(page, [
        '##PROJEKT',
        `Projektnamn: ${projectData.name}`,
      ], y, font, boldFont, 9);

      // Handle multi-line scope description
      const scopeLines = (agreement.scope_description || '').split('\n');
      page.drawText('Beskrivning:', { x: 50, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 14;
      for (const sl of scopeLines) {
        // Wrap long lines
        const maxChars = 80;
        for (let i = 0; i < sl.length; i += maxChars) {
          const chunk = sl.substring(i, i + maxChars);
          page.drawText(chunk, { x: 60, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
          y -= 13;
          if (y < 60) break;
        }
        if (!sl.length) y -= 6;
      }

      page.drawText(`Uppskattad leverans: ${agreement.estimated_delivery}`, { x: 50, y, size: 9, font, color: rgb(0.15, 0.15, 0.15) });
      y -= 18;

      drawLine(page, y, font);
      y -= 20;

      // Economy
      const priceFormatted = Number(agreement.total_price).toLocaleString('sv-SE');
      y = drawSection(page, [
        '##EKONOMI',
        `Totalpris: ${priceFormatted} SEK (exkl. moms)`,
        `Betalningsvillkor: ${agreement.payment_terms}`,
        'Dröjsmålsränta utgår vid försenad betalning enligt räntelagen.',
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y, font);
      y -= 20;

      // Terms
      y = drawSection(page, [
        '##VILLKOR',
        '• Immateriella rättigheter överförs till kunden vid full betalning.',
        '• Ändringar utanför överenskommen projektbeskrivning offereras separat.',
        '• Coffee Code Studio förbehåller sig rätten att använda projektet som referens.',
        '• Eventuella tvister avgörs av Göteborgs tingsrätt. Svensk lag tillämpas.',
        '• Fullständiga villkor: coffeecodestudio.se/anvandarvillkor',
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y, font);
      y -= 20;

      // Digital signature
      y = drawSection(page, [
        '##DIGITAL SIGNERING',
        `Godkänt digitalt av: ${clientName}`,
        `Datum: ${signedDate}`,
        `IP-adress: ${clientIp}`,
        '',
        'Detta avtal är juridiskt bindande i enlighet med',
        'lag (2000:832) om kvalificerade elektroniska',
        'signaturer och eIDAS-förordningen.',
      ], y, font, boldFont, 9);
      y -= 6;

      drawLine(page, y, font);
      y -= 16;

      page.drawText(`© ${currentYear} Coffee Code Studio`, { x: 50, y, size: 8, font, color: rgb(0.5, 0.5, 0.5) });

      const pdfBytes = await pdfDoc.save();

      // Upload to storage
      const filePath = `${agreement.project_id}/avtal_${agreement_id}.pdf`;
      const { error: uploadError } = await adminClient.storage
        .from('project-files')
        .upload(filePath, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true,
        });

      if (uploadError) {
        console.error('PDF upload error:', uploadError);
      } else {
        // Get public/signed URL — bucket is private so store the path
        const pdfUrl = filePath;
        await adminClient
          .from('project_agreements')
          .update({ pdf_url: pdfUrl })
          .eq('id', agreement_id);
      }
    } catch (pdfErr) {
      console.error('PDF generation error:', pdfErr);
      // Non-blocking — agreement is still signed
    }

    // Log to activity feed
    await adminClient
      .from('status_logs')
      .insert({
        project_id: agreement.project_id,
        message: `Avtal signerat av ${clientName} (IP: ${clientIp})`,
        author_name: clientName,
        event_type: 'agreement_signed',
      });

    // Notify
    try {
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
      console.error('Agreement notification error:', e);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('sign-agreement error:', err);
    return new Response(JSON.stringify({ error: 'Ett internt fel uppstod. Försök igen.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
