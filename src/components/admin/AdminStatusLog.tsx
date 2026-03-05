import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Send, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Project { id: string; name: string; }
interface LogEntry { id: string; message: string; author_name: string; created_at: string; project_id: string; }

export function AdminStatusLog() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
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

  const handleSend = async () => {
    if (!message.trim() || !selectedProject) return;
    setSending(true);

    const { data, error } = await supabase.from('status_logs').insert({
      project_id: selectedProject,
      message: message.trim(),
      author_name: 'Admin',
    }).select().single();

    setSending(false);

    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setLogs(prev => [data as LogEntry, ...prev]);
      setMessage('');
      toast({ title: 'Uppdatering skickad!' });
    }
  };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Statuslogg</h2>

      <div className="glass-card cyber-border p-6 rounded-2xl space-y-4">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-64 bg-muted/50 border-border/50">
            <SelectValue placeholder="Välj projekt" />
          </SelectTrigger>
          <SelectContent>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Skriv en statusuppdatering..."
            className="bg-muted/50 border-border/50"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} disabled={!message.trim() || !selectedProject || sending}
            className="glow-button bg-primary text-primary-foreground">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {logs.map((log, i) => (
          <motion.div
            key={log.id}
            className="glass-card p-4 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-primary font-medium">{projectMap[log.project_id] || 'Projekt'}</span>
              <span className="text-[10px] text-muted-foreground">
                {format(new Date(log.created_at), 'd MMM HH:mm', { locale: sv })}
              </span>
            </div>
            <p className="text-sm text-foreground">{log.message}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
