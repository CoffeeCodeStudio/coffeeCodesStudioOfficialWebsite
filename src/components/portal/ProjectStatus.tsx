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

export function ProjectStatus() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setProjects((data as Project[]) || []);
        setLoading(false);
      });
  }, []);

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('portal-projects-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => {
        setProjects(prev => prev.map(p => p.id === (payload.new as Project).id ? { ...p, ...payload.new as Project } : p));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Inga projekt ännu.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif gradient-text">Projektstatus</h2>
      {projects.map((project, pi) => {
        const currentIndex = statusSteps.findIndex(s => s.key === project.status);
        const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / statusSteps.length) * 100 : 0;

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
          </motion.div>
        );
      })}
    </div>
  );
}
