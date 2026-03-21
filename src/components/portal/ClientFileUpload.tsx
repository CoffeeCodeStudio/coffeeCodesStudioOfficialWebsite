import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Upload, FileArchive, Download, Calendar, Image, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface ProjectFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
  project_id: string;
  uploaded_by: string | null;
}

interface Project {
  id: string;
  name: string;
}

export function ClientFileUpload() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('project_files').select('*').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name'),
    ]).then(([filesRes, projRes]) => {
      setFiles((filesRes.data as ProjectFile[]) || []);
      const projs = (projRes.data as Project[]) || [];
      setProjects(projs);
      if (projs.length === 1) setSelectedProject(projs[0].id);
      setLoading(false);
    });
  }, []);

  // Realtime for new files
  useEffect(() => {
    const channel = supabase
      .channel('portal-files-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_files' }, (payload) => {
        setFiles(prev => {
          if (prev.some(f => f.id === (payload.new as ProjectFile).id)) return prev;
          return [payload.new as ProjectFile, ...prev];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const sanitizeFileName = (name: string) => {
    const ext = name.lastIndexOf('.') >= 0 ? name.slice(name.lastIndexOf('.')) : '';
    let base = name.lastIndexOf('.') >= 0 ? name.slice(0, name.lastIndexOf('.')) : name;
    base = base.replace(/[åÅ]/g, m => m === 'å' ? 'a' : 'A')
               .replace(/[äÄ]/g, m => m === 'ä' ? 'a' : 'A')
               .replace(/[öÖ]/g, m => m === 'ö' ? 'o' : 'O')
               .replace(/\s+/g, '_')
               .replace(/[^a-zA-Z0-9_\-.]/g, '');
    return (base || 'file') + ext;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProject) return;

    setUploading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const safeName = sanitizeFileName(file.name);
    const path = `${selectedProject}/client_${Date.now()}_${safeName}`;
    const { error: uploadError } = await supabase.storage.from('project-files').upload(path, file);

    if (uploadError) {
      toast({ title: 'Uppladdningsfel', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { error: dbError } = await supabase.from('project_files').insert({
      project_id: selectedProject,
      file_name: file.name,
      file_path: path,
      file_size: file.size,
      uploaded_by: user?.id || null,
    });

    setUploading(false);

    if (dbError) {
      toast({ title: 'Databasfel', description: dbError.message, variant: 'destructive' });
    } else {
      toast({ title: 'Fil uppladdad!' });
    }

    if (fileRef.current) fileRef.current.value = '';
  };

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

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return Image;
    return FileText;
  };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Projektfiler</h2>

      {/* Upload section */}
      <div className="glass-card cyber-border p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <Upload className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-foreground text-sm">Ladda upp material</h3>
        </div>
        <p className="text-xs text-muted-foreground">Ladda upp logotyper, bilder eller annat material till ditt projekt.</p>

        <div className="flex flex-col sm:flex-row gap-3">
          {projects.length > 1 && (
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-48 bg-muted/50 border-border/50">
                <SelectValue placeholder="Välj projekt" />
              </SelectTrigger>
              <SelectContent>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div>
            <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" id="client-file-upload"
              disabled={!selectedProject || uploading} />
            <Button asChild disabled={!selectedProject || uploading} className="glow-button bg-primary text-primary-foreground">
              <label htmlFor="client-file-upload" className="cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? 'Laddar upp...' : 'Välj fil'}
              </label>
            </Button>
          </div>
        </div>
      </div>

      {/* Files list */}
      {files.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <FileArchive className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Inga filer ännu.</p>
          <Button variant="outline" className="border-primary/30 text-primary" onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" />
            Ladda upp din första fil
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file, i) => {
            const FileIcon = getFileIcon(file.file_name);
            return (
              <motion.div
                key={file.id}
                className="glass-card p-4 rounded-xl flex items-center justify-between gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.file_name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>{projectMap[file.project_id] || 'Projekt'}</span>
                      <span>{formatSize(file.file_size)}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(file.created_at), 'd MMM yyyy', { locale: sv })}
                      </span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDownload(file)}
                  className="text-primary hover:bg-primary/10 flex-shrink-0">
                  <Download className="w-4 h-4" />
                </Button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
