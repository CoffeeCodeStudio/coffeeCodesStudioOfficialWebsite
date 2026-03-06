import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Send, MessageCirclePlus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ClientRequest {
  id: string;
  project_id: string;
  message: string;
  category: string;
  status: string;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
}

const categories = [
  { value: 'general', label: 'Allmänt' },
  { value: 'change', label: 'Ändring' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'asset', label: 'Logotyp/Material' },
];

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  in_progress: AlertCircle,
  done: CheckCircle2,
};

const statusLabels: Record<string, string> = {
  pending: 'Väntar',
  in_progress: 'Pågår',
  done: 'Klar',
};

export function ClientRequests() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('client_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name'),
    ]).then(([reqRes, projRes]) => {
      setRequests((reqRes.data as ClientRequest[]) || []);
      const projs = (projRes.data as Project[]) || [];
      setProjects(projs);
      if (projs.length === 1) setSelectedProject(projs[0].id);
      setLoading(false);
    });
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('client-requests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_requests' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setRequests(prev => [payload.new as ClientRequest, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setRequests(prev => prev.map(r => r.id === (payload.new as ClientRequest).id ? payload.new as ClientRequest : r));
        } else if (payload.eventType === 'DELETE') {
          setRequests(prev => prev.filter(r => r.id !== (payload.old as any).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !selectedProject) return;
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('client_requests').insert({
      project_id: selectedProject,
      user_id: user.id,
      message: message.trim(),
      category,
    });

    setSending(false);

    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setMessage('');
      toast({ title: 'Önskemål skickat!' });
    }
  };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Önskemål & Ändringar</h2>

      {/* Submit form */}
      <div className="glass-card cyber-border p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <MessageCirclePlus className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-foreground text-sm">Skicka nytt önskemål</h3>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {projects.length > 1 && (
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48 bg-muted/50 border-border/50">
                <SelectValue placeholder="Välj projekt" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40 bg-muted/50 border-border/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Beskriv ditt önskemål, ändringsförslag eller feedback..."
          className="bg-muted/50 border-border/50 min-h-[100px]"
        />

        <Button onClick={handleSend} disabled={!message.trim() || !selectedProject || sending}
          className="glow-button bg-primary text-primary-foreground">
          <Send className="w-4 h-4 mr-2" />
          {sending ? 'Skickar...' : 'Skicka önskemål'}
        </Button>
      </div>

      {/* Requests list */}
      {requests.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <MessageCirclePlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Du har inte skickat några önskemål ännu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((req, i) => {
            const StatusIcon = statusIcons[req.status] || Clock;
            return (
              <motion.div
                key={req.id}
                className="glass-card p-4 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {categories.find(c => c.value === req.category)?.label || req.category}
                    </span>
                    <span className="text-muted-foreground">{projectMap[req.project_id] || 'Projekt'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
                    <StatusIcon className={`w-3 h-3 ${
                      req.status === 'done' ? 'text-accent' : req.status === 'in_progress' ? 'text-secondary' : 'text-muted-foreground'
                    }`} />
                    <span className={`${
                      req.status === 'done' ? 'text-accent' : req.status === 'in_progress' ? 'text-secondary' : 'text-muted-foreground'
                    }`}>
                      {statusLabels[req.status] || req.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{req.message}</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {format(new Date(req.created_at), 'd MMM yyyy HH:mm', { locale: sv })}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
