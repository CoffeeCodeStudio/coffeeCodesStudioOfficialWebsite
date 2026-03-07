import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Send, MessageSquare, RefreshCw, FileUp, MessageCircle, ClipboardList, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Project { id: string; name: string; }
interface LogEntry { id: string; message: string; author_name: string; created_at: string; project_id: string; event_type: string; }

const eventConfig: Record<string, { icon: typeof MessageSquare; color: string; label: string }> = {
  status_change: { icon: RefreshCw, color: 'text-blue-400 bg-blue-400/15 border-blue-400/30', label: 'Status' },
  new_request: { icon: ClipboardList, color: 'text-amber-400 bg-amber-400/15 border-amber-400/30', label: 'Ärende' },
  message: { icon: MessageCircle, color: 'text-green-400 bg-green-400/15 border-green-400/30', label: 'Meddelande' },
  file_upload: { icon: FileUp, color: 'text-purple-400 bg-purple-400/15 border-purple-400/30', label: 'Fil' },
  manual: { icon: PenLine, color: 'text-primary bg-primary/15 border-primary/30', label: 'Manuell' },
};

export function AdminStatusLog() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id, name').order('name'),
      supabase.from('status_logs').select('*').order('created_at', { ascending: false }),
    ]).then(([pRes, lRes]) => {
      setProjects((pRes.data as Project[]) || []);
      setLogs((lRes.data as LogEntry[]) || []);
    });
  }, []);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('admin-status-logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'status_logs' }, (payload) => {
        setLogs(prev => [payload.new as LogEntry, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !selectedProject) return;
    setSending(true);
    const { data, error } = await supabase.from('status_logs').insert({
      project_id: selectedProject,
      message: message.trim(),
      author_name: 'Admin',
      event_type: 'manual',
    } as any).select().single();
    setSending(false);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setMessage('');
      toast({ title: 'Uppdatering skickad!' });
    }
  };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));
  const filteredLogs = filterType === 'all' ? logs : logs.filter(l => l.event_type === filterType);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Aktivitetshistorik</h2>

      {/* Manual entry */}
      <div className="glass-card cyber-border p-6 rounded-2xl space-y-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-64 bg-muted/50 border-border/50">
            <SelectValue placeholder="Välj projekt" />
          </SelectTrigger>
          <SelectContent>
            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Input value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Skriv en statusuppdatering..." className="bg-muted/50 border-border/50"
            onKeyDown={e => e.key === 'Enter' && handleSend()} />
          <Button onClick={handleSend} disabled={!message.trim() || !selectedProject || sending}
            className="glow-button bg-primary text-primary-foreground">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[{ value: 'all', label: 'Alla' }, ...Object.entries(eventConfig).map(([k, v]) => ({ value: k, label: v.label }))].map(f => (
          <button key={f.value} onClick={() => setFilterType(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
              filterType === f.value
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'text-muted-foreground border-border/30 hover:border-border/60'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Log entries */}
      <div className="space-y-2">
        {filteredLogs.map((log, i) => {
          const cfg = eventConfig[log.event_type] || eventConfig.manual;
          const Icon = cfg.icon;
          return (
            <motion.div key={log.id} className="glass-card p-4 rounded-xl"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${cfg.color}`}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className={`text-[10px] uppercase font-medium ${cfg.color.split(' ')[0]}`}>{cfg.label}</span>
                  <span className="text-xs text-primary font-medium">{projectMap[log.project_id] || 'Projekt'}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(log.created_at), 'd MMM yyyy HH:mm', { locale: sv })}
                </span>
              </div>
              <p className="text-sm text-foreground pl-7">{log.message}</p>
            </motion.div>
          );
        })}
        {filteredLogs.length === 0 && (
          <div className="text-center text-muted-foreground py-8 text-sm">Inga aktiviteter att visa.</div>
        )}
      </div>
    </div>
  );
}
