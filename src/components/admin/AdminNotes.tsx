import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save, StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  name: string;
  price: number | null;
  status: string;
  client_user_id: string;
}

interface AdminData {
  project_id: string;
  admin_notes: string | null;
}

export function AdminNotes() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [adminDataMap, setAdminDataMap] = useState<Record<string, string>>({});
  const [selectedProject, setSelectedProject] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id, name, price, status, client_user_id').order('name'),
      supabase.from('project_admin_data').select('project_id, admin_notes'),
    ]).then(([projRes, adminRes]) => {
      setProjects((projRes.data as Project[]) || []);
      const map: Record<string, string> = {};
      ((adminRes.data as AdminData[]) || []).forEach(d => {
        map[d.project_id] = d.admin_notes || '';
      });
      setAdminDataMap(map);
    });
  }, []);

  useEffect(() => {
    setNotes(adminDataMap[selectedProject] || '');
  }, [selectedProject, adminDataMap]);

  const handleSave = async () => {
    if (!selectedProject) return;
    setSaving(true);
    
    // Upsert into project_admin_data
    const { error } = await supabase.from('project_admin_data' as any)
      .upsert({ project_id: selectedProject, admin_notes: notes } as any, { onConflict: 'project_id' });
    
    setSaving(false);
    if (error) {
      toast({ title: 'Fel', description: 'Kunde inte spara anteckningar.', variant: 'destructive' });
    } else {
      setAdminDataMap(prev => ({ ...prev, [selectedProject]: notes }));
      toast({ title: 'Anteckningar sparade!' });
    }
  };

  // Price overview table
  const projectsWithPrice = projects.filter(p => p.price !== null);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif gradient-text">Anteckningar & priser</h2>

      {/* Notes editor */}
      <div className="glass-card cyber-border p-6 rounded-2xl space-y-4">
        <div className="flex items-center gap-3">
          <StickyNote className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-foreground">Projektanteckningar</h3>
        </div>

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

        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Interna anteckningar om projektet..."
              className="bg-muted/50 border-border/50 min-h-[200px] font-mono text-sm"
            />
            <Button onClick={handleSave} disabled={saving} className="glow-button bg-primary text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Sparar...' : 'Spara'}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Price overview */}
      <div className="glass-card cyber-border p-6 rounded-2xl space-y-4">
        <h3 className="font-serif text-foreground">Prisöversikt</h3>
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground">Inga projekt att visa.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Projekt</th>
                  <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-muted-foreground font-medium">Pris (SEK)</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} className="border-b border-border/10">
                    <td className="py-3 px-4 text-foreground">{p.name}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{p.status}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground font-mono">
                      {p.price ? `${p.price.toLocaleString('sv-SE')} kr` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
              {projectsWithPrice.length > 0 && (
                <tfoot>
                  <tr className="border-t border-primary/20">
                    <td colSpan={2} className="py-3 px-4 text-primary font-medium">Totalt</td>
                    <td className="py-3 px-4 text-right text-primary font-mono font-medium">
                      {projectsWithPrice.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString('sv-SE')} kr
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
