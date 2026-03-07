import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Paintbrush, Code2, HardDrive, Rocket, CheckCircle2 } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: string;
  description: string | null;
  created_at: string;
}

const statusSteps = [
  { key: 'design', label: 'Design', icon: Paintbrush },
  { key: 'development', label: 'Utveckling', icon: Code2 },
  { key: 'testing', label: 'Testning', icon: HardDrive },
  { key: 'live', label: 'Live', icon: Rocket },
  { key: 'completed', label: 'Klart', icon: CheckCircle2 },
];

// Request-level timeline
const requestTimeline = [
  { key: 'pending', label: 'Inkommen' },
  { key: 'reviewing', label: 'Granskas' },
  { key: 'in_progress', label: 'Pågår' },
  { key: 'review_ready', label: 'Klar för granskning' },
  { key: 'delivered', label: 'Levererad' },
];

interface ClientRequest {
  id: string;
  message: string;
  status: string;
  category: string;
  priority: string;
  created_at: string;
  project_id: string;
}

export function ProjectStatus() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('client_requests').select('*').order('created_at', { ascending: false }),
    ]).then(([projRes, reqRes]) => {
      setProjects((projRes.data as Project[]) || []);
      setRequests((reqRes.data as ClientRequest[]) || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('portal-projects-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => {
        setProjects(prev => prev.map(p => p.id === (payload.new as Project).id ? { ...p, ...payload.new as Project } : p));
      })
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

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (projects.length === 0) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center">
        <Rocket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">Inga projekt ännu.</p>
        <p className="text-xs text-muted-foreground">Ditt projekt visas här så snart det har skapats.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif gradient-text">Projektstatus</h2>
      {projects.map((project, pi) => {
        const currentIndex = statusSteps.findIndex(s => s.key === project.status);
        const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / statusSteps.length) * 100 : 0;
        const projectRequests = requests.filter(r => r.project_id === project.id && r.status !== 'delivered');

        return (
          <motion.div
            key={project.id}
            className="glass-card cyber-border p-6 md:p-8 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pi * 0.1 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-serif text-foreground">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Framsteg</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Progress steps */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {statusSteps.map((step, i) => {
                const Icon = step.icon;
                const isDone = i <= currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <div key={step.key} className="flex items-center gap-2 flex-shrink-0">
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                          : isDone
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'bg-muted/30 text-muted-foreground border border-border/30'
                      }`}
                      animate={isCurrent ? { scale: [1, 1.03, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{step.label}</span>
                    </motion.div>
                    {i < statusSteps.length - 1 && (
                      <div className={`w-6 h-0.5 ${isDone ? 'bg-accent/50' : 'bg-border/30'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active request timelines */}
            {projectRequests.length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/20">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Aktiva ärenden ({projectRequests.length})
                </p>
                <div className="space-y-3">
                  {projectRequests.slice(0, 5).map(req => {
                    const reqIndex = requestTimeline.findIndex(s => s.key === req.status);
                    return (
                      <div key={req.id} className="bg-muted/20 rounded-lg p-3">
                        <p className="text-xs text-foreground mb-2 line-clamp-1">{req.message}</p>
                        <div className="flex items-center gap-1">
                          {requestTimeline.map((step, si) => {
                            const isDone = si <= reqIndex;
                            const isCurrent = si === reqIndex;
                            return (
                              <div key={step.key} className="flex items-center gap-1 flex-1">
                                <div className={`h-1.5 flex-1 rounded-full transition-all ${
                                  isCurrent ? 'bg-primary' : isDone ? 'bg-accent/60' : 'bg-border/30'
                                }`} />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[9px] text-muted-foreground">{requestTimeline[0].label}</span>
                          <span className={`text-[9px] font-medium ${reqIndex >= 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                            {requestTimeline[reqIndex]?.label || 'Inkommen'}
                          </span>
                          <span className="text-[9px] text-muted-foreground">{requestTimeline[requestTimeline.length - 1].label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
