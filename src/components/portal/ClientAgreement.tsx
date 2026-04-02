import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { FileSignature, CheckCircle2, AlertCircle, Download } from 'lucide-react';

interface Agreement {
  id: string;
  project_id: string;
  scope_description: string;
  total_price: number;
  payment_terms: string;
  estimated_delivery: string;
  status: string;
  sent_at: string | null;
  signed_at: string | null;
}

interface ClientAgreementProps {
  projectId: string;
  projectName: string;
}

const TERMS_TEXT = `Dessa villkor gäller enligt Coffee Code Studios allmänna användarvillkor. Genom att godkänna detta avtal bekräftar du att:

• Du har läst och godkänner projektets omfattning och pris enligt ovan.
• Betalning sker enligt angivna betalningsvillkor.
• Immateriella rättigheter överförs till dig vid full betalning.
• Coffee Code Studio förbehåller sig rätten att använda projektet som referens.
• Ändringar utanför projektets omfattning hanteras som tilläggsarbete.
• Eventuella tvister avgörs av Göteborgs tingsrätt.

Fullständiga villkor finns på coffeecodestudio.se/anvandarvillkor`;

export function ClientAgreement({ projectId, projectName }: ClientAgreementProps) {
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('project_agreements')
        .select('*')
        .eq('project_id', projectId)
        .maybeSingle();
      if (data) setAgreement(data as Agreement);
      setLoading(false);
    };
    fetch();
  }, [projectId]);

  const handleSign = async () => {
    if (!agreement) return;
    setSigning(true);

    const { data, error } = await supabase.functions.invoke('sign-agreement', {
      body: { agreement_id: agreement.id },
    });

    if (error || !data?.success) {
      toast({
        title: 'Fel',
        description: 'Kunde inte signera avtalet. Försök igen.',
        variant: 'destructive',
      });
    } else {
      setAgreement(prev => prev ? { ...prev, status: 'signed', signed_at: new Date().toISOString() } : null);
      toast({ title: 'Avtal signerat!', description: 'Tack för att du godkände avtalet.' });
    }
    setSigning(false);
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
          <h3 className="font-serif text-foreground">Avtal signerat</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Du godkände avtalet {agreement.signed_at ? new Date(agreement.signed_at).toLocaleDateString('sv-SE') : ''}.
        </p>
      </motion.div>
    );
  }

  // Status is 'sent' — show for signing
  return (
    <motion.div
      className="glass-card cyber-border p-6 rounded-2xl border border-primary/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <FileSignature className="w-5 h-5 text-primary" />
        <h3 className="font-serif text-lg text-foreground">Projektavtal</h3>
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
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Projektbeskrivning</p>
          <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{agreement.scope_description}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Totalpris</p>
            <p className="text-sm text-foreground font-medium">{Number(agreement.total_price).toLocaleString('sv-SE')} SEK</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Betalningsvillkor</p>
            <p className="text-sm text-foreground/80">{agreement.payment_terms}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Uppskattad leverans</p>
            <p className="text-sm text-foreground/80">{agreement.estimated_delivery}</p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Allmänna villkor</p>
          <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{TERMS_TEXT}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-4">
        <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Genom att klicka på "Jag godkänner avtalet" bekräftar du att du har läst och accepterar alla villkor ovan. Din IP-adress och tidpunkt loggas som digital signatur.
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
