import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProjectChat } from '@/components/chat/ProjectChat';
import { MessageCircle } from 'lucide-react';

interface Project {
  id: string;
  name: string;
}

export function ClientMessages() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id || '';
      setUserId(uid);
      supabase.from('projects').select('id, name').eq('client_user_id', uid).then(({ data: p }) => {
        setProjects((p as Project[]) || []);
      });
    });
  }, []);

  if (!userId) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Meddelanden</h2>

      {projects.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Inga projekt ännu.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map(project => (
            <div key={project.id}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">{project.name}</h3>
              <div className="glass-card cyber-border rounded-2xl overflow-hidden">
                <ProjectChat projectId={project.id} isAdmin={false} currentUserId={userId} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
