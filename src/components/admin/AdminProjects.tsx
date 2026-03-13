import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { FolderKanban, Trash2, AlertCircle } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { AdminAgreement } from './AdminAgreement';

const statuses = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Utveckling' },
  { value: 'testing', label: 'Testning' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Klart' },
];

const packages = [
  { value: 'bas', label: 'Bas', quota: 3 },
  { value: 'standard', label: 'Standard', quota: 5 },
  { value: 'premium', label: 'Premium', quota: 10 },
];

interface Project {
  id: string;
  name: string;
  status: string;
  description: string | null;
  client_user_id: string;
  price: number | null;
  package: string;
  monthly_quota: number;
  renewal_date: string | null;
  system_prompt: string | null;
  created_at: string;
}

interface PendingChange {
  projectId: string;
  projectName: string;
  field: 'status' | 'package';
  oldLabel: string;
  newLabel: string;
  newValue: string;
  extraUpdates?: Record<string, any>;
}

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects((data as Project[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const updateField = async (id: string, field: string, value: any) => {
    const { error } = await supabase.from('projects').update({ [field]: value }).eq('id', id);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    }
  };

  const handleStatusChange = (project: Project, newValue: string) => {
    const oldLabel = statuses.find(s => s.value === project.status)?.label || project.status;
    const newLabel = statuses.find(s => s.value === newValue)?.label || newValue;
    setPendingChange({
      projectId: project.id,
      projectName: project.name,
      field: 'status',
      oldLabel,
      newLabel,
      newValue,
    });
  };

  const handlePackageChange = (project: Project, newValue: string) => {
    const oldLabel = packages.find(p => p.value === project.package)?.label || project.package;
    const pkg = packages.find(p => p.value === newValue);
    const newLabel = pkg?.label || newValue;
    setPendingChange({
      projectId: project.id,
      projectName: project.name,
      field: 'package',
      oldLabel,
      newLabel,
      newValue,
      extraUpdates: pkg ? { monthly_quota: pkg.quota } : undefined,
    });
  };

  const confirmChange = async () => {
    if (!pendingChange) return;
    const { projectId, field, newValue, extraUpdates } = pendingChange;
    await updateField(projectId, field, newValue);
    if (extraUpdates) {
      for (const [k, v] of Object.entries(extraUpdates)) {
        await updateField(projectId, k, v);
      }
    }
    toast({ title: 'Ändring sparad', description: `${pendingChange.projectName}: ${pendingChange.oldLabel} → ${pendingChange.newLabel}` });
    setPendingChange(null);
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Projekt raderat' });
    }
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
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-serif text-foreground">{project.name}</h3>
                    {project.description && (
                      <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <AdminAgreement projectId={project.id} projectName={project.name} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Radera projekt?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Detta raderar projektet "{project.name}" och all tillhörande data permanent. Åtgärden kan inte ångras.
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

                <div className="space-y-1 mb-4">
                  <span className="text-[10px] text-muted-foreground uppercase">AI-assistentens systempromt</span>
                  <Textarea
                    value={project.system_prompt || ''}
                    onChange={e => updateField(project.id, 'system_prompt', e.target.value || null)}
                    placeholder="Beskriv projektet för AI-assistenten, t.ex. 'Detta är en e-handelssite för...'"
                    className="bg-muted/50 border-border/50 min-h-[60px] text-sm"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Status</span>
                    <Select value={project.status} onValueChange={v => handleStatusChange(project, v)}>
                      <SelectTrigger className="bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Paket</span>
                    <Select value={project.package} onValueChange={v => handlePackageChange(project, v)}>
                      <SelectTrigger className="bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {packages.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Kvot/månad</span>
                    <Input type="number" value={project.monthly_quota}
                      onChange={e => updateField(project.id, 'monthly_quota', parseInt(e.target.value) || 3)}
                      className="bg-muted/50 border-border/50" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Pris (SEK)</span>
                    <Input type="number" value={project.price ?? ''}
                      onChange={e => updateField(project.id, 'price', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="0" className="bg-muted/50 border-border/50" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase">Förnyas</span>
                    <Input type="date" value={project.renewal_date || ''}
                      onChange={e => updateField(project.id, 'renewal_date', e.target.value || null)}
                      className="bg-muted/50 border-border/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation modal for status/package changes */}
      <Dialog open={!!pendingChange} onOpenChange={open => { if (!open) setPendingChange(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bekräfta ändring</DialogTitle>
            <DialogDescription>
              Är du säker på att du vill ändra {pendingChange?.field === 'status' ? 'status' : 'paket'} för <strong>{pendingChange?.projectName}</strong> från <strong>{pendingChange?.oldLabel}</strong> till <strong>{pendingChange?.newLabel}</strong>? Kunden kan komma att notifieras om ändringen.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingChange(null)}>Avbryt</Button>
            <Button onClick={confirmChange}>Bekräfta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
