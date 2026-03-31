import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Image, Plus, Trash2, GripVertical, ExternalLink, EyeOff, ChevronDown, X, Upload, Loader2, Eye } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string | null;
  image_url: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
}

const emptyProject = {
  title: '',
  category: '',
  description: '',
  url: '',
  image_url: '',
  is_visible: true,
};

function sanitizeFilename(name: string): string {
  return name
    .replace(/å/g, 'a').replace(/ä/g, 'a').replace(/ö/g, 'o')
    .replace(/Å/g, 'A').replace(/Ä/g, 'A').replace(/Ö/g, 'O')
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_\-\.]/g, '');
}

interface DropZoneProps {
  projectId: string;
  currentImage: string | null;
  uploading: boolean;
  onUpload: (id: string, file: File) => void;
}

function DropZone({ projectId, currentImage, uploading, onUpload }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onUpload(projectId, file);
    }
  }, [projectId, onUpload]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !uploading && fileInputRef.current?.click()}
      className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
        isDragging
          ? 'border-primary bg-primary/10 scale-[1.01]'
          : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
      } ${currentImage ? 'p-2' : 'p-6'}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(projectId, f); }}
        disabled={uploading}
      />
      
      {uploading ? (
        <div className="flex flex-col items-center justify-center py-4 gap-2">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-xs text-muted-foreground">Laddar upp...</p>
        </div>
      ) : currentImage ? (
        <div className="relative group">
          <img src={currentImage} alt="Projektbild" className="w-full h-40 object-cover rounded-lg" />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-1">
            <Upload className="w-5 h-5 text-foreground" />
            <p className="text-xs text-foreground font-medium">Byt bild</p>
            <p className="text-[10px] text-muted-foreground">Dra & släpp eller klicka</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Dra & släpp en bild här</p>
          <p className="text-[10px] text-muted-foreground">eller klicka för att välja fil</p>
        </div>
      )}
    </div>
  );
}

