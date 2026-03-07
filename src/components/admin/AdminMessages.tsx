import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectChat } from '@/components/chat/ProjectChat';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

export function AdminMessages() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || ''));
    supabase.from('projects').select('id, name').order('name').then(({ data }) => {
      const p = (data as Project[]) || [];
      setProjects(p);
      if (p.length > 0) setSelectedProject(p[0].id);
    });
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Meddelanden</h2>

      {projects.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Inga projekt att visa meddelanden för.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="max-w-xs">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="bg-muted/50 border-border/50">
                <SelectValue placeholder="Välj projekt" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {selectedProject && userId && (
            <div className="glass-card cyber-border rounded-2xl overflow-hidden">
              <ProjectChat projectId={selectedProject} isAdmin={true} currentUserId={userId} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
