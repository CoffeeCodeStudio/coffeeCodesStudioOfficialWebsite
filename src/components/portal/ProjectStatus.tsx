import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Paintbrush, Code2, HardDrive, Rocket, CheckCircle2, ChevronDown, Upload, CheckSquare, Square, Circle, FileArchive, Download, Calendar, Image, FileText, Mail, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FilePreviewModal } from '@/components/portal/FilePreviewModal';

interface Project {
  id: string;
  name: string;
  status: string;
  description: string | null;
  created_at: string;
}

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  project_id: string;
}

interface ProjectFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  created_at: string;
  project_id: string;
}

const statusSteps = [
  { key: 'design', label: 'Design', icon: Paintbrush },
  { key: 'development', label: 'Utveckling', icon: Code2 },
  { key: 'testing', label: 'Testning', icon: HardDrive },
  { key: 'live', label: 'Live', icon: Rocket },
  { key: 'completed', label: 'Klart', icon: CheckCircle2 },
];

const requestTimeline = [
  { key: 'pending', label: 'Inkommen' },
  { key: 'reviewing', label: 'Granskas' },
  { key: 'in_progress', label: 'Pågår' },
  { key: 'review_ready', label: 'Klar för granskning' },
  { key: 'delivered', label: 'Levererad' },
];

interface ClientRequest {
  id: string;
  message: string;
  status: string;
  category: string;
  priority: string;
  created_at: string;
  project_id: string;
}

