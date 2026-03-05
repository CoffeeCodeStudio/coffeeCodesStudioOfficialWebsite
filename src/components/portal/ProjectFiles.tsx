import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { FileArchive, Download, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ProjectFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
  project_id: string;
}

interface Project {
  id: string;
  name: string;
}

export function ProjectFiles() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('project_files').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name'),
    ]).then(([filesRes, projRes]) => {
      setFiles((filesRes.data as ProjectFile[]) || []);
      const map: Record<string, string> = {};
      ((projRes.data as Project[]) || []).forEach(p => { map[p.id] = p.name; });
      setProjects(map);
      setLoading(false);
    });
  }, []);

  const handleDownload = async (file: ProjectFile) => {
    const { data } = await supabase.storage.from('project-files').download(file.file_path);
    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Viktiga filer</h2>

      {files.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <FileArchive className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Inga filer uppladdade ännu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file, i) => (
            <motion.div
              key={file.id}
              className="glass-card p-4 rounded-xl flex items-center justify-between gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileArchive className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{projects[file.project_id] || 'Projekt'}</span>
                    <span>{formatSize(file.file_size)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(file.created_at), 'd MMM yyyy', { locale: sv })}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDownload(file)}
                className="text-primary hover:bg-primary/10 flex-shrink-0"
              >
                <Download className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
