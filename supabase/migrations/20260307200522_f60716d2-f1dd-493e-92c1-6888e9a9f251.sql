
CREATE TABLE public.project_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL,
  message text NOT NULL,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to messages"
ON public.project_messages FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view own project messages"
ON public.project_messages FOR SELECT
TO authenticated
USING (project_id IN (SELECT id FROM public.projects WHERE client_user_id = auth.uid()));

CREATE POLICY "Clients can insert own project messages"
ON public.project_messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid() 
  AND is_admin = false
  AND project_id IN (SELECT id FROM public.projects WHERE client_user_id = auth.uid())
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.project_messages;
