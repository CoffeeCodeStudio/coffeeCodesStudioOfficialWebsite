import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Mail, Send } from 'lucide-react';

export function AdminOnboarding() {
  const [form, setForm] = useState({
    email: '', full_name: '', project_name: '', project_description: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      toast({ title: 'Fel', description: 'Du måste vara inloggad.', variant: 'destructive' });
      setLoading(false);
      return;
    }

    console.log('create-client: invoking with session user', session.user.id);
    const res = await supabase.functions.invoke('create-client', {
      body: form,
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    console.log('create-client response:', res);
    setLoading(false);

    const errorMsg = res.data?.error || res.error?.message;
    if (res.error || res.data?.error) {
      toast({ title: 'Fel', description: errorMsg || 'Okänt fel', variant: 'destructive' });
    } else {
      toast({ 
        title: 'Inbjudan skickad!', 
        description: `${form.email} har fått en inbjudan via e-post att aktivera sitt konto.` 
      });
      setForm({ email: '', full_name: '', project_name: '', project_description: '' });
    }
  };

  const fieldClass = "bg-muted/50 border-border/50 focus:border-primary/50";

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-serif gradient-text">Bjud in ny kund</h2>

      <div className="glass-card p-4 rounded-xl border border-primary/10 bg-primary/5">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium">Inbjudningsflöde</p>
            <p className="text-xs text-muted-foreground mt-1">
              Kunden får ett e-postmeddelande med en länk för att aktivera sitt konto och sätta sitt eget lösenord. Inget lösenord behöver anges här.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card cyber-border p-6 rounded-2xl space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">Namn</Label>
            <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })}
              placeholder="Kundens namn" className={fieldClass} required />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-sm">E-post</Label>
            <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="kund@email.se" className={fieldClass} required />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Projektnamn</Label>
          <Input value={form.project_name} onChange={e => setForm({ ...form, project_name: e.target.value })}
            placeholder="Hemsida för ABC AB" className={fieldClass} required />
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-sm">Beskrivning</Label>
          <Textarea value={form.project_description} onChange={e => setForm({ ...form, project_description: e.target.value })}
            placeholder="Kort beskrivning av projektet..." className={fieldClass} rows={3} />
        </div>

        <Button type="submit" disabled={loading} className="w-full glow-button bg-primary text-primary-foreground">
          <Send className="w-4 h-4 mr-2" />
          {loading ? 'Skickar inbjudan...' : 'Skicka inbjudan'}
        </Button>
      </form>
    </div>
  );
}
