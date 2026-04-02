import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { motion } from 'framer-motion';
import { Shield, LogOut, Users, FolderKanban, FileUp, MessageSquarePlus, ListTodo, StickyNote, MessageCirclePlus, Home, BarChart3, MessageCircle, ClipboardCheck, UserCog, Palette, BellRing } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminOnboarding } from '@/components/admin/AdminOnboarding';
import { AdminProjects } from '@/components/admin/AdminProjects';
import { AdminFileUpload } from '@/components/admin/AdminFileUpload';
import { AdminStatusLog } from '@/components/admin/AdminStatusLog';
import { AdminTodos } from '@/components/admin/AdminTodos';
import { AdminNotes } from '@/components/admin/AdminNotes';
import { AdminClientRequests } from '@/components/admin/AdminClientRequests';
import { AdminMessages } from '@/components/admin/AdminMessages';
import { AdminWorkflow } from '@/components/admin/AdminWorkflow';
import { AdminClients } from '@/components/admin/AdminClients';
import { AdminPortfolio } from '@/components/admin/AdminPortfolio';
import { NotificationBell } from '@/components/admin/NotificationBell';
import { AdminNotificationSettings } from '@/components/admin/AdminNotificationSettings';

type Tab = 'overview' | 'onboarding' | 'projects' | 'requests' | 'messages' | 'workflow' | 'files' | 'logs' | 'todos' | 'notes' | 'clients' | 'portfolio' | 'notifications';

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: 'overview', label: 'Översikt', icon: BarChart3 },
  { id: 'requests', label: 'Ärenden', icon: MessageCirclePlus },
  { id: 'messages', label: 'Meddelanden', icon: MessageCircle },
  { id: 'projects', label: 'Projekt', icon: FolderKanban },
  { id: 'workflow', label: 'Arbetsflöde', icon: ClipboardCheck },
  { id: 'todos', label: 'Att göra', icon: ListTodo },
  { id: 'onboarding', label: 'Ny kund', icon: Users },
  { id: 'files', label: 'Filer', icon: FileUp },
  { id: 'logs', label: 'Statuslogg', icon: MessageSquarePlus },
  { id: 'notes', label: 'Anteckningar', icon: StickyNote },
  { id: 'clients', label: 'Konton', icon: UserCog },
  { id: 'portfolio', label: 'Portfölj', icon: Palette },
  { id: 'notifications', label: 'Notifieringar', icon: BellRing },
];

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [pendingRequests, setPendingRequests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  // Fetch and subscribe to pending requests count
  useEffect(() => {
    if (!isAdmin) return;

    const fetchPending = async () => {
      const { count } = await supabase
        .from('client_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');
      setPendingRequests(count || 0);
    };

    fetchPending();

    const channel = supabase
      .channel('admin-pending-requests')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'client_requests'
      }, () => {
        fetchPending();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAdmin]);

  // Unread client messages for admin
  useEffect(() => {
    if (!isAdmin || !user) return;

    const storageKey = `admin_lastSeenMessages_${user.id}`;
    const lastSeen = localStorage.getItem(storageKey);

    const fetchUnread = async () => {
      let query = supabase
        .from('project_messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_admin', false);
      if (lastSeen) query = query.gt('created_at', lastSeen);
      const { count } = await query;
      setUnreadMessages(count || 0);
    };

    fetchUnread();

    const channel = supabase
      .channel('admin-unread-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'project_messages',
        filter: 'is_admin=eq.false',
      }, () => fetchUnread())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [isAdmin, user]);

  // Mark messages as read when viewing messages tab
  useEffect(() => {
    if (activeTab === 'messages' && user) {
      const now = new Date().toISOString();
      localStorage.setItem(`admin_lastSeenMessages_${user.id}`, now);
      setUnreadMessages(0);
    }
  }, [activeTab, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleNotificationNavigate = (tab: string) => {
    setActiveTab(tab as Tab);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 glass-card border-r border-border/50 z-50 hidden md:flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-serif text-sm text-foreground">Admin Panel</p>
              <p className="text-[10px] text-muted-foreground truncate max-w-[110px]">{user.email}</p>
            </div>
          </div>
          <NotificationBell onNavigate={handleNotificationNavigate} />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const showBadge = (tab.id === 'requests' && pendingRequests > 0) || (tab.id === 'messages' && unreadMessages > 0);
            const badgeCount = tab.id === 'requests' ? pendingRequests : tab.id === 'messages' ? unreadMessages : 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all ${
                  active
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </span>
                {showBadge && (
                  <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-[10px]">
                    {badgeCount > 9 ? '9+' : badgeCount}
                  </Badge>
                )}
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
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-serif text-sm">Admin</span>
          </div>
          <div className="flex items-center gap-1">
            <NotificationBell onNavigate={handleNotificationNavigate} />
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
            const showBadge = tab.id === 'requests' && pendingRequests > 0;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  active ? 'bg-primary/15 text-primary border border-primary/20' : 'text-muted-foreground'
                }`}>
                <Icon className="w-3 h-3" />
                {tab.label}
                {showBadge && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center">
                    {pendingRequests > 9 ? '9+' : pendingRequests}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      <main className="md:ml-64 pt-28 md:pt-8 p-6 md:p-10">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'overview' && <AdminOverview onNavigate={(tab) => setActiveTab(tab as Tab)} />}
          {activeTab === 'onboarding' && <AdminOnboarding />}
          {activeTab === 'projects' && <AdminProjects />}
          {activeTab === 'requests' && <AdminClientRequests />}
          {activeTab === 'messages' && <AdminMessages />}
          {activeTab === 'workflow' && <AdminWorkflow />}
          {activeTab === 'files' && <AdminFileUpload />}
          {activeTab === 'logs' && <AdminStatusLog />}
          {activeTab === 'todos' && <AdminTodos />}
          {activeTab === 'notes' && <AdminNotes />}
          {activeTab === 'clients' && <AdminClients />}
          {activeTab === 'portfolio' && <AdminPortfolio />}
          {activeTab === 'notifications' && user && <AdminNotificationSettings user={user} />}
        </motion.div>
      </main>
    </div>
  );
}
