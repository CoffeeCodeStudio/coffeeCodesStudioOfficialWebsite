import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  projectId: string;
  projectStatus?: string;
}

const statusSuggestions: Record<string, string[]> = {
  questionnaire: ['Vad behöver ni från mig nu?', 'Hur fyller jag i projektfrågorna?'],
  design: ['Kan jag se designen?', 'Hur länge tar designfasen?'],
  development: ['Hur långt har ni kommit?', 'Kan jag följa utvecklingen?'],
  testing: ['Hur testar ni min sajt?', 'När blir den klar?'],
  live: ['Hur skickar jag en ändringsförfrågan?', 'Vad ingår i mitt underhållspaket?'],
  completed: ['Hur skickar jag en ändringsförfrågan?', 'Vad ingår i mitt underhållspaket?'],
};

const defaultSuggestions = [
  'Vad ingår i mitt paket?',
  'Hur lång tid tar det?',
  'Hur skickar jag feedback?',
  'Kan jag ändra något efteråt?',
  'Vad händer nu?',
];

export function AIAssistant({ projectId, projectStatus }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ai_chat_messages')
        .select('role, content')
        .eq('project_id', projectId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })));
      }
      setIsLoadingHistory(false);
    };
    loadHistory();
  }, [projectId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const saveMessage = async (role: 'user' | 'assistant', content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('ai_chat_messages').insert({
      project_id: projectId,
      user_id: user.id,
      role,
      content,
    });
  };

  const clearHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('ai_chat_messages')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', user.id);

    if (!error) {
      setMessages([]);
      toast({ title: 'Historik rensad', description: 'Chatthistoriken har tagits bort.' });
    }
  };

  const sendMessage = async (overrideMessage?: string) => {
    const text = overrideMessage || input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Save user message
    await saveMessage('user', userMsg.content);

    let assistantContent = '';

    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Inte inloggad');
      }

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/project-ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          projectId,
        }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Något gick fel');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Add empty assistant message to start streaming into
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: 'assistant', content: assistantContent };
                return updated;
              });
            }
          } catch {
            // Incomplete JSON, will be handled in next chunk
          }
        }
      }

      // Save assistant message after streaming completes
      if (assistantContent) {
        await saveMessage('assistant', assistantContent);
      }
    } catch (error) {
      console.error('AI chat error:', error);
      const errorMsg = 'Något gick fel. Kontakta Coffee Code Studio för hjälp.';
      setMessages(prev => [
        ...prev.filter(m => m.content !== ''),
        { role: 'assistant', content: errorMsg },
      ]);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-serif text-foreground">AI-assistent</h2>
            <p className="text-xs text-muted-foreground">Ställ frågor om ditt projekt</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Rensa historik
          </Button>
        )}
      </div>

      <div className="glass-card cyber-border rounded-2xl overflow-hidden">
        <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
          {isLoadingHistory ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Bot className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">
                Hej! Jag kan hjälpa dig med frågor om ditt projekt.
              </p>
              <p className="text-muted-foreground/70 text-xs mt-1 mb-4">
                Klicka på ett förslag eller skriv din egen fråga.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md">
                {(projectStatus && statusSuggestions[projectStatus] ? statusSuggestions[projectStatus] : defaultSuggestions).map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-muted/30 border-border/50 hover:bg-primary/10 hover:border-primary/30"
                    onClick={() => {
                      sendMessage(suggestion);
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-primary/20 text-foreground border border-primary/20'
                        : 'bg-muted/50 text-foreground border border-border/30'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="text-sm prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-headings:text-foreground prose-strong:text-foreground prose-p:text-foreground prose-li:text-foreground">
                        <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content || '...'}</p>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </>
          )}

          {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="bg-muted/50 border border-border/30 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-border/30 p-3 flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ställ en fråga..."
            className="bg-muted/50 border-border/50 min-h-[44px] max-h-[100px] resize-none"
            rows={1}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="shrink-0 bg-primary text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
