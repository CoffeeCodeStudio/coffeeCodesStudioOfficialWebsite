import { useEffect, useState, useRef, useCallback, type CSSProperties } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell, MessageCircle, MessageCirclePlus, FileUp, Check, CheckCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Notification {
  id: string;
  source_table: string;
  source_id: string;
  project_id: string;
  preview: string;
  is_read: boolean;
  created_at: string;
}

const sourceIcons: Record<string, typeof Bell> = {
  project_messages: MessageCircle,
  client_requests: MessageCirclePlus,
  project_files: FileUp,
};

const sourceLabels: Record<string, string> = {
  project_messages: 'Meddelande',
  client_requests: 'Ärende',
  project_files: 'Fil',
};

interface NotificationBellProps {
  onNavigate?: (tab: string, projectId?: string) => void;
}

export function NotificationBell({ onNavigate }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [projectNames, setProjectNames] = useState<Record<string, string>>({});
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const updatePanelPosition = useCallback(() => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportPadding = 8;
    const desiredWidth = Math.min(384, viewportWidth - viewportPadding * 2);
    const left = Math.min(
      Math.max(triggerRect.right - desiredWidth, viewportPadding),
      viewportWidth - desiredWidth - viewportPadding,
    );
    const availableHeight = viewportHeight - triggerRect.bottom - 16;

    setPanelStyle({
      width: desiredWidth,
      left,
      top: triggerRect.bottom + 8,
      maxHeight: Math.max(240, Math.min(448, availableHeight)),
    });
  }, []);

  // Fetch notifications and project names
  useEffect(() => {
    const fetchData = async () => {
      const [notifRes, projRes] = await Promise.all([
        supabase
          .from('admin_notifications')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase.from('projects').select('id, name'),
      ]);
      setNotifications((notifRes.data as Notification[]) || []);
      const map: Record<string, string> = {};
      (projRes.data || []).forEach((p: any) => { map[p.id] = p.name; });
      setProjectNames(map);
    };
    fetchData();
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('admin-notifications-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_notifications',
      }, (payload) => {
        setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 50));
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'admin_notifications',
      }, (payload) => {
        setNotifications(prev =>
          prev.map(n => n.id === (payload.new as Notification).id ? payload.new as Notification : n)
        );
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from('admin_notifications').update({ is_read: true }).eq('id', id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
    if (unreadIds.length === 0) return;
    await supabase.from('admin_notifications').update({ is_read: true }).in('id', unreadIds);
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleClick = (n: Notification) => {
    markAsRead(n.id);
    if (onNavigate) {
      const tabMap: Record<string, string> = {
        project_messages: 'messages',
        client_requests: 'requests',
        project_files: 'files',
      };
      onNavigate(tabMap[n.source_table] || 'overview', n.project_id);
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[min(24rem,calc(100vw-2rem))] max-h-[min(28rem,calc(100vh-6rem))] overflow-hidden rounded-xl border border-border/50 bg-card shadow-xl z-[100] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
              <span className="text-sm font-medium text-foreground">Notifikationer</span>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs text-primary h-7">
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Markera alla som lästa
                </Button>
              )}
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Inga notifikationer ännu.
                </div>
              ) : (
                notifications.map(n => {
                  const Icon = sourceIcons[n.source_table] || Bell;
                  return (
                    <button
                      key={n.id}
                      onClick={() => handleClick(n)}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/10 ${
                        !n.is_read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className={`mt-0.5 p-1.5 rounded-lg ${!n.is_read ? 'bg-primary/15 text-primary' : 'bg-muted/50 text-muted-foreground'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-medium uppercase tracking-wider ${!n.is_read ? 'text-primary' : 'text-muted-foreground'}`}>
                            {sourceLabels[n.source_table] || n.source_table}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {projectNames[n.project_id] || ''}
                          </span>
                          {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-foreground truncate">{n.preview}</p>
                        <span className="text-[10px] text-muted-foreground">
                          {format(new Date(n.created_at), 'd MMM HH:mm', { locale: sv })}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
