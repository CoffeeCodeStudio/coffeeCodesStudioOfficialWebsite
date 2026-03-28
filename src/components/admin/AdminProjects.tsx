import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderKanban, Trash2, AlertCircle, Crown, ChevronDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { AdminAgreement } from './AdminAgreement';
import { AdminPubAgreement } from './AdminPubAgreement';

import { PROJECT_STATUSES } from '@/lib/projectStatuses';

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
  created_at: string;
  questionnaire_reminded_at: string | null;
  is_vip: boolean;
}

const isQuestionnaireOverdue = (project: Project) => {
  if (project.status !== 'questionnaire') return false;
  const created = new Date(project.created_at).getTime();
  return Date.now() - created > 24 * 60 * 60 * 1000;
};

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
  const [adminDataMap, setAdminDataMap] = useState<Record<string, { system_prompt: string; vip_notes: string }>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [pendingChange, setPendingChange] = useState<PendingChange | null>(null);
  const { toast } = useToast();

  const fetchProjects = async () => {
    const [projRes, adminRes] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('project_admin_data').select('project_id, system_prompt, vip_notes'),
    ]);

    if (projRes.error) {
      console.error('Kunde inte hämta projekt:', projRes.error);
      toast({ title: 'Fel', description: 'Kunde inte hämta projekt.', variant: 'destructive' });
      setProjects([]);
    } else {
      setProjects((projRes.data as Project[]) || []);
    }

    const map: Record<string, { system_prompt: string; vip_notes: string }> = {};
    ((adminRes.data as any[]) || []).forEach((d: any) => {
      map[d.project_id] = {
        system_prompt: d.system_prompt || '',
        vip_notes: d.vip_notes || '',
      };
    });
    setAdminDataMap(map);

    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, []);

  const updateProject = async (id: string, updates: Record<string, any>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Kunde inte uppdatera projekt:', { id, updates, error });
      toast({ title: 'Fel vid uppdatering', description: error.message, variant: 'destructive' });
      return null;
    }

    if (!data) {
      const message = 'Ingen uppdatering genomfördes. Kontrollera behörighet (RLS) eller att projektet finns.';
      console.error(message, { id, updates });
      toast({ title: 'Uppdatering misslyckades', description: message, variant: 'destructive' });
      return null;
    }

    setProjects(prev => prev.map(p => (p.id === id ? (data as Project) : p)));
    return data as Project;
  };

  const updateField = async (id: string, field: string, value: any) => {
    await updateProject(id, { [field]: value });
  };

  const updateAdminField = async (projectId: string, field: string, value: any) => {
    const { error } = await supabase.from('project_admin_data' as any)
      .upsert({ project_id: projectId, [field]: value } as any, { onConflict: 'project_id' });
    if (error) {
      toast({ title: 'Fel', description: 'Kunde inte spara.', variant: 'destructive' });
    } else {
      setAdminDataMap(prev => ({
        ...prev,
        [projectId]: { ...(prev[projectId] || { system_prompt: '', vip_notes: '' }), [field]: String(value || '') },
      }));
    }
  };

  const handleStatusChange = (project: Project, newValue: string) => {
    const oldLabel = PROJECT_STATUSES.find(s => s.value === project.status)?.label || project.status;
    const newLabel = PROJECT_STATUSES.find(s => s.value === newValue)?.label || newValue;
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
    const updates = { [field]: newValue, ...(extraUpdates || {}) };
    const updated = await updateProject(projectId, updates);

    if (!updated) {
      return;
    }

    toast({
      title: 'Ändring sparad',
      description: `${pendingChange.projectName}: ${pendingChange.oldLabel} → ${pendingChange.newLabel}`,
    });
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
              className="glass-card cyber-border rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              {/* Clickable header */}
              <button
                type="button"
                className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedId(prev => prev === project.id ? null : project.id)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="text-lg font-serif text-foreground truncate">{project.name}</h3>
                  {project.is_vip && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-medium border border-amber-500/20 shrink-0">
                      <Crown className="w-3 h-3" />
                      VIP
                    </span>
                  )}
                  {isQuestionnaireOverdue(project) && (
                    <span title="Väntar på svar i mer än 24 timmar">
                      <AlertCircle className="w-5 h-5 text-yellow-500 animate-pulse" />
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {PROJECT_STATUSES.find(s => s.value === project.status)?.label || project.status}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${expandedId === project.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Expandable detail view */}
              <AnimatePresence>
                {expandedId === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 space-y-4 border-t border-border/30 pt-4">
                      {project.description && (
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      )}

                      {/* System prompt – full view */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase">AI-assistentens systempromt</span>
                        <Textarea
                          value={adminDataMap[project.id]?.system_prompt || ''}
                          onChange={e => {
                            updateAdminField(project.id, 'system_prompt', e.target.value || null);
                            e.target.style.height = 'auto';
                            e.target.style.height = e.target.scrollHeight + 'px';
                          }}
                          onFocus={e => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                          ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                          placeholder="Beskriv projektet för AI-assistenten, t.ex. 'Detta är en e-handelssite för...'"
                          className="bg-muted/50 border-border/50 text-sm resize-none overflow-hidden"
                          rows={2}
                        />
                      </div>

                      {/* VIP notes – only visible when VIP */}
                      {project.is_vip && (
                        <div className="space-y-1 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
                          <span className="text-[10px] text-amber-400 uppercase flex items-center gap-1">
                            <Crown className="w-3 h-3" /> VIP-anteckningar
                          </span>
                          <Textarea
                            value={adminDataMap[project.id]?.vip_notes || ''}
                            onChange={e => {
                              updateAdminField(project.id, 'vip_notes', e.target.value || null);
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            ref={el => { if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; } }}
                            placeholder="Speciella villkor, rabatter, överenskommelser..."
                            className="bg-muted/50 border-amber-500/20 text-sm resize-none overflow-hidden"
                            rows={2}
                          />
                        </div>
                      )}

                      {/* Settings grid */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase">Status</span>
                          <Select value={project.status} onValueChange={v => handleStatusChange(project, v)}>
                            <SelectTrigger className="bg-muted/50 border-border/50"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {PROJECT_STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
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
                        <div className="space-y-1">
                          <span className="text-[10px] text-muted-foreground uppercase">VIP</span>
                          <div className="flex items-center gap-2 h-10">
                            <Switch
                              checked={project.is_vip}
                              onCheckedChange={v => updateField(project.id, 'is_vip', v)}
                            />
                            <Crown className={`w-4 h-4 ${project.is_vip ? 'text-amber-400' : 'text-muted-foreground/30'}`} />
                          </div>
                        </div>
                      </div>

                      {/* Actions row */}
                      <div className="flex items-center justify-end gap-2 pt-2">
                        <AdminAgreement projectId={project.id} projectName={project.name} />
                        <AdminPubAgreement projectId={project.id} />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4 mr-1" /> Radera
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
                  </motion.div>
                )}
              </AnimatePresence>
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
