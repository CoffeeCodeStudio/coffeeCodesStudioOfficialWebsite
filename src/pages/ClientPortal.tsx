import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Coffee, LogOut, LayoutDashboard, Upload, MessageSquare, CheckSquare, MessageCirclePlus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProjectStatus } from '@/components/portal/ProjectStatus';
import { ClientFileUpload } from '@/components/portal/ClientFileUpload';
import { StatusLog } from '@/components/portal/StatusLog';
import { TodoList } from '@/components/portal/TodoList';
import { ClientRequests } from '@/components/portal/ClientRequests';
import type { User } from '@supabase/supabase-js';

type Tab = 'dashboard' | 'requests' | 'files' | 'log' | 'todos';

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Status', icon: LayoutDashboard },
  { id: 'requests', label: 'Önskemål', icon: MessageCirclePlus },
  { id: 'files', label: 'Filer', icon: Upload },
  { id: 'log', label: 'Aktivitet', icon: MessageSquare },
  { id: 'todos', label: 'Uppgifter', icon: CheckSquare },
];

export default function ClientPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate('/portal/login');
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate('/portal/login');
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass-card border-r border-border/50 z-50 hidden md:flex flex-col">
        <div className="flex items-center gap-3 p-6 border-b border-border/30">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Coffee className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-serif text-sm text-foreground">Kundportal</p>
            <p className="text-[10px] text-muted-foreground truncate max-w-[140px]">{user.email}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/30 space-y-1">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}
            className="w-full justify-start text-muted-foreground hover:text-foreground">
            <Home className="w-4 h-4 mr-2" />
            Tillbaka till hemsidan
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}
            className="w-full justify-start text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Logga ut
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="w-5 h-5 text-primary" />
            <span className="font-serif text-sm">Kundportal</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <Home className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  active ? 'bg-primary/15 text-primary border border-primary/20' : 'text-muted-foreground'
                }`}>
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main */}
      <main className="md:ml-64 pt-28 md:pt-8 p-6 md:p-10">
        {/* Welcome banner on dashboard */}
        {activeTab === 'dashboard' && (
          <motion.div
            className="glass-card cyber-border p-6 rounded-2xl mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-lg font-serif text-foreground mb-2">Välkommen till din projektportal</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Här ser du alltid aktuell status på ditt projekt. Vi använder AI för att bygga din lösning effektivt — det betyder snabbare uppdateringar och färre buggar. Skicka önskemål, ladda upp material och följ framstegen i realtid.
            </p>
          </motion.div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && <ProjectStatus />}
          {activeTab === 'requests' && <ClientRequests />}
          {activeTab === 'files' && <ClientFileUpload />}
          {activeTab === 'log' && <StatusLog />}
          {activeTab === 'todos' && <TodoList />}
        </motion.div>
      </main>
    </div>
  );
}
