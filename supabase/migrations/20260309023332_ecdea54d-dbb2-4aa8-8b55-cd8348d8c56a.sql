-- Create AI chat messages table
CREATE TABLE public.ai_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own messages
CREATE POLICY "Users can read their own ai chat messages"
  ON public.ai_chat_messages
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy: Users can insert their own messages
CREATE POLICY "Users can insert their own ai chat messages"
  ON public.ai_chat_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Policy: Admins can read all messages
CREATE POLICY "Admins can read all ai chat messages"
  ON public.ai_chat_messages
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Index for faster queries
CREATE INDEX ai_chat_messages_project_user_idx ON public.ai_chat_messages(project_id, user_id, created_at);