import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { Coffee, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is a valid recovery/invite session
    const checkSession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      if (accessToken && (type === 'invite' || type === 'recovery' || type === 'signup')) {
        // Set the session from the URL tokens
        const refreshToken = hashParams.get('refresh_token');
        if (refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            setError('Ogiltig eller utgången länk. Kontakta oss för en ny inbjudan.');
          }
        }
      } else {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setError('Ingen giltig session hittades. Kontakta oss för en ny inbjudan.');
        }
      }
      setChecking(false);
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({ title: 'Fel', description: 'Lösenorden matchar inte', variant: 'destructive' });
      return;
    }

    if (password.length < 6) {
      toast({ title: 'Fel', description: 'Lösenordet måste vara minst 6 tecken', variant: 'destructive' });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setLoading(false);
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Lösenord sparat!', description: 'Du loggas nu in...' });
      // Small delay to show success message, then redirect
      setTimeout(() => {
        navigate('/portal');
      }, 1000);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="absolute inset-0 code-bg opacity-30" />
        <motion.div
          className="glass-card cyber-border p-8 md:p-12 w-full max-w-md relative z-10 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-serif text-foreground mb-2">Länken är ogiltig</h1>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <Button onClick={() => navigate('/')} variant="outline">
            Tillbaka till startsidan
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 code-bg opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <motion.div
        className="glass-card cyber-border p-8 md:p-12 w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Coffee className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif text-foreground mb-2">Välkommen!</h1>
          <p className="text-sm text-muted-foreground">
            Skapa ett lösenord för att aktivera ditt konto hos Coffee Code Studio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground text-sm">Lösenord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Minst 6 tecken"
                className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-muted-foreground text-sm">Bekräfta lösenord</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Skriv lösenordet igen"
                className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
                required
              />
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-destructive">Lösenorden matchar inte</p>
            )}
            {password && confirmPassword && password === confirmPassword && (
              <p className="text-xs text-accent flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Lösenorden matchar
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || password !== confirmPassword || password.length < 6}
            className="w-full glow-button bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            {loading ? 'Sparar...' : 'Aktivera konto'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Efter aktivering loggas du in automatiskt.
        </p>
      </motion.div>
    </div>
  );
}