export function ProjectStatus() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [filesOpen, setFilesOpen] = useState(false);
  const [todosOpen, setTodosOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('client_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('project_todos').select('*').order('completed').order('created_at', { ascending: false }),
      supabase.from('project_files').select('*').order('created_at', { ascending: false }),
    ]).then(([projRes, reqRes, todosRes, filesRes]) => {
      setProjects((projRes.data as Project[]) || []);
      setRequests((reqRes.data as ClientRequest[]) || []);
      setTodos((todosRes.data as Todo[]) || []);
      setFiles((filesRes.data as ProjectFile[]) || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('portal-projects-realtime')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'projects' }, (payload) => {
        setProjects(prev => prev.map(p => p.id === (payload.new as Project).id ? { ...p, ...payload.new as Project } : p));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'client_requests' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setRequests(prev => [payload.new as ClientRequest, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setRequests(prev => prev.map(r => r.id === (payload.new as ClientRequest).id ? payload.new as ClientRequest : r));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_todos' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTodos(prev => [payload.new as Todo, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setTodos(prev => prev.map(t => t.id === (payload.new as Todo).id ? payload.new as Todo : t));
        } else if (payload.eventType === 'DELETE') {
          setTodos(prev => prev.filter(t => t.id !== (payload.old as any).id));
        }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'project_files' }, (payload) => {
        setFiles(prev => [payload.new as ProjectFile, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const approveDelivery = async (requestId: string, projectId: string) => {
    setApprovingId(requestId);
    
    const { error: updateError } = await supabase
      .from('client_requests')
      .update({ status: 'delivered' })
      .eq('id', requestId);

    if (updateError) {
      toast({ title: 'Fel', description: updateError.message, variant: 'destructive' });
      setApprovingId(null);
      return;
    }

    // Log the approval
    await supabase.from('status_logs').insert({
      project_id: projectId,
      message: 'Kunden godkände leveransen',
      author_name: 'Kund',
      event_type: 'status_change',
    });

    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'delivered' } : r));
    toast({ title: 'Leverans godkänd!', description: 'Tack för din feedback.' });
    setApprovingId(null);
  };

  const toggleTodo = async (todo: Todo) => {
    const { error } = await supabase
      .from('project_todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id);

    if (!error) {
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
    }
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

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (projects.length === 0) {
    return (
      <div className="glass-card p-12 rounded-2xl text-center">
        <Rocket className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">Inga projekt ännu.</p>
        <Button
          variant="outline"
          className="border-primary/30 text-primary"
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              window.location.href = '/#contact';
            } else {
              window.location.href = '/#contact';
            }
          }}
        >
          <Mail className="w-4 h-4 mr-2" />
          Kontakta oss för att komma igång
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {projects.map((project, pi) => {
        const currentIndex = statusSteps.findIndex(s => s.key === project.status);
        const progressPercent = currentIndex >= 0 ? ((currentIndex + 1) / statusSteps.length) * 100 : 0;
        const projectRequests = requests.filter(r => r.project_id === project.id && r.status !== 'delivered' && r.status !== 'cancelled');
        const reviewReadyRequests = projectRequests.filter(r => r.status === 'review_ready');
        const projectTodos = todos.filter(t => t.project_id === project.id);
        const projectFiles = files.filter(f => f.project_id === project.id);
        const pendingTodos = projectTodos.filter(t => !t.completed);
        const completedTodos = projectTodos.filter(t => t.completed);

        return (
          <motion.div
            key={project.id}
            className="glass-card cyber-border p-6 md:p-8 rounded-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pi * 0.1 }}
          >
            <div className="mb-6">
              <h3 className="text-xl font-serif text-foreground">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Framsteg</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="h-2 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Progress steps */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {statusSteps.map((step, i) => {
                const Icon = step.icon;
                const isDone = i <= currentIndex;
                const isCurrent = i === currentIndex;
                return (
                  <div key={step.key} className="flex items-center gap-2 flex-shrink-0">
                    <motion.div
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-primary/20 text-primary border border-primary/30 shadow-lg shadow-primary/10'
                          : isDone
                          ? 'bg-accent/10 text-accent border border-accent/20'
                          : 'bg-muted/30 text-muted-foreground border border-border/30'
                      }`}
                      animate={isCurrent ? { scale: [1, 1.03, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{step.label}</span>
                    </motion.div>
                    {i < statusSteps.length - 1 && (
                      <div className={`w-6 h-0.5 ${isDone ? 'bg-accent/50' : 'bg-border/30'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Approve delivery banner */}
            {reviewReadyRequests.length > 0 && (
              <motion.div
                className="mt-6 p-4 rounded-xl bg-accent/10 border border-accent/30"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-accent" />
                      {reviewReadyRequests.length === 1 ? 'En leverans väntar på ditt godkännande' : `${reviewReadyRequests.length} leveranser väntar på ditt godkännande`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Granska resultatet och godkänn när du är nöjd.</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {reviewReadyRequests.map(req => (
                    <div key={req.id} className="flex items-center justify-between gap-3 bg-background/50 rounded-lg p-3">
                      <p className="text-xs text-foreground line-clamp-1 flex-1">{req.message}</p>
                      <Button
                        size="sm"
                        onClick={() => approveDelivery(req.id, req.project_id)}
                        disabled={approvingId === req.id}
                        className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        {approvingId === req.id ? 'Godkänner...' : 'Godkänn leverans'}
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Active request timelines */}
            {projectRequests.filter(r => r.status !== 'review_ready').length > 0 && (
              <div className="mt-6 pt-6 border-t border-border/20">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-4">
                  Aktiva ärenden ({projectRequests.filter(r => r.status !== 'review_ready').length})
                </p>
                <div className="space-y-3">
                  {projectRequests.filter(r => r.status !== 'review_ready').slice(0, 5).map(req => {
                    const reqIndex = requestTimeline.findIndex(s => s.key === req.status);
                    return (
                      <div key={req.id} className="bg-muted/20 rounded-lg p-3">
                        <p className="text-xs text-foreground mb-2 line-clamp-1">{req.message}</p>
                        <div className="flex items-center gap-1">
                          {requestTimeline.map((step, si) => {
                            const isDone = si <= reqIndex;
                            const isCurrent = si === reqIndex;
                            return (
                              <div key={step.key} className="flex items-center gap-1 flex-1">
                                <div className={`h-1.5 flex-1 rounded-full transition-all ${
                                  isCurrent ? 'bg-primary' : isDone ? 'bg-accent/60' : 'bg-border/30'
                                }`} />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[9px] text-muted-foreground">{requestTimeline[0].label}</span>
                          <span className={`text-[9px] font-medium ${reqIndex >= 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                            {requestTimeline[reqIndex]?.label || 'Inkommen'}
                          </span>
                          <span className="text-[9px] text-muted-foreground">{requestTimeline[requestTimeline.length - 1].label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Collapsible sections for Files and Todos */}
            <div className="mt-6 pt-6 border-t border-border/20 space-y-3">
              {/* Files collapsible */}
              <Collapsible open={filesOpen} onOpenChange={setFilesOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Upload className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Filer</span>
                    <span className="text-xs text-muted-foreground">({projectFiles.length})</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${filesOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-2 pl-2">
                    {projectFiles.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-3 text-center">Inga filer ännu.</p>
                    ) : (
                      projectFiles.slice(0, 5).map(file => {
                        const FileIcon = getFileIcon(file.file_name);
                        return (
                          <div key={file.id} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-muted/10">
                            <div className="flex items-center gap-3 min-w-0">
                              <FileIcon className="w-4 h-4 text-primary shrink-0" />
                              <div className="min-w-0">
                                <p className="text-xs text-foreground truncate">{file.file_name}</p>
                                <p className="text-[10px] text-muted-foreground">{formatSize(file.file_size)}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDownload(file)} className="h-7 w-7 text-primary hover:bg-primary/10 shrink-0">
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Todos collapsible */}
              <Collapsible open={todosOpen} onOpenChange={setTodosOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors group">
                  <div className="flex items-center gap-3">
                    <CheckSquare className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Uppgifter</span>
                    <span className="text-xs text-muted-foreground">({pendingTodos.length} kvar)</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${todosOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 space-y-1 pl-2">
                    {projectTodos.length === 0 ? (
                      <p className="text-xs text-muted-foreground py-3 text-center">Inga uppgifter ännu.</p>
                    ) : (
                      <>
                        {pendingTodos.slice(0, 5).map(todo => (
                          <button
                            key={todo.id}
                            onClick={() => toggleTodo(todo)}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors text-left group"
                          >
                            <div className="w-4 h-4 rounded border border-primary/40 flex items-center justify-center shrink-0 group-hover:border-primary">
                              <Circle className="w-0 h-0 group-hover:w-1.5 group-hover:h-1.5 text-primary transition-all" />
                            </div>
                            <span className="text-xs text-foreground">{todo.title}</span>
                          </button>
                        ))}
                        {completedTodos.slice(0, 3).map(todo => (
                          <button
                            key={todo.id}
                            onClick={() => toggleTodo(todo)}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20 transition-colors text-left opacity-50"
                          >
                            <div className="w-4 h-4 rounded bg-accent/20 flex items-center justify-center shrink-0">
                              <CheckSquare className="w-2.5 h-2.5 text-accent" />
                            </div>
                            <span className="text-xs text-foreground line-through">{todo.title}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
