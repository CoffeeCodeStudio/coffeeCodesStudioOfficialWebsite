import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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
    
    // Verify the user
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

    // Verify the agreement belongs to the user's project and is in 'sent' status
    const { data: agreement, error: agError } = await adminClient
      .from('project_agreements')
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

    // Verify project belongs to user
    const { data: project } = await adminClient
      .from('projects')
      .select('client_user_id')
      .eq('id', agreement.project_id)
      .single();

    if (!project || project.client_user_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get client name
    const { data: profile } = await adminClient
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const clientName = profile?.full_name || profile?.email || user.email || 'Okänd';

    // Get IP from headers
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('cf-connecting-ip')
      || req.headers.get('x-real-ip')
      || 'Okänd';

    const now = new Date().toISOString();

    // Update agreement
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

    // Log to activity feed
    await adminClient
      .from('status_logs')
      .insert({
        project_id: agreement.project_id,
        message: `Avtal signerat av ${clientName} (IP: ${clientIp})`,
        author_name: clientName,
        event_type: 'agreement_signed',
      });

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