export function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newProject, setNewProject] = useState({ ...emptyProject });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('portfolio_projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      toast({ title: 'Fel', description: 'Kunde inte hämta portfölj.', variant: 'destructive' });
    }
    setProjects((data as PortfolioProject[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const updateField = async (id: string, field: string, value: any) => {
    const { error } = await supabase
      .from('portfolio_projects')
      .update({ [field]: value })
      .eq('id', id);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    }
  };

  const uploadImage = useCallback(async (id: string, file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop() || 'webp';
    const safeName = sanitizeFilename(`${id}_${Date.now()}.${ext}`);
    const path = `${safeName}`;
    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: 'Uppladdningsfel', description: uploadError.message, variant: 'destructive' });
      return null;
    }
    const { data: urlData } = supabase.storage.from('portfolio-images').getPublicUrl(path);
    return urlData.publicUrl;
  }, [toast]);

  const handleImageUpload = useCallback(async (id: string, file: File) => {
    setUploading(id);
    const publicUrl = await uploadImage(id, file);
    if (publicUrl) {
      await updateField(id, 'image_url', publicUrl);
      toast({ title: 'Bild uppladdad!' });
    }
    setUploading(null);
  }, [uploadImage, toast]);

  const handleNewImageDrop = useCallback((file: File) => {
    setNewImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setNewImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const createProject = async () => {
    if (!newProject.title.trim()) {
      toast({ title: 'Titel krävs', variant: 'destructive' });
      return;
    }
    setCreating(true);
    const maxSort = projects.length > 0 ? Math.max(...projects.map(p => p.sort_order)) + 1 : 0;

    // Upload image first if provided
    let imageUrl: string | null = newProject.image_url.trim() || null;
    if (newImageFile) {
      const tempId = crypto.randomUUID();
      const uploaded = await uploadImage(tempId, newImageFile);
      if (uploaded) imageUrl = uploaded;
    }

    const { error } = await supabase.from('portfolio_projects').insert({
      title: newProject.title.trim(),
      category: newProject.category.trim(),
      description: newProject.description.trim(),
      url: newProject.url.trim() || null,
      image_url: imageUrl,
      sort_order: maxSort,
      is_visible: newProject.is_visible,
    });
    setCreating(false);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Projekt tillagt!' });
      setNewProject({ ...emptyProject });
      setNewImageFile(null);
      setNewImagePreview(null);
      setShowCreate(false);
      fetchProjects();
    }
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Projekt borttaget' });
    }
  };

  const moveProject = async (id: string, direction: 'up' | 'down') => {
    const idx = projects.findIndex(p => p.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= projects.length) return;

    const a = projects[idx];
    const b = projects[swapIdx];
    await Promise.all([
      supabase.from('portfolio_projects').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('portfolio_projects').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    fetchProjects();
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif gradient-text">Portfölj</h2>
        <Button onClick={() => setShowCreate(!showCreate)} variant={showCreate ? 'outline' : 'default'} size="sm">
          {showCreate ? <><X className="w-4 h-4 mr-1" /> Stäng</> : <><Plus className="w-4 h-4 mr-1" /> Nytt projekt</>}
        </Button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="glass-card cyber-border rounded-2xl p-5 space-y-4">
              <h3 className="text-lg font-serif text-foreground">Nytt portföljprojekt</h3>
              
              {/* Drop zone for new project */}
              <NewProjectDropZone
                preview={newImagePreview}
                onDrop={handleNewImageDrop}
                onClear={() => { setNewImageFile(null); setNewImagePreview(null); }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase">Titel *</span>
                  <Input value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} placeholder="Projektnamn" className="bg-muted/50 border-border/50" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase">Kategori</span>
                  <Input value={newProject.category} onChange={e => setNewProject(p => ({ ...p, category: e.target.value }))} placeholder="T.ex. Kundprojekt" className="bg-muted/50 border-border/50" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase">URL</span>
                  <Input value={newProject.url} onChange={e => setNewProject(p => ({ ...p, url: e.target.value }))} placeholder="https://..." className="bg-muted/50 border-border/50" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground uppercase">Bild-URL (om ingen fil)</span>
                  <Input value={newProject.image_url} onChange={e => setNewProject(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." className="bg-muted/50 border-border/50" disabled={!!newImageFile} />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase">Beskrivning</span>
                <Textarea value={newProject.description} onChange={e => setNewProject(p => ({ ...p, description: e.target.value }))} placeholder="Kort beskrivning..." className="bg-muted/50 border-border/50" rows={2} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch checked={newProject.is_visible} onCheckedChange={v => setNewProject(p => ({ ...p, is_visible: v }))} />
                  <span className="text-sm text-muted-foreground">Synlig på hemsidan</span>
                </div>
                <Button onClick={createProject} disabled={creating}>
                  {creating ? 'Skapar...' : 'Lägg till'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project list */}
      {projects.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <Image className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Inga portföljprojekt ännu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className="glass-card cyber-border rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedId(prev => prev === project.id ? null : project.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {project.image_url && (
                    <img src={project.image_url} alt={project.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm font-serif text-foreground truncate">{project.title}</h3>
                    <p className="text-[10px] text-muted-foreground">{project.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {!project.is_visible && <EyeOff className="w-3 h-3 text-muted-foreground" />}
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === project.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {expandedId === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
                      {/* Drag & drop image zone */}
                      <DropZone
                        projectId={project.id}
                        currentImage={project.image_url}
                        uploading={uploading === project.id}
                        onUpload={handleImageUpload}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase">Titel</span>
                          <Input defaultValue={project.title} onBlur={e => { if (e.target.value !== project.title) updateField(project.id, 'title', e.target.value); }} className="bg-muted/50 border-border/50" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase">Kategori</span>
                          <Input defaultValue={project.category} onBlur={e => { if (e.target.value !== project.category) updateField(project.id, 'category', e.target.value); }} className="bg-muted/50 border-border/50" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase">URL</span>
                          <Input defaultValue={project.url || ''} onBlur={e => updateField(project.id, 'url', e.target.value || null)} className="bg-muted/50 border-border/50" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase">Bild-URL</span>
                          <Input defaultValue={project.image_url || ''} onBlur={e => updateField(project.id, 'image_url', e.target.value || null)} className="bg-muted/50 border-border/50" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase">Beskrivning</span>
                        <Textarea defaultValue={project.description} onBlur={e => { if (e.target.value !== project.description) updateField(project.id, 'description', e.target.value); }} className="bg-muted/50 border-border/50" rows={2} />
                      </div>


                      {/* Live preview */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Förhandsgranskning
                        </span>
                        <PortfolioCardPreview
                          title={project.title}
                          category={project.category}
                          description={project.description}
                          image_url={project.image_url}
                          url={project.url}
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch checked={project.is_visible} onCheckedChange={v => updateField(project.id, 'is_visible', v)} />
                            <span className="text-xs text-muted-foreground">{project.is_visible ? 'Synlig' : 'Dold'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveProject(project.id, 'up')} disabled={i === 0}>
                              <GripVertical className="w-3 h-3" />
                              <span className="text-[9px]">↑</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => moveProject(project.id, 'down')} disabled={i === projects.length - 1}>
                              <GripVertical className="w-3 h-3" />
                              <span className="text-[9px]">↓</span>
                            </Button>
                          </div>
                          {project.url && (
                            <Button variant="ghost" size="sm" className="text-xs" onClick={() => window.open(project.url!, '_blank')}>
                              <ExternalLink className="w-3 h-3 mr-1" /> Visa
                            </Button>
                          )}
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4 mr-1" /> Radera
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Radera portföljprojekt?</AlertDialogTitle>
                              <AlertDialogDescription>
                                "{project.title}" tas bort permanent från portföljen.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Avbryt</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteProject(project.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                Radera
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

// Drop zone for the "create new project" form
function NewProjectDropZone({ preview, onDrop, onClear }: { preview: string | null; onDrop: (file: File) => void; onClear: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) onDrop(file);
  }, [onDrop]);

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative rounded-xl border-2 border-dashed transition-all cursor-pointer ${
        isDragging ? 'border-primary bg-primary/10 scale-[1.01]' : 'border-border/50 hover:border-primary/50 hover:bg-muted/30'
      } ${preview ? 'p-2' : 'p-6'}`}
    >
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) onDrop(f); }} />
      {preview ? (
        <div className="relative group">
          <img src={preview} alt="Förhandsgranskning" className="w-full h-40 object-cover rounded-lg" />
          <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-1">
            <Upload className="w-5 h-5 text-foreground" />
            <p className="text-xs text-foreground font-medium">Byt bild</p>
          </div>
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/80 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Dra & släpp en bild här</p>
          <p className="text-[10px] text-muted-foreground">eller klicka för att välja fil</p>
        </div>
      )}
    </div>
  );
}

// Live preview mimicking the landing page card
function PortfolioCardPreview({ title, category, description, image_url, url }: {
  title: string; category: string; description: string; image_url: string | null; url: string | null;
}) {
  return (
    <div className="max-w-sm mx-auto">
      <div className="glass-card cyber-border rounded-2xl overflow-hidden border border-primary/20 flex flex-col pointer-events-none select-none">
        {image_url && (
          <div className="relative">
            <img src={image_url} alt={title} className="w-full h-48 object-cover" />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          {category && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                {category}
              </span>
            </div>
          )}
          <h3 className="text-lg font-serif text-foreground mb-2">
            {title || 'Projektnamn'}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">
            {description || 'Beskrivning...'}
          </p>
          {url && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-primary/30 text-primary text-sm w-fit">
              Besök sidan
              <ExternalLink className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
