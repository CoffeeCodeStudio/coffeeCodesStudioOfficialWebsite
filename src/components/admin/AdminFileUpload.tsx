import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileArchive, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project { id: string; name: string; }
interface ProjectFile { id: string; file_name: string; file_path: string; file_size: number | null; project_id: string; created_at: string; }

export function AdminFileUpload() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id, name').order('name'),
      supabase.from('project_files').select('*').order('created_at', { ascending: false }),
    ]).then(([pRes, fRes]) => {
      setProjects((pRes.data as Project[]) || []);
      setFiles((fRes.data as ProjectFile[]) || []);
    });
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
    const safeName = sanitizeFileName(file.name);
    const path = `${selectedProject}/${Date.now()}_${safeName}`;
    const { error: uploadError } = await supabase.storage.from('project-files').upload(path, file);

    if (uploadError) {
      toast({ title: 'Uppladdningsfel', description: uploadError.message, variant: 'destructive' });
      setUploading(false);
      return;
    }

    const { data: inserted, error: dbError } = await supabase.from('project_files').insert({
      project_id: selectedProject,
      file_name: file.name,
      file_path: path,
      file_size: file.size,
    }).select().single();

    setUploading(false);

    if (dbError) {
      toast({ title: 'Databasfel', description: dbError.message, variant: 'destructive' });
    } else {
      setFiles(prev => [inserted as ProjectFile, ...prev]);
      toast({ title: 'Fil uppladdad!' });
    }

    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (file: ProjectFile) => {
    await supabase.storage.from('project-files').remove([file.file_path]);
    await supabase.from('project_files').delete().eq('id', file.id);
    setFiles(prev => prev.filter(f => f.id !== file.id));
    toast({ title: 'Fil borttagen' });
  };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Filhantering</h2>

      <div className="glass-card cyber-border p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-64 bg-muted/50 border-border/50">
              <SelectValue placeholder="Välj projekt" />
            </SelectTrigger>
            <SelectContent>
              {projects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" id="file-upload" disabled={!selectedProject || uploading} />
            <Button asChild disabled={!selectedProject || uploading} className="glow-button bg-primary text-primary-foreground">
              <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                <Upload className="w-4 h-4" />
                {uploading ? 'Laddar upp...' : 'Ladda upp fil'}
              </label>
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {files.map((file, i) => (
          <motion.div
            key={file.id}
            className="glass-card p-4 rounded-xl flex items-center justify-between gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <FileArchive className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-foreground truncate">{file.file_name}</p>
                <p className="text-[10px] text-muted-foreground">{projectMap[file.project_id] || 'Projekt'}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(file)} className="text-destructive hover:bg-destructive/10 flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
