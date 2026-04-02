import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileArchive, Trash2, Download, Eye, Image, FileText, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { FilePreviewModal } from '@/components/portal/FilePreviewModal';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Project { id: string; name: string; }
interface ProjectFile { id: string; file_name: string; file_path: string; file_size: number | null; project_id: string; created_at: string; }

export function AdminFileUpload() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState<ProjectFile | null>(null);
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

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
    'application/pdf',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain', 'text/csv',
    'application/zip', 'application/x-zip-compressed',
  ];

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedProject) return;

    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'Filen är för stor', description: 'Max filstorlek är 10 MB.', variant: 'destructive' });
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({ title: 'Otillåten filtyp', description: 'Tillåtna format: bilder, PDF, Office-dokument, text, CSV och ZIP.', variant: 'destructive' });
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

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

  const getFileIcon = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext || '')) return Image;
    return FileText;
  };

  const formatSize = (bytes: number | null) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        {files.map((file, i) => {
          const FileIcon = getFileIcon(file.file_name);
          return (
            <motion.div
              key={file.id}
              className="glass-card p-4 rounded-xl flex items-center justify-between gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">{file.file_name}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-0.5">
                    <span>{projectMap[file.project_id] || 'Projekt'}</span>
                    <span>{formatSize(file.file_size)}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(file.created_at), 'd MMM yyyy', { locale: sv })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="icon" onClick={() => setPreviewFile(file)} title="Förhandsgranska">
                  <Eye className="w-4 h-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDownload(file)} title="Ladda ner">
                  <Download className="w-4 h-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(file)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {previewFile && (
        <FilePreviewModal
          open={!!previewFile}
          onOpenChange={(open) => { if (!open) setPreviewFile(null); }}
          fileName={previewFile.file_name}
          filePath={previewFile.file_path}
        />
      )}
    </div>
  );
}