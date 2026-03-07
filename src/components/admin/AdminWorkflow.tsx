import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ClipboardCheck, RotateCcw, MessageSquareText, ListChecks } from 'lucide-react';

const adminProcess = [
  'Skapa kundkonto i portalen',
  'Skicka välkomstmail med login och lösenord',
  'Vänta på ifyllt onboarding-formulär',
  'Boka digital kaffe (30 min samtal)',
  'Skicka offert och få godkännande',
  'Ta emot 50% betalning innan start',
  'Påbörja bygget',
  'Uppdatera projektstatus löpande',
  'Leverera och be kunden godkänna',
  'Ta emot resterande 50%',
  'Ge kunden begränsad access efter godkännande',
  'Erbjud underhållspaket',
];

const clientQuestions = [
  'Vad heter ditt företag och vad gör du?',
  'Vilken domän vill du ha?',
  'Har du en logotyp?',
  'Vilka färger och känsla vill du ha?',
  'Vilka sidor behöver du?',
  'Har du texter och bilder klara?',
  'Vem är din målgrupp?',
  'Finns det en sajt du gillar som inspiration?',
  'Vad är din deadline?',
  'Vad är din budget?',
];

interface Project { id: string; name: string; }

export function AdminWorkflow() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [adminChecked, setAdminChecked] = useState<boolean[]>(new Array(adminProcess.length).fill(false));
  const [questionsChecked, setQuestionsChecked] = useState<boolean[]>(new Array(clientQuestions.length).fill(false));
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from('projects').select('id, name').order('name').then(({ data }) => {
      const p = (data as Project[]) || [];
      setProjects(p);
    });
  }, []);

  useEffect(() => {
    if (!selectedProject) return;
    setLoading(true);
    supabase
      .from('workflow_checklists')
      .select('*')
      .eq('project_id', selectedProject)
      .then(({ data }) => {
        const items = (data as any[]) || [];
        const admin = new Array(adminProcess.length).fill(false);
        const questions = new Array(clientQuestions.length).fill(false);
        items.forEach(item => {
          if (item.checklist_type === 'admin_process' && item.item_index < admin.length) {
            admin[item.item_index] = item.checked;
          }
          if (item.checklist_type === 'client_questions' && item.item_index < questions.length) {
            questions[item.item_index] = item.checked;
          }
        });
        setAdminChecked(admin);
        setQuestionsChecked(questions);
        setLoading(false);
      });
  }, [selectedProject]);

  const toggleItem = async (type: 'admin_process' | 'client_questions', index: number) => {
    if (!selectedProject) return;
    const isAdmin = type === 'admin_process';
    const arr = isAdmin ? [...adminChecked] : [...questionsChecked];
    arr[index] = !arr[index];
    if (isAdmin) setAdminChecked(arr); else setQuestionsChecked(arr);

    await supabase.from('workflow_checklists').upsert({
      project_id: selectedProject,
      checklist_type: type,
      item_index: index,
      checked: arr[index],
    } as any, { onConflict: 'project_id,checklist_type,item_index' });
  };

  const resetChecklist = async (type: 'admin_process' | 'client_questions') => {
    if (!selectedProject) return;
    const len = type === 'admin_process' ? adminProcess.length : clientQuestions.length;
    if (type === 'admin_process') setAdminChecked(new Array(len).fill(false));
    else setQuestionsChecked(new Array(len).fill(false));

    await supabase.from('workflow_checklists')
      .delete()
      .eq('project_id', selectedProject)
      .eq('checklist_type', type);

    toast({ title: 'Checklista återställd' });
  };

  const renderChecklist = (
    title: string,
    icon: typeof ListChecks,
    items: string[],
    checked: boolean[],
    type: 'admin_process' | 'client_questions'
  ) => {
    const Icon = icon;
    const done = checked.filter(Boolean).length;
    const pct = Math.round((done / items.length) * 100);

    return (
      <div className="glass-card cyber-border rounded-2xl p-6 flex-1 min-w-[320px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            <h3 className="font-serif text-foreground">{title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={() => resetChecklist(type)}
            className="text-muted-foreground hover:text-destructive text-xs gap-1"
            disabled={!selectedProject}>
            <RotateCcw className="w-3 h-3" /> Nollställ
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-1.5 rounded-full bg-muted/50 overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">{done}/{items.length}</span>
        </div>

        <div className="space-y-1">
          {items.map((item, i) => (
            <motion.button
              key={i}
              onClick={() => toggleItem(type, i)}
              disabled={!selectedProject}
              className={`w-full flex items-start gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                checked[i]
                  ? 'bg-primary/10 text-muted-foreground line-through'
                  : 'hover:bg-muted/30 text-foreground'
              }`}
              initial={false}
              animate={{ opacity: checked[i] ? 0.6 : 1 }}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                checked[i]
                  ? 'bg-primary border-primary'
                  : 'border-border/50'
              }`}>
                {checked[i] && (
                  <svg className="w-3 h-3 text-primary-foreground" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 6l3 3 5-5" />
                  </svg>
                )}
              </div>
              <span>{i + 1}. {item}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Arbetsflöde</h2>

      <div className="max-w-xs">
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="bg-muted/50 border-border/50">
            <SelectValue placeholder="Välj kund/projekt" />
          </SelectTrigger>
          <SelectContent>
            {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {!selectedProject ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <ClipboardCheck className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Välj ett projekt ovan för att se checklistorna.</p>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {renderChecklist('Min process (Admin)', ListChecks, adminProcess, adminChecked, 'admin_process')}
          {renderChecklist('Frågor att ställa kunden', MessageSquareText, clientQuestions, questionsChecked, 'client_questions')}
        </div>
      )}
    </div>
  );
}
