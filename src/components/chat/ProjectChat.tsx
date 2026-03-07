import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { sv } from 'date-fns/locale';

interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

interface ProjectChatProps {
  projectId: string;
  isAdmin: boolean;
  currentUserId: string;
}

export function ProjectChat({ projectId, isAdmin, currentUserId }: ProjectChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('project_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });
    setMessages((data as Message[]) || []);
  };

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel(`project-messages-${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'project_messages',
        filter: `project_id=eq.${projectId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    const { error } = await supabase.from('project_messages').insert({
      project_id: projectId,
      sender_id: currentUserId,
      message: newMessage.trim(),
      is_admin: isAdmin,
    } as any);
    if (!error) setNewMessage('');
    setSending(false);
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 p-4">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">Inga meddelanden ännu. Starta en konversation!</p>
        )}
        {messages.map(msg => {
          const mine = msg.is_admin === isAdmin;
          return (
            <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                mine
                  ? 'bg-primary/20 text-foreground border border-primary/20'
                  : 'bg-muted/50 text-foreground border border-border/30'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {msg.is_admin ? 'Admin' : 'Kund'} · {format(new Date(msg.created_at), 'd MMM HH:mm', { locale: sv })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border/30 p-3 flex gap-2">
        <Textarea
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Skriv ett meddelande..."
          className="bg-muted/50 border-border/50 min-h-[44px] max-h-[100px] resize-none"
          rows={1}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
        />
        <Button onClick={handleSend} disabled={sending || !newMessage.trim()} size="icon" className="shrink-0 bg-primary text-primary-foreground">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
