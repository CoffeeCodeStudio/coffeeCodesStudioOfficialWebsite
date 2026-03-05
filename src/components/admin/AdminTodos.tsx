import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

interface Project { id: string; name: string; }
interface Todo { id: string; title: string; completed: boolean; project_id: string; created_at: string; }

export function AdminTodos() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [title, setTitle] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    Promise.all([
      supabase.from('projects').select('id, name').order('name'),
      supabase.from('project_todos').select('*').order('completed').order('created_at', { ascending: false }),
    ]).then(([pRes, tRes]) => {
      setProjects((pRes.data as Project[]) || []);
      setTodos((tRes.data as Todo[]) || []);
    });
  }, []);

  const handleAdd = async () => {
    if (!title.trim() || !selectedProject) return;
    const { data, error } = await supabase.from('project_todos').insert({
      project_id: selectedProject,
      title: title.trim(),
    }).select().single();

    if (error) {
      toast({ title: 'Fel', description: error.message, variant: 'destructive' });
    } else {
      setTodos(prev => [data as Todo, ...prev]);
      setTitle('');
    }
  };

  const toggleTodo = async (todo: Todo) => {
    await supabase.from('project_todos').update({ completed: !todo.completed }).eq('id', todo.id);
    setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = async (id: string) => {
    await supabase.from('project_todos').delete().eq('id', id);
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p.name]));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Kundens att-göra</h2>

      <div className="glass-card cyber-border p-6 rounded-2xl space-y-4">
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

        <div className="flex gap-2">
          <Input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Ny uppgift..." className="bg-muted/50 border-border/50"
            onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <Button onClick={handleAdd} disabled={!title.trim() || !selectedProject}
            className="glow-button bg-primary text-primary-foreground">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {todos.map((todo, i) => (
          <motion.div
            key={todo.id}
            className={`glass-card p-4 rounded-xl flex items-center justify-between gap-4 ${todo.completed ? 'opacity-50' : ''}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: todo.completed ? 0.5 : 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <button onClick={() => toggleTodo(todo)} className="flex items-center gap-3 min-w-0">
              {todo.completed ? <CheckSquare className="w-4 h-4 text-accent" /> : <Square className="w-4 h-4 text-muted-foreground" />}
              <div className="text-left min-w-0">
                <p className={`text-sm ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{todo.title}</p>
                <p className="text-[10px] text-muted-foreground">{projectMap[todo.project_id] || 'Projekt'}</p>
              </div>
            </button>
            <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} className="text-destructive hover:bg-destructive/10 flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
