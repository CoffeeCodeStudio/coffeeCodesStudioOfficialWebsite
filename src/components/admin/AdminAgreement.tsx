import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { FileSignature, Send, CheckCircle2, Clock, FileX, Download } from 'lucide-react';

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
  signed_by_name: string | null;
  pdf_url: string | null;
}

interface AdminAgreementProps {
  projectId: string;
  projectName: string;
}

export function AdminAgreement({ projectId, projectName }: AdminAgreementProps) {
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Form state
  const [scope, setScope] = useState('');
  const [price, setPrice] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('50% vid projektstart, 50% vid leverans');
  const [delivery, setDelivery] = useState('');

  useEffect(() => {
    fetchAgreement();

    const channel = supabase
      .channel(`agreement-${projectId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'project_agreements',
        filter: `project_id=eq.${projectId}`,
      }, () => fetchAgreement())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  const fetchAgreement = async () => {
    const { data } = await supabase
      .from('project_agreements')
      .select('*')
      .eq('project_id', projectId)
      .maybeSingle();
    if (data) {
      setAgreement(data as Agreement);
      setScope(data.scope_description);
      setPrice(String(data.total_price));
      setPaymentTerms(data.payment_terms);
      setDelivery(data.estimated_delivery);
    }
    setLoading(false);
  };

  const handleSaveAndSend = async () => {
    if (!scope.trim() || !price.trim() || !delivery.trim()) {
      toast({ title: 'Fyll i alla fält', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const now = new Date().toISOString();

    if (agreement) {
      // Update existing
      const { error } = await supabase
        .from('project_agreements')
        .update({
          scope_description: scope.trim(),
          total_price: parseFloat(price),
          payment_terms: paymentTerms.trim(),
          estimated_delivery: delivery.trim(),
          status: 'sent',
          sent_at: now,
        })
        .eq('id', agreement.id);

      if (error) {
        toast({ title: 'Fel', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Avtal skickat till kund' });
        // Log activity
        await supabase.from('status_logs').insert({
          project_id: projectId,
          message: 'Avtal skickat till kund för godkännande',
          author_name: 'Admin',
          event_type: 'agreement_sent',
        });
        setOpen(false);
        fetchAgreement();
      }
    } else {
      // Create new
      const { error } = await supabase
        .from('project_agreements')
        .insert({
          project_id: projectId,
          scope_description: scope.trim(),
          total_price: parseFloat(price),
          payment_terms: paymentTerms.trim(),
          estimated_delivery: delivery.trim(),
          status: 'sent',
          sent_at: now,
        });

      if (error) {
        toast({ title: 'Fel', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Avtal skickat till kund' });
        await supabase.from('status_logs').insert({
          project_id: projectId,
          message: 'Avtal skickat till kund för godkännande',
          author_name: 'Admin',
          event_type: 'agreement_sent',
        });
        setOpen(false);
        fetchAgreement();
      }
    }
    setSaving(false);
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs border-border/50">
            <FileSignature className="w-3.5 h-3.5" />
            {agreement?.status === 'signed' ? 'Visa avtal' : 'Skicka avtal'}
          </Button>
        </DialogTrigger>
        <DialogContent className="glass-card border-border/50 max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif text-foreground">
              Projektavtal — {projectName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Projektbeskrivning / Scope</Label>
              <Textarea
                value={scope}
                onChange={e => setScope(e.target.value)}
                placeholder="Beskriv vad som ingår i projektet..."
                className="bg-muted/50 border-border/50 min-h-[100px] text-sm"
                disabled={agreement?.status === 'signed'}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Totalpris (SEK)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="bg-muted/50 border-border/50"
                  disabled={agreement?.status === 'signed'}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Uppskattad leveranstid</Label>
                <Input
                  value={delivery}
                  onChange={e => setDelivery(e.target.value)}
                  placeholder="t.ex. 2–3 veckor"
                  className="bg-muted/50 border-border/50"
                  disabled={agreement?.status === 'signed'}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Betalningsvillkor</Label>
              <Input
                value={paymentTerms}
                onChange={e => setPaymentTerms(e.target.value)}
                className="bg-muted/50 border-border/50"
                disabled={agreement?.status === 'signed'}
              />
            </div>

            {agreement?.status === 'signed' && (
              <div className="glass-card p-4 rounded-xl border border-accent/20 bg-accent/5 space-y-2">
                <p className="text-xs text-accent font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Signerat av {agreement.signed_by_name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {agreement.signed_at ? new Date(agreement.signed_at).toLocaleString('sv-SE') : ''}
                </p>
                {agreement.pdf_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs mt-1"
                    onClick={async () => {
                      const { data, error } = await supabase.storage
                        .from('project-files')
                        .download(agreement.pdf_url!);
                      if (error || !data) {
                        toast({ title: 'Kunde inte ladda ner PDF', variant: 'destructive' });
                        return;
                      }
                      const url = URL.createObjectURL(data);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `avtal_${projectName}.pdf`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Ladda ner avtal (PDF)
                  </Button>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">Stäng</Button>
            </DialogClose>
            {agreement?.status !== 'signed' && (
              <Button
                size="sm"
                onClick={handleSaveAndSend}
                disabled={saving}
                className="gap-1.5 bg-primary text-primary-foreground"
              >
                <Send className="w-3.5 h-3.5" />
                {saving ? 'Skickar...' : 'Skicka till kund'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
