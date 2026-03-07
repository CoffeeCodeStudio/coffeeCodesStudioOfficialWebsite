import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { MessageCirclePlus, Clock, CheckCircle2, AlertCircle, ArrowRight, Zap, Bug, Sparkles, HelpCircle, Flame, Minus, ArrowUp, Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ClientRequest {
  id: string;
  project_id: string;
  user_id: string;
  message: string;
  category: string;
  status: string;
  priority: string;
  admin_response: string | null;
  created_at: string;
}

interface Project { id: string; name: string; }

const statusOptions = [
  { value: 'pending', label: 'Inkommen' },
  { value: 'reviewing', label: 'Granskas' },
  { value: 'in_progress', label: 'Pågår' },
  { value: 'review_ready', label: 'Klar för granskning' },
  { value: 'delivered', label: 'Levererad' },
];

const categoryIcons: Record<string, typeof Bug> = {
  bugfix: Bug, upgrade: Zap, new_feature: Sparkles, other: HelpCircle,
  general: HelpCircle, change: Zap, feedback: MessageCirclePlus, asset: Sparkles,
};
const categoryLabels: Record<string, string> = {
  bugfix: 'Bugfix', upgrade: 'Uppgradering', new_feature: 'Ny funktion', other: 'Övrigt',
  general: 'Allmänt', change: 'Ändring', feedback: 'Feedback', asset: 'Logotyp/Material',
};
const priorityLabels: Record<string, string> = { low: 'Låg', normal: 'Normal', urgent: 'Brådskande' };
const prioritySortOrder: Record<string, number> = { urgent: 0, normal: 1, low: 2 };

export function AdminClientRequests() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filterProject, setFilterProject] = useState('all');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('client_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name').order('name'),
    ]).then(([reqRes, projRes]) => {
      setRequests((reqRes.data as ClientRequest[]) || []);
      setProjects((projRes.data as Project[]) || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('admin-requests-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_requests' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setRequests(prev => [payload.new as ClientRequest, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setRequests(prev => prev.map(r => r.id === (payload.new as ClientRequest).id ? payload.new as ClientRequest : r));
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('client_requests').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast({ title: 'Status uppdaterad' });
    }
  };

  const sendReply = async (id: string) => {
    if (!replyText.trim()) return;
    const { error } = await supabase.from('client_requests').update({ admin_response: replyText.trim() }).eq('id', id);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, admin_response: replyText.trim() } : r));
      setReplyingTo(null);
      setReplyText('');
      toast({ title: 'Svar skickat!' });
    }
  };

  const convertToTodo = async (req: ClientRequest) => {
    const { error } = await supabase.from('project_todos').insert({
      project_id: req.project_id,
      title: req.message.substring(0, 100),
    });
    if (!error) toast({ title: 'Konverterad till uppgift!' });
  };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));

  // Sort by priority then date
  const filtered = (filterProject === 'all' ? requests : requests.filter(r => r.project_id === filterProject))
    .sort((a, b) => {
      const pa = prioritySortOrder[a.priority] ?? 1;
      const pb = prioritySortOrder[b.priority] ?? 1;
      if (pa !== pb) return pa - pb;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Alla ärenden</h2>

      <div className="glass-card cyber-border p-4 rounded-2xl flex items-center gap-4">
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-64 bg-muted/50 border-border/50">
            <SelectValue placeholder="Filtrera per projekt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alla projekt</SelectItem>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">{filtered.length} ärenden</span>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <MessageCirclePlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Inga ärenden ännu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req, i) => {
            const CatIcon = categoryIcons[req.category] || HelpCircle;
            const isReplying = replyingTo === req.id;

            return (
              <motion.div
                key={req.id}
                className={`glass-card p-5 rounded-xl ${req.priority === 'urgent' ? 'border border-destructive/30' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      <CatIcon className="w-3 h-3" />
                      {categoryLabels[req.category] || req.category}
                    </span>
                    {req.priority === 'urgent' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                        <Flame className="w-3 h-3" />
                        Brådskande
                      </span>
                    )}
                    {req.priority === 'low' && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground font-medium">
                        <Minus className="w-3 h-3" />
                        Låg
                      </span>
                    )}
                    <span className="text-muted-foreground">{projectMap[req.project_id] || 'Projekt'}</span>
                    <span className="text-muted-foreground">
                      {format(new Date(req.created_at), 'd MMM HH:mm', { locale: sv })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Quick status buttons */}
                    <Select value={req.status} onValueChange={v => updateStatus(req.id, v)}>
                      <SelectTrigger className="w-44 h-8 text-xs bg-muted/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <p className="text-sm text-foreground leading-relaxed mb-3">{req.message}</p>

                {/* Existing admin response */}
                {req.admin_response && (
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 mb-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <MessageSquare className="w-3 h-3 text-primary" />
                      <span className="text-[10px] text-primary font-medium">Ditt svar</span>
                    </div>
                    <p className="text-sm text-foreground">{req.admin_response}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setReplyingTo(isReplying ? null : req.id); setReplyText(req.admin_response || ''); }}
                    className="text-xs text-primary hover:bg-primary/10"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    {req.admin_response ? 'Redigera svar' : 'Svara'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => convertToTodo(req)}
                    className="text-xs text-secondary hover:bg-secondary/10">
                    <ArrowRight className="w-3 h-3 mr-1" />
                    Till uppgift
                  </Button>
                </div>

                {/* Reply input */}
                {isReplying && (
                  <motion.div
                    className="flex gap-2 mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <Input
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Skriv ett svar som kunden ser..."
                      className="bg-muted/50 border-border/50 text-sm"
                      onKeyDown={e => e.key === 'Enter' && sendReply(req.id)}
                    />
                    <Button onClick={() => sendReply(req.id)} disabled={!replyText.trim()} className="bg-primary text-primary-foreground">
                      <Send className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
