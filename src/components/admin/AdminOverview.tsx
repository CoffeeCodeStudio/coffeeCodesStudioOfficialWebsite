import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Users, AlertTriangle, Flame, CalendarClock, Package, BarChart3, Clock, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  name: string;
  status: string;
  package: string;
  monthly_quota: number;
  renewal_date: string | null;
  client_user_id: string;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface ClientRequest {
  id: string;
  project_id: string;
  status: string;
  priority: string;
  created_at: string;
}

interface ChecklistRow {
  project_id: string;
  item_key: string;
  checked: boolean;
}

const packageLabels: Record<string, string> = { bas: 'Bas', standard: 'Standard', premium: 'Premium' };
const packageColors: Record<string, string> = {
  bas: 'bg-muted/50 text-muted-foreground',
  standard: 'bg-primary/10 text-primary',
  premium: 'bg-accent/10 text-accent',
};

const packages = [
  { value: 'bas', label: 'Bas', quota: 3 },
  { value: 'standard', label: 'Standard', quota: 5 },
  { value: 'premium', label: 'Premium', quota: 10 },
];

export function AdminOverview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const updatePackage = async (projectId: string, newPackage: string) => {
    const pkg = packages.find(p => p.value === newPackage);
    const { error } = await supabase.from('projects').update({
      package: newPackage,
      monthly_quota: pkg?.quota ?? 3,
    }).eq('id', projectId);
    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, package: newPackage, monthly_quota: pkg?.quota ?? 3 } : p));
      toast({ title: 'Paket uppdaterat', description: `Ändrat till ${pkg?.label}` });
    }
  };

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('profiles').select('*'),
      supabase.from('client_requests').select('*').order('created_at', { ascending: false }),
    ]).then(([projRes, profRes, reqRes]) => {
      setProjects((projRes.data as Project[]) || []);
      const map: Record<string, Profile> = {};
      ((profRes.data as Profile[]) || []).forEach(p => { map[p.id] = p; });
      setProfiles(map);
      setRequests((reqRes.data as ClientRequest[]) || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Urgent items this week
  const urgentRequests = requests.filter(r => r.priority === 'urgent' && r.status !== 'delivered');
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const renewingSoon = projects.filter(p => p.renewal_date && new Date(p.renewal_date) <= weekFromNow && new Date(p.renewal_date) >= now);
  const questionnaireOverdue = projects.filter(p => 
    p.status === 'questionnaire' && (now.getTime() - new Date(p.created_at).getTime()) > 24 * 60 * 60 * 1000
  );
  // Stats
  const activeProjects = projects.filter(p => p.status !== 'completed');
  const uniqueClients = new Set(projects.map(p => p.client_user_id)).size;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-serif gradient-text">Översikt</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Aktiva kunder', value: uniqueClients, icon: Users, color: 'text-primary' },
          { label: 'Aktiva projekt', value: activeProjects.length, icon: Package, color: 'text-secondary' },
          { label: 'Väntande ärenden', value: pendingRequests.length, icon: BarChart3, color: 'text-accent' },
          { label: 'Brådskande', value: urgentRequests.length, icon: Flame, color: 'text-destructive' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="glass-card cyber-border p-5 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Icon className={`w-5 h-5 ${stat.color} mb-2`} />
              <p className="text-2xl font-serif text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Urgent this week */}
      {(urgentRequests.length > 0 || renewingSoon.length > 0 || questionnaireOverdue.length > 0) && (
        <div className="glass-card cyber-border p-6 rounded-2xl border-destructive/20">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <h3 className="font-serif text-foreground">Brådskande denna vecka</h3>
          </div>
          <div className="space-y-2">
            {urgentRequests.map(req => {
              const proj = projects.find(p => p.id === req.project_id);
              return (
                <div key={req.id} className="flex items-center gap-3 p-3 bg-destructive/5 rounded-lg">
                  <Flame className="w-4 h-4 text-destructive flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{proj?.name || 'Projekt'}</p>
                    <p className="text-xs text-muted-foreground">Brådskande ärende väntar</p>
                  </div>
                </div>
              );
            })}
            {renewingSoon.map(proj => (
              <div key={proj.id} className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
                <CalendarClock className="w-4 h-4 text-secondary flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{proj.name}</p>
                  <p className="text-xs text-muted-foreground">Förnyas {proj.renewal_date}</p>
                </div>
              </div>
            ))}
            {questionnaireOverdue.map(proj => (
              <div key={`q-${proj.id}`} className="flex items-center gap-3 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20">
                <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{proj.name}</p>
                  <p className="text-xs text-muted-foreground">Väntar på svar på projektfrågor i mer än 24h</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Client table */}
      <div className="glass-card cyber-border p-6 rounded-2xl">
        <h3 className="font-serif text-foreground mb-4">Kunder & paket</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/30">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Kund</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Projekt</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Paket</th>
                <th className="text-center py-3 px-4 text-muted-foreground font-medium">Ärenden kvar</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Förnyas</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(proj => {
                const profile = profiles[proj.client_user_id];
                const monthlyUsed = requests.filter(r =>
                  r.project_id === proj.id && new Date(r.created_at) >= monthStart
                ).length;
                const remaining = Math.max(0, proj.monthly_quota - monthlyUsed);

                return (
                  <tr key={proj.id} className="border-b border-border/10 hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="text-foreground">{profile?.full_name || profile?.email || '—'}</p>
                      <p className="text-[10px] text-muted-foreground">{profile?.email}</p>
                    </td>
                    <td className="py-3 px-4 text-foreground">{proj.name}</td>
                    <td className="py-3 px-4">
                      <Select value={proj.package} onValueChange={v => updatePackage(proj.id, v)}>
                        <SelectTrigger className={`h-8 w-28 text-xs border-0 ${packageColors[proj.package] || packageColors.bas}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {packages.map(p => (
                            <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono text-sm ${remaining === 0 ? 'text-destructive' : 'text-foreground'}`}>
                        {remaining} / {proj.monthly_quota}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs">
                      {proj.renewal_date || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{proj.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
