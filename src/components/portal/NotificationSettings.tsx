import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Bell, Loader2, Send } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

interface NotificationSettingsProps {
  user: User;
  isAdmin?: boolean;
}

interface Preferences {
  email_new_message: boolean;
  email_status_update: boolean;
  email_file_upload: boolean;
  email_agreement_signed: boolean;
  email_new_request: boolean;
  email_password_changed: boolean;
}

const defaultPrefs: Preferences = {
  email_new_message: true,
  email_status_update: true,
  email_file_upload: false,
  email_agreement_signed: true,
  email_new_request: true,
  email_password_changed: true,
};

const clientLabels: Record<keyof Preferences, { label: string; desc: string }> = {
  email_new_message: { label: 'Nytt meddelande', desc: 'Få e-post när admin skickar ett meddelande' },
  email_status_update: { label: 'Statusuppdatering', desc: 'Få e-post när ditt ärende uppdateras' },
  email_file_upload: { label: 'Filuppladdning', desc: 'Få e-post när filer laddas upp i projektet' },
  email_agreement_signed: { label: 'Avtal signerat', desc: 'Få e-post vid avtalshändelser' },
  email_new_request: { label: 'Nytt ärende', desc: 'Få e-post när ärenden skapas' },
  email_password_changed: { label: 'Lösenord ändrat', desc: 'Få e-post vid lösenordsändring' },
};

const adminLabels: Record<keyof Preferences, { label: string; desc: string }> = {
  email_new_message: { label: 'Nytt meddelande från kund', desc: 'Få e-post när en kund skickar meddelande' },
  email_status_update: { label: 'Statusuppdatering', desc: 'Få e-post vid statusändringar' },
  email_file_upload: { label: 'Ny fil uppladdad av kund', desc: 'Få e-post när kund laddar upp fil' },
  email_agreement_signed: { label: 'Avtal signerat', desc: 'Få e-post när ett avtal signeras' },
  email_new_request: { label: 'Nytt ärende inkommet', desc: 'Få e-post när kund skapar nytt ärende' },
  email_password_changed: { label: 'Lösenord ändrat', desc: 'Få e-post vid lösenordsändring' },
};

export function NotificationSettings({ user, isAdmin = false }: NotificationSettingsProps) {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<Preferences>(defaultPrefs);
  const [loading, setLoading] = useState(true);
  const [sendingTest, setSendingTest] = useState(false);

  const labels = isAdmin ? adminLabels : clientLabels;

  useEffect(() => {
    const fetchPrefs = async () => {
      const { data } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setPrefs({
          email_new_message: data.email_new_message,
          email_status_update: data.email_status_update,
          email_file_upload: data.email_file_upload,
          email_agreement_signed: data.email_agreement_signed,
          email_new_request: data.email_new_request,
          email_password_changed: data.email_password_changed,
        });
      }
      setLoading(false);
    };
    fetchPrefs();
  }, [user.id]);

  const handleToggle = async (key: keyof Preferences, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...updated,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (error) {
      setPrefs(prev => ({ ...prev, [key]: !value }));
      toast({ title: 'Fel', description: 'Kunde inte spara inställningen.', variant: 'destructive' });
    }
  };

  const handleSendTest = async () => {
    setSendingTest(true);
    try {
      const { error } = await supabase.functions.invoke('send-notification', {
        body: { type: 'test', user_id: user.id },
      });
      if (error) throw error;
      toast({ title: 'Testmail skickat!', description: 'Kolla din inkorg.' });
    } catch {
      toast({ title: 'Fel', description: 'Kunde inte skicka testmail.', variant: 'destructive' });
    }
    setSendingTest(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-serif text-foreground">E-postnotifieringar</h3>
      </div>

      <div className="space-y-3">
        {(Object.keys(labels) as (keyof Preferences)[]).map((key, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="glass-card p-4 rounded-xl flex items-center justify-between"
          >
            <div className="space-y-0.5">
              <Label className="text-sm text-foreground">{labels[key].label}</Label>
              <p className="text-xs text-muted-foreground">{labels[key].desc}</p>
            </div>
            <Switch
              checked={prefs[key]}
              onCheckedChange={(v) => handleToggle(key, v)}
            />
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-border/30">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSendTest}
          disabled={sendingTest}
        >
          {sendingTest ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
          Skicka testmail
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Skickar ett testmail till din registrerade e-postadress.
        </p>
      </div>
    </div>
  );
}
