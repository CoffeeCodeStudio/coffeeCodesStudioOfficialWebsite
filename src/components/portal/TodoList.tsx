import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Circle } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
  project_id: string;
}

interface Project {
  id: string;
  name: string;
}

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('project_todos').select('*').order('completed').order('created_at', { ascending: false }),
      supabase.from('projects').select('id, name'),
    ]).then(([todosRes, projRes]) => {
      setTodos((todosRes.data as Todo[]) || []);
      const map: Record<string, string> = {};
      ((projRes.data as Project[]) || []).forEach(p => { map[p.id] = p.name; });
      setProjects(map);
      setLoading(false);
    });
  }, []);

  const toggleTodo = async (todo: Todo) => {
    const { error } = await supabase
      .from('project_todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id);

    if (!error) {
      setTodos(prev =>
        prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
      );
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  const pending = todos.filter(t => !t.completed);
  const done = todos.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif gradient-text">Att göra</h2>

      {todos.length === 0 ? (
        <div className="glass-card p-12 rounded-2xl text-center">
          <CheckSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Inga uppgifter ännu.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending */}
          {pending.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Att göra ({pending.length})
              </p>
              {pending.map((todo, i) => (
                <motion.button
                  key={todo.id}
                  onClick={() => toggleTodo(todo)}
                  className="glass-card w-full flex items-center gap-4 p-4 rounded-xl text-left hover:bg-muted/30 transition-colors group"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="w-5 h-5 rounded border-2 border-primary/40 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                    <Circle className="w-0 h-0 group-hover:w-2 group-hover:h-2 text-primary transition-all" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground">{todo.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{projects[todo.project_id] || 'Projekt'}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Done */}
          {done.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Klart ({done.length})
              </p>
              {done.map((todo, i) => (
                <motion.button
                  key={todo.id}
                  onClick={() => toggleTodo(todo)}
                  className="glass-card w-full flex items-center gap-4 p-4 rounded-xl text-left opacity-50 hover:opacity-70 transition-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <CheckSquare className="w-3 h-3 text-accent" />
                  </div>
                  <p className="text-sm text-foreground line-through">{todo.title}</p>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
