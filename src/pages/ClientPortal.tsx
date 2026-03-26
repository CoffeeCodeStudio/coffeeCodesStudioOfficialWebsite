import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Coffee, LogOut, LayoutDashboard, MessageCirclePlus, Home, MessageCircle, History, Sparkles, Settings, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@/components/portal/ProjectStatus';
import { ClientRequests } from '@/components/portal/ClientRequests';
import { ClientMessages } from '@/components/portal/ClientMessages';
import { StatusLog } from '@/components/portal/StatusLog';
import { AIAssistant } from '@/components/portal/AIAssistant';
import { ClientSettings } from '@/components/portal/ClientSettings';
import { ClientAgreement } from '@/components/portal/ClientAgreement';
import type { User } from '@supabase/supabase-js';

type Tab = 'dashboard' | 'requests' | 'messages' | 'ai' | 'log' | 'settings';

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard; prominent?: boolean }[] = [
  { id: 'dashboard', label: 'Status', icon: LayoutDashboard, prominent: true },
  { id: 'requests', label: 'Önskemål', icon: MessageCirclePlus, prominent: true },
  { id: 'messages', label: 'Meddelanden', icon: MessageCircle, prominent: true },
  { id: 'ai', label: 'AI-hjälp', icon: Sparkles, prominent: true },
  { id: 'log', label: 'Aktivitet', icon: History, prominent: false },
  { id: 'settings', label: 'Inställningar', icon: Settings, prominent: false },
];

interface Profile {
  full_name: string | null;
  email: string | null;
}

export default function ClientPortal() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [projectStatus, setProjectStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [lastSeenMessages, setLastSeenMessages] = useState<string | null>(null);
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

  // Fetch profile for personalized welcome
  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  // Fetch the client's project ID for AI assistant
  useEffect(() => {
    if (!user) return;
    const fetchProjectId = async () => {
      const { data } = await supabase
        .from('projects')
        .select('id, name, status')
        .eq('client_user_id', user.id)
        .limit(1)
        .single();
      if (data) {
        setProjectId(data.id);
        setProjectName(data.name);
        setProjectStatus(data.status);
      }
    };
    fetchProjectId();
  }, [user]);

  // Load last seen timestamp and count unread admin messages
  useEffect(() => {
    if (!user) return;
    
    const stored = localStorage.getItem(`lastSeenMessages_${user.id}`);
    setLastSeenMessages(stored);

    const fetchUnread = async () => {
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .eq('client_user_id', user.id);
      
      if (!projects?.length) return;
      
      const projectIds = projects.map(p => p.id);
      
      let query = supabase
        .from('project_messages')
        .select('id', { count: 'exact', head: true })
        .in('project_id', projectIds)
        .eq('is_admin', true);
      
      if (stored) {
        query = query.gt('created_at', stored);
      }
      
      const { count } = await query;
      setUnreadMessages(count || 0);
    };

    fetchUnread();

    const channel = supabase
      .channel('client-unread-messages')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'project_messages',
        filter: 'is_admin=eq.true'
      }, () => {
        fetchUnread();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Mark messages as read when viewing messages tab
  useEffect(() => {
    if (activeTab === 'messages' && user) {
      const now = new Date().toISOString();
      localStorage.setItem(`lastSeenMessages_${user.id}`, now);
      setLastSeenMessages(now);
      setUnreadMessages(0);
    }
  }, [activeTab, user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name.split(' ')[0];
    if (user?.email) return user.email.split('@')[0];
    return 'kund';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const prominentTabs = tabs.filter(t => t.prominent);
  const secondaryTabs = tabs.filter(t => !t.prominent);

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
          {prominentTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const showBadge = tab.id === 'messages' && unreadMessages > 0;
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
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </Badge>
                )}
              </button>
            );
          })}

          {/* Secondary tabs - less prominent */}
          <div className="pt-4 mt-4 border-t border-border/20">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-4 mb-2">Övrigt</p>
            {secondaryTabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all ${
                    active
                      ? 'bg-muted/50 text-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
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
          {prominentTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const showBadge = tab.id === 'messages' && unreadMessages > 0;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  active ? 'bg-primary/15 text-primary border border-primary/20' : 'text-muted-foreground'
                }`}>
                <Icon className="w-3 h-3" />
                {tab.label}
                {showBadge && (
                  <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </button>
            );
          })}
          {secondaryTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                  active ? 'bg-muted/50 text-foreground' : 'text-muted-foreground/70'
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {projectId && projectStatus === 'questionnaire' ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 mb-6">
                <h2 className="text-lg font-serif text-foreground mb-2">
                  Välkommen, {getDisplayName()}!
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Nästa steg: Fyll i projektfrågorna så kan vi börja bygga din sajt.
                </p>
                <Button asChild>
                  <Link to="/projektfragor">
                    Fyll i projektfrågor
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="glass-card cyber-border p-6 rounded-2xl mb-6">
                <h2 className="text-lg font-serif text-foreground mb-2">
                  Välkommen, {getDisplayName()}.
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ditt projekt är igång — följ framstegen nedan och skicka önskemål direkt.
                </p>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'dashboard' && (
            <>
              {projectId && <ClientAgreement projectId={projectId} projectName={projectName} />}
              <div className="mt-6">
                <ProjectStatus />
              </div>
            </>
          )}
          {activeTab === 'requests' && <ClientRequests />}
          {activeTab === 'messages' && <ClientMessages />}
          {activeTab === 'ai' && projectId && <AIAssistant projectId={projectId} projectStatus={projectStatus} />}
          {activeTab === 'log' && <StatusLog />}
          {activeTab === 'settings' && <ClientSettings user={user} profile={profile} onProfileUpdate={setProfile} />}
        </motion.div>
      </main>
    </div>
  );
}
