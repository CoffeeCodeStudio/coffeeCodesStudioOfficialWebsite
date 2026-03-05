import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { FolderKanban } from 'lucide-react';

const statuses = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Utveckling' },
  { value: 'testing', label: 'Testning' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Klart' },
];

interface Project {
  id: string;
  name: string;
  status: string;
  description: string | null;
  client_user_id: string;
  price: number | null;
  created_at: string;
}

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('projects').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      toast({ title: 'Status uppdaterad' });
    }
  };

  const updatePrice = async (id: string, price: string) => {
    const numPrice = price ? parseFloat(price) : null;
    await supabase.from('projects').update({ price: numPrice }).eq('id', id);
    setProjects(prev => prev.map(p => p.id === id ? { ...p, price: numPrice } : p));
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Alla projekt</h2>

      {projects.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <FolderKanban className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Inga projekt ännu. Skapa en ny kund först.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="glass-card cyber-border p-6 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-serif text-foreground">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Status</span>
                    <Select value={project.status} onValueChange={v => updateStatus(project.id, v)}>
                      <SelectTrigger className="w-40 bg-muted/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Pris (SEK)</span>
                    <input
                      type="number"
                      value={project.price ?? ''}
                      onChange={e => updatePrice(project.id, e.target.value)}
                      placeholder="0"
                      className="w-28 h-10 rounded-md border border-border/50 bg-muted/50 px-3 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
