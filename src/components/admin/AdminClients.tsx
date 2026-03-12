import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Users, Trash2, Loader2, FolderKanban, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ClientInfo {
  id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
  roles: string[];
  projects: { id: string; name: string; status: string }[];
}

export function AdminClients() {
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchClients = async () => {
    // Get profiles
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    // Get roles
    const { data: roles } = await supabase.from('user_roles').select('*');
    // Get projects
    const { data: projects } = await supabase.from('projects').select('id, name, status, client_user_id');

    const clientList: ClientInfo[] = (profiles || []).map(p => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      created_at: p.created_at,
      roles: (roles || []).filter(r => r.user_id === p.id).map(r => r.role),
      projects: (projects || []).filter(pr => pr.client_user_id === p.id).map(pr => ({ id: pr.id, name: pr.name, status: pr.status })),
    }));

    setClients(clientList);
    setLoading(false);
  };

  useEffect(() => { fetchClients(); }, []);

  const handleDelete = async (userId: string, name: string) => {
    setDeleting(userId);
    const { data: { session } } = await supabase.auth.getSession();

    console.log('delete-client request body:', { user_id: userId });
    const res = await supabase.functions.invoke('delete-client', {
      body: { user_id: userId },
      headers: { Authorization: `Bearer ${session?.access_token}` },
    });

    console.log('delete-client response:', res);
    setDeleting(null);

    const errorMsg = res.data?.error || res.error?.message;
    if (res.error || res.data?.error) {
      toast({ title: 'Fel', description: errorMsg || 'Okänt fel vid radering', variant: 'destructive' });
    } else {
      toast({ title: 'Konto raderat', description: `${name || 'Användaren'} har raderats permanent.` });
      setClients(prev => prev.filter(c => c.id !== userId));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  // Separate admins from clients
  const admins = clients.filter(c => c.roles.includes('admin'));
  const regularClients = clients.filter(c => !c.roles.includes('admin'));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Hantera konton</h2>
      <p className="text-sm text-muted-foreground">
        Här kan du se alla registrerade användare och radera konton för kunder som avslutat sitt medlemskap.
      </p>

      {/* Admins section */}
      {admins.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" /> Administratörer
          </h3>
          {admins.map(admin => (
            <div key={admin.id} className="glass-card p-4 rounded-xl flex items-center gap-3 border border-primary/10">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                {(admin.full_name || admin.email || '?')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{admin.full_name || 'Namnlös'}</p>
                <p className="text-xs text-muted-foreground truncate">{admin.email}</p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Admin</Badge>
            </div>
          ))}
        </div>
      )}

      {/* Clients section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Users className="w-4 h-4" /> Kunder ({regularClients.length})
        </h3>
        {regularClients.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Inga kundkonton finns.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {regularClients.map((client, i) => (
              <motion.div
                key={client.id}
                className="glass-card p-4 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-bold">
                    {(client.full_name || client.email || '?')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{client.full_name || 'Namnlös'}</p>
                    <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {client.projects.length > 0 ? (
                        client.projects.map(p => (
                          <Badge key={p.id} variant="secondary" className="text-[10px] gap-1">
                            <FolderKanban className="w-3 h-3" />
                            {p.name}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-[10px] text-muted-foreground italic">Inga projekt</span>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        Skapad {new Date(client.created_at).toLocaleDateString('sv-SE')}
                      </span>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Radera konto permanent?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Detta raderar <strong>{client.full_name || client.email}</strong> och all tillhörande data
                          (projekt, meddelanden, filer, ärenden) permanent. Åtgärden kan inte ångras.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Avbryt</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(client.id, client.full_name || client.email || '')}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={deleting === client.id}
                        >
                          {deleting === client.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                          Radera permanent
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
