import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { MessageSquare, User, RefreshCw, FileUp, MessageCircle, ClipboardList, PenLine } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface LogEntry {
  id: string;
  message: string;
  author_name: string;
  created_at: string;
  project_id: string;
  event_type: string;
}

interface Project {
  id: string;
  name: string;
}

const eventConfig: Record<string, { icon: typeof MessageSquare; color: string; label: string }> = {
  status_change: { icon: RefreshCw, color: 'text-blue-400 bg-blue-400/15 border-blue-400/30', label: 'Statusändring' },
  new_request: { icon: ClipboardList, color: 'text-amber-400 bg-amber-400/15 border-amber-400/30', label: 'Nytt ärende' },
  message: { icon: MessageCircle, color: 'text-green-400 bg-green-400/15 border-green-400/30', label: 'Meddelande' },
  file_upload: { icon: FileUp, color: 'text-purple-400 bg-purple-400/15 border-purple-400/30', label: 'Fil uppladdad' },
  manual: { icon: PenLine, color: 'text-primary bg-primary/15 border-primary/30', label: 'Uppdatering' },
};

export function StatusLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('status_logs').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name'),
    ]).then(([logsRes, projRes]) => {
      setLogs((logsRes.data as LogEntry[]) || []);
      const map: Record<string, string> = {};
      ((projRes.data as Project[]) || []).forEach(p => { map[p.id] = p.name; });
      setProjects(map);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('portal-status-logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'status_logs' }, (payload) => {
        setLogs(prev => [payload.new as LogEntry, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Aktivitetshistorik</h2>

      {logs.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Inga uppdateringar ännu.</p>
          <p className="text-xs text-muted-foreground">Aktiviteter loggas automatiskt här.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border/30" />
          <div className="space-y-4">
            {logs.map((log, i) => {
              const cfg = eventConfig[log.event_type] || eventConfig.manual;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={log.id}
                  className="flex gap-4 pl-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className={`relative z-10 w-7 h-7 rounded-full border flex items-center justify-center flex-shrink-0 mt-1 ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="glass-card p-4 rounded-xl flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className={`text-[10px] uppercase font-medium ${cfg.color.split(' ')[0]}`}>{cfg.label}</span>
                        <span>•</span>
                        <User className="w-3 h-3" />
                        <span>{log.author_name}</span>
                        <span>•</span>
                        <span>{projects[log.project_id] || 'Projekt'}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.created_at), 'd MMM yyyy HH:mm', { locale: sv })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{log.message}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
