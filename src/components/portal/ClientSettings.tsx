import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertTriangle, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { User as SupaUser } from '@supabase/supabase-js';

interface ClientSettingsProps {
  user: SupaUser;
  profile: { full_name: string | null; email: string | null } | null;
  onProfileUpdate: (profile: { full_name: string | null; email: string | null }) => void;
}

export function ClientSettings({ user, profile, onProfileUpdate }: ClientSettingsProps) {
  const { toast } = useToast();

  // Display name
  const [displayName, setDisplayName] = useState(profile?.full_name || '');
  const [savingName, setSavingName] = useState(false);

  // Email
  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  // Reset password
  const [sendingReset, setSendingReset] = useState(false);

  const handleUpdateName = async () => {
    if (!displayName.trim()) return;
    setSavingName(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: displayName.trim() })
      .eq('id', user.id);

    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      onProfileUpdate({ ...profile, full_name: displayName.trim(), email: profile?.email ?? null });
      toast({ title: 'Namn uppdaterat!' });
    }
    setSavingName(false);
  };

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) return;
    setSavingEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Bekräftelsemail skickat', description: 'Kolla din inkorg för att bekräfta den nya e-postadressen.' });
      setNewEmail('');
    }
    setSavingEmail(false);
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ title: 'Fel', description: 'Lösenorden matchar inte.', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: 'Fel', description: 'Lösenordet måste vara minst 6 tecken.', variant: 'destructive' });
      return;
    }
    setSavingPassword(true);

    // Re-authenticate with current password
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    });

    if (signInError) {
      toast({ title: 'Fel', description: 'Nuvarande lösenord är felaktigt.', variant: 'destructive' });
      setSavingPassword(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Lösenord uppdaterat!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setSavingPassword(false);
  };

  const handleResetPassword = async () => {
    setSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(user.email!, {
      redirectTo: `${window.location.origin}/set-password`,
    });
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Återställningsmail skickat', description: 'Kolla din inkorg.' });
    }
    setSendingReset(false);
  };

  const sectionClass = 'glass-card p-6 rounded-2xl space-y-4';

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-2xl font-serif gradient-text">Inställningar</h2>

      {/* Display Name */}
      <motion.div className={sectionClass} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-foreground">
          <User className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium">Visningsnamn</h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-xs text-muted-foreground">Namn som visas i portalen</Label>
          <Input id="displayName" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Ditt namn" />
        </div>
        <Button size="sm" onClick={handleUpdateName} disabled={savingName || !displayName.trim()}>
          {savingName ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Spara
        </Button>
      </motion.div>

      {/* Email */}
      <motion.div className={sectionClass} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-2 text-foreground">
          <Mail className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium">E-postadress</h3>
        </div>
        <p className="text-xs text-muted-foreground">Nuvarande: {user.email}</p>
        <div className="space-y-2">
          <Label htmlFor="newEmail" className="text-xs text-muted-foreground">Ny e-postadress</Label>
          <Input id="newEmail" type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="ny@epost.se" />
        </div>
        <Button size="sm" onClick={handleUpdateEmail} disabled={savingEmail || !newEmail.trim()}>
          {savingEmail ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Uppdatera e-post
        </Button>
      </motion.div>

      {/* Password */}
      <motion.div className={sectionClass} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-2 text-foreground">
          <Lock className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium">Byt lösenord</h3>
        </div>
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="currentPw" className="text-xs text-muted-foreground">Nuvarande lösenord</Label>
            <Input id="currentPw" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPw" className="text-xs text-muted-foreground">Nytt lösenord</Label>
            <Input id="newPw" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPw" className="text-xs text-muted-foreground">Bekräfta nytt lösenord</Label>
            <Input id="confirmPw" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button size="sm" onClick={handleUpdatePassword} disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword}>
            {savingPassword ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Byt lösenord
          </Button>
          <Button variant="link" size="sm" onClick={handleResetPassword} disabled={sendingReset} className="text-xs">
            {sendingReset ? 'Skickar...' : 'Glömt lösenord? Skicka återställningsmail'}
          </Button>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div className="border border-destructive/30 p-6 rounded-2xl space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-sm font-medium">Farozon</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Vill du radera ditt konto? Kontakta oss på{' '}
           <a href="mailto:hej@coffeecodestudio.se" className="text-primary underline">
             hej@coffeecodestudio.se
          </a>{' '}
          så hjälper vi dig.
        </p>
      </motion.div>
    </div>
  );
}
