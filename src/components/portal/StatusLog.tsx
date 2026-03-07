import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { MessageSquare, User } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface LogEntry {
  id: string;
  message: string;
  author_name: string;
  created_at: string;
  project_id: string;
}

interface Project {
  id: string;
  name: string;
}

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

  // Realtime
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
      <h2 className="text-2xl font-serif gradient-text">Aktivitetsflöde</h2>

      {logs.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Inga uppdateringar ännu.</p>
          <p className="text-xs text-muted-foreground">Aktiviteter visas här automatiskt när ditt projekt uppdateras.</p>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border/30" />

          <div className="space-y-4">
            {logs.map((log, i) => (
              <motion.div
                key={log.id}
                className="flex gap-4 pl-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="relative z-10 w-6 h-6 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>

                <div className="glass-card p-4 rounded-xl flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <User className="w-3 h-3" />
                      <span>{log.author_name}</span>
                      <span>•</span>
                      <span>{projects[log.project_id] || 'Projekt'}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(log.created_at), 'd MMM HH:mm', { locale: sv })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{log.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
