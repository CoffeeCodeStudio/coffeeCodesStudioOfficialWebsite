import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { MessageSquare, User, RefreshCw, FileUp, MessageCircle, ClipboardList, PenLine, Search, CalendarIcon, X, Download } from 'lucide-react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({ from: undefined, to: undefined });

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProjects } = await supabase
        .from('projects')
        .select('id, name')
        .eq('client_user_id', user.id);

      const projs = (userProjects as Project[]) || [];
      const map: Record<string, string> = {};
      projs.forEach(p => { map[p.id] = p.name; });
      setProjects(map);

      if (projs.length > 0) {
        const projectIds = projs.map(p => p.id);
        const { data: logsData } = await supabase
          .from('status_logs')
          .select('*')
          .in('project_id', projectIds)
          .order('created_at', { ascending: false });
        setLogs((logsData as LogEntry[]) || []);
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const projectIds = Object.keys(projects);
    if (projectIds.length === 0) return;

    const filter = `project_id=in.(${projectIds.join(',')})`;
    const channel = supabase
      .channel('portal-status-logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'status_logs', filter }, (payload) => {
        setLogs(prev => [payload.new as LogEntry, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projects]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search filter
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        log.message.toLowerCase().includes(query) ||
        log.author_name.toLowerCase().includes(query) ||
        (projects[log.project_id] || '').toLowerCase().includes(query) ||
        (eventConfig[log.event_type]?.label || '').toLowerCase().includes(query);
      
      // Date filter
      const logDate = new Date(log.created_at);
      let matchesDate = true;
      if (dateRange.from && dateRange.to) {
        matchesDate = isWithinInterval(logDate, { start: startOfDay(dateRange.from), end: endOfDay(dateRange.to) });
      } else if (dateRange.from) {
        matchesDate = logDate >= startOfDay(dateRange.from);
      }
      
      return matchesSearch && matchesDate;
    });
  }, [logs, searchQuery, dateRange, projects]);

  const clearFilters = () => {
    setSearchQuery('');
    setDateRange({ from: undefined, to: undefined });
  };

  const hasFilters = searchQuery || dateRange.from || dateRange.to;

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Aktivitetshistorik</h2>

      {/* Search and Date Filter */}
      <div className="glass-card cyber-border p-4 rounded-2xl">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Sök i aktiviteter..."
              className="pl-10 bg-muted/50 border-border/50"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn(
                "justify-start text-left font-normal bg-muted/50 border-border/50 min-w-[200px]",
                !dateRange.from && "text-muted-foreground"
              )}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "d MMM", { locale: sv })} - {format(dateRange.to, "d MMM", { locale: sv })}
                    </>
                  ) : (
                    format(dateRange.from, "d MMM yyyy", { locale: sv })
                  )
                ) : (
                  <span>Välj datumintervall</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                numberOfMonths={1}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4 mr-1" />
              Rensa
            </Button>
          )}
        </div>
        
        {hasFilters && (
          <p className="text-xs text-muted-foreground mt-3">
            Visar {filteredLogs.length} av {logs.length} aktiviteter
          </p>
        )}
      </div>

      {filteredLogs.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">
            {hasFilters ? 'Inga aktiviteter matchar din sökning.' : 'Inga uppdateringar ännu.'}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {hasFilters ? '' : 'Aktiviteter loggas automatiskt när saker händer i ditt projekt.'}
          </p>
          {hasFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Rensa filter
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border/30" />
          <div className="space-y-4">
            {filteredLogs.map((log, i) => {
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
