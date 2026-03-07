import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageCirclePlus, Clock, CheckCircle2, AlertCircle, Bug, Zap, Sparkles, HelpCircle, ArrowUp, Minus, Flame } from 'lucide-react';
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
  priority: string;
  admin_response: string | null;
  created_at: string;
}

interface Project {
  id: string;
  name: string;
  package: string;
  monthly_quota: number;
}

const categories = [
  { value: 'bugfix', label: 'Bugfix', icon: Bug, description: 'Något fungerar inte' },
  { value: 'upgrade', label: 'Uppgradering', icon: Zap, description: 'Förbättra befintligt' },
  { value: 'new_feature', label: 'Ny funktion', icon: Sparkles, description: 'Lägg till något nytt' },
  { value: 'other', label: 'Övrigt', icon: HelpCircle, description: 'Annat ärende' },
];

const priorities = [
  { value: 'low', label: 'Låg', icon: Minus, color: 'text-muted-foreground' },
  { value: 'normal', label: 'Normal', icon: ArrowUp, color: 'text-primary' },
  { value: 'urgent', label: 'Brådskande', icon: Flame, color: 'text-destructive' },
];

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  reviewing: AlertCircle,
  in_progress: Zap,
  review_ready: CheckCircle2,
  delivered: CheckCircle2,
};

const statusLabels: Record<string, string> = {
  pending: 'Inkommen',
  reviewing: 'Granskas',
  in_progress: 'Pågår',
  review_ready: 'Klar för granskning',
  delivered: 'Levererad',
};

const statusColors: Record<string, string> = {
  pending: 'text-muted-foreground',
  reviewing: 'text-secondary',
  in_progress: 'text-primary',
  review_ready: 'text-accent',
  delivered: 'text-accent',
};

const packageLabels: Record<string, string> = {
  bas: 'Bas',
  standard: 'Standard',
  premium: 'Premium',
};

export function ClientRequests() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('normal');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('client_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name, package, monthly_quota'),
    ]).then(([reqRes, projRes]) => {
      setRequests((reqRes.data as ClientRequest[]) || []);
      const projs = (projRes.data as Project[]) || [];
      setProjects(projs);
      if (projs.length === 1) setSelectedProject(projs[0].id);
      setLoading(false);
    });
  }, []);

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

  // Calculate quota for current month
  const getQuotaInfo = () => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const proj = projects.find(p => p.id === selectedProject) || projects[0];
    if (!proj) return { used: 0, total: 3, remaining: 3, packageName: 'Bas' };

    const used = requests.filter(r =>
      r.project_id === proj.id && new Date(r.created_at) >= monthStart
    ).length;

    return {
      used,
      total: proj.monthly_quota,
      remaining: Math.max(0, proj.monthly_quota - used),
      packageName: packageLabels[proj.package] || proj.package,
    };
  };

  const quota = getQuotaInfo();
  const quotaExceeded = quota.remaining <= 0;

  const handleSend = async () => {
    if (!message.trim() || !selectedProject || !category) return;
    setSending(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('client_requests').insert({
      project_id: selectedProject,
      user_id: user.id,
      message: message.trim(),
      category,
      priority,
    });

    setSending(false);

    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setMessage('');
      setCategory('');
      setPriority('normal');
      toast({ title: 'Önskemål skickat!', description: 'Vi har tagit emot ditt ärende.' });
    }
  };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Önskemål & Ändringar</h2>

      {/* Quota indicator */}
      {projects.length > 0 && (
        <div className="glass-card cyber-border p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Ditt paket: <span className="text-primary">{quota.packageName}</span>
            </span>
            <span className="text-xs text-muted-foreground">
              {quota.used} / {quota.total} ärenden denna månad
            </span>
          </div>
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${quotaExceeded ? 'bg-destructive' : 'bg-gradient-to-r from-primary via-secondary to-accent'}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (quota.used / quota.total) * 100)}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          {quotaExceeded && (
            <p className="text-xs text-destructive mt-2">
              Du har använt dina ärenden för månaden — kontakta oss för att uppgradera.
            </p>
          )}
        </div>
      )}

      {/* Submit form */}
      <div className="glass-card cyber-border p-6 rounded-2xl space-y-5">
        <div className="flex items-center gap-3 mb-1">
          <MessageCirclePlus className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-foreground text-sm">Skicka nytt önskemål</h3>
        </div>

        {projects.length > 1 && (
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full sm:w-64 bg-muted/50 border-border/50">
              <SelectValue placeholder="Välj projekt" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Category buttons */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Vad gäller det?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {categories.map(cat => {
              const Icon = cat.icon;
              const active = category === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                    active
                      ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10'
                      : 'border-border/30 bg-muted/20 text-muted-foreground hover:border-border/60 hover:bg-muted/40'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{cat.label}</span>
                  <span className="text-[10px] leading-tight opacity-70">{cat.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority buttons */}
        <div>
          <p className="text-xs text-muted-foreground mb-3">Prioritet</p>
          <div className="flex gap-3">
            {priorities.map(p => {
              const Icon = p.icon;
              const active = priority === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                    active
                      ? p.value === 'urgent'
                        ? 'border-destructive bg-destructive/10 text-destructive'
                        : p.value === 'normal'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-muted/30 text-foreground'
                      : 'border-border/30 bg-muted/20 text-muted-foreground hover:border-border/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Beskriv ditt önskemål, ändringsförslag eller feedback..."
          className="bg-muted/50 border-border/50 min-h-[100px]"
        />

        <Button
          onClick={handleSend}
          disabled={!message.trim() || !selectedProject || !category || sending || quotaExceeded}
          className="glow-button bg-primary text-primary-foreground"
        >
          <Send className="w-4 h-4 mr-2" />
          {sending ? 'Skickar...' : 'Skicka önskemål'}
        </Button>
      </div>

      {/* Requests list */}
      {requests.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <MessageCirclePlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Du har inte skickat några önskemål ännu.</p>
          <Button variant="outline" className="border-primary/30 text-primary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Send className="w-4 h-4 mr-2" />
            Skicka ditt första önskemål
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {requests.map((req, i) => {
              const StatusIcon = statusIcons[req.status] || Clock;
              const catInfo = categories.find(c => c.value === req.category);
              const CatIcon = catInfo?.icon || HelpCircle;
              const prioInfo = priorities.find(p => p.value === req.priority);

              return (
                <motion.div
                  key={req.id}
                  className="glass-card p-4 rounded-xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  layout
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        <CatIcon className="w-3 h-3" />
                        {catInfo?.label || req.category}
                      </span>
                      {prioInfo && req.priority !== 'normal' && (
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                          req.priority === 'urgent' ? 'bg-destructive/10 text-destructive' : 'bg-muted/50 text-muted-foreground'
                        }`}>
                          <prioInfo.icon className="w-3 h-3" />
                          {prioInfo.label}
                        </span>
                      )}
                      <span className="text-muted-foreground">{projectMap[req.project_id] || 'Projekt'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs flex-shrink-0">
                      <StatusIcon className={`w-3 h-3 ${statusColors[req.status] || 'text-muted-foreground'}`} />
                      <span className={statusColors[req.status] || 'text-muted-foreground'}>
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
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
