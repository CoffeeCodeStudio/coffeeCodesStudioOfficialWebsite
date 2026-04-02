import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Send, CheckCircle2, Clock, FileX, Download } from 'lucide-react';

interface PubAgreement {
  id: string;
  project_id: string;
  status: string;
  sent_at: string | null;
  signed_at: string | null;
  signed_ip: string | null;
  pdf_url: string | null;
}

interface AdminPubAgreementProps {
  projectId: string;
}

export function AdminPubAgreement({ projectId }: AdminPubAgreementProps) {
  const [agreement, setAgreement] = useState<PubAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const fetchAgreement = async () => {
    const { data } = await supabase
      .from('project_pub_agreements' as any)
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();
    if (data) setAgreement(data as any as PubAgreement);
    setLoading(false);
  };

  useEffect(() => {
    fetchAgreement();

    const channel = supabase
      .channel(`pub-agreement-${projectId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'project_pub_agreements',
        filter: `project_id=eq.${projectId}`,
      }, () => fetchAgreement())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  const handleSend = async () => {
    setSending(true);
    const now = new Date().toISOString();

    if (agreement) {
      const { error } = await supabase
        .from('project_pub_agreements' as any)
        .update({ status: 'sent', sent_at: now } as any)
        .eq('id', agreement.id);
      if (error) {
        toast({ title: 'Fel', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'PUB-avtal skickat till kund' });
        await supabase.from('status_logs').insert({
          project_id: projectId,
          message: 'PUB-avtal skickat till kund för godkännande',
          author_name: 'Admin',
          event_type: 'pub_agreement_sent',
        });
        fetchAgreement();
      }
    } else {
      const { error } = await supabase
        .from('project_pub_agreements' as any)
        .insert({ project_id: projectId, status: 'sent', sent_at: now } as any);
      if (error) {
        toast({ title: 'Fel', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'PUB-avtal skickat till kund' });
        await supabase.from('status_logs').insert({
          project_id: projectId,
          message: 'PUB-avtal skickat till kund för godkännande',
          author_name: 'Admin',
          event_type: 'pub_agreement_sent',
        });
        fetchAgreement();
      }
    }
    setSending(false);
  };

  const handleDownloadPdf = async () => {
    if (!agreement?.pdf_url) return;
    const { data, error } = await supabase.storage
      .from('project-files')
      .download(agreement.pdf_url);
    if (error || !data) {
      toast({ title: 'Fel', description: 'Kunde inte ladda ner PDF.', variant: 'destructive' });
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pub_avtal_${agreement.id}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return null;

  const statusBadge = () => {
    if (!agreement || agreement.status === 'draft') {
      return <Badge variant="outline" className="text-muted-foreground border-border/50 gap-1"><FileX className="w-3 h-3" />Ej skickat</Badge>;
    }
    if (agreement.status === 'sent') {
      return <Badge variant="outline" className="text-amber-glow border-amber-glow/30 bg-amber-glow/10 gap-1"><Clock className="w-3 h-3" />Skickat</Badge>;
    }
    if (agreement.status === 'signed') {
      return <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10 gap-1"><CheckCircle2 className="w-3 h-3" />Signerat</Badge>;
    }
    return null;
  };

  return (
    <div className="flex items-center gap-2">
      {statusBadge()}
      {agreement?.status !== 'signed' && (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs border-border/50"
          onClick={handleSend}
          disabled={sending}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          {sending ? 'Skickar...' : agreement?.status === 'sent' ? 'Skicka igen' : 'Skicka PUB-avtal'}
        </Button>
      )}
      {agreement?.status === 'signed' && (
        <>
          <span className="text-[10px] text-muted-foreground">
            {agreement.signed_at ? new Date(agreement.signed_at).toLocaleString('sv-SE') : ''}
          </span>
          {agreement.pdf_url && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs border-border/50"
              onClick={handleDownloadPdf}
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </Button>
          )}
        </>
      )}
    </div>
  );
}
