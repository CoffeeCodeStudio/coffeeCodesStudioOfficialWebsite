import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, AlertCircle, Download } from 'lucide-react';

interface PubAgreement {
  id: string;
  project_id: string;
  status: string;
  sent_at: string | null;
  signed_at: string | null;
  pdf_url: string | null;
}

interface ClientPubAgreementProps {
  projectId: string;
  projectName: string;
}

const PUB_SUMMARY = `Coffee Code Studio agerar som personuppgiftsbiträde för dina kunders personuppgifter. Detta avtal reglerar hur data hanteras, lagras och raderas i enlighet med GDPR. Underbiträden inkluderar Supabase (databas), Resend (e-post) och Lovable (hosting). Personuppgifter raderas automatiskt efter 24 månader.`;

export function ClientPubAgreement({ projectId, projectName }: ClientPubAgreementProps) {
  const [agreement, setAgreement] = useState<PubAgreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('project_pub_agreements' as any)
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();
      if (data) setAgreement(data as any as PubAgreement);
      setLoading(false);
    };
    fetch();
  }, [projectId]);

  const handleSign = async () => {
    if (!agreement) return;
    setSigning(true);

    const { data, error } = await supabase.functions.invoke('sign-pub-agreement', {
      body: { agreement_id: agreement.id },
    });

    if (error || !data?.success) {
      toast({
        title: 'Fel',
        description: 'Kunde inte signera avtalet. Försök igen.',
        variant: 'destructive',
      });
    } else {
      // Re-fetch to get pdf_url
      const { data: updated } = await supabase
        .from('project_pub_agreements' as any)
        .select('*')
        .eq('id', agreement.id)
        .single();
      if (updated) setAgreement(updated as any as PubAgreement);
      toast({ title: 'PUB-avtal signerat!', description: 'Tack för att du godkände avtalet.' });
    }
    setSigning(false);
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
  if (!agreement || agreement.status === 'draft') return null;

  if (agreement.status === 'signed') {
    return (
      <motion.div
        className="glass-card p-5 rounded-2xl border border-accent/20 bg-accent/5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <h3 className="font-serif text-foreground">PUB-avtal signerat</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Du godkände personuppgiftsbiträdesavtalet {agreement.signed_at ? new Date(agreement.signed_at).toLocaleDateString('sv-SE') : ''}.
        </p>
        {agreement.pdf_url && (
          <Button
            variant="outline"
            size="sm"
            className="mt-3 gap-1.5 text-xs"
            onClick={handleDownloadPdf}
          >
            <Download className="w-3.5 h-3.5" />
            Ladda ner PUB-avtal (PDF)
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card cyber-border p-6 rounded-2xl border border-primary/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h3 className="font-serif text-lg text-foreground">Personuppgiftsbiträdesavtal (GDPR)</h3>
        <Badge variant="outline" className="text-primary border-primary/30 text-[10px] ml-auto">
          Väntar på godkännande
        </Badge>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Projekt</p>
          <p className="text-sm text-foreground font-medium">{projectName}</p>
        </div>

        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Sammanfattning</p>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{PUB_SUMMARY}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-4">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Genom att klicka på "Jag godkänner avtalet" bekräftar du att du har läst och accepterar personuppgiftsbiträdesavtalet. Din IP-adress och tidpunkt loggas som digital signatur.
        </p>
      </div>

      <Button
        onClick={handleSign}
        disabled={signing}
        className="w-full glow-button bg-primary text-primary-foreground hover:bg-primary/90 font-medium gap-2"
        size="lg"
      >
        <CheckCircle2 className="w-5 h-5" />
        {signing ? 'Signerar...' : 'Jag godkänner avtalet'}
      </Button>
    </motion.div>
  );
}
