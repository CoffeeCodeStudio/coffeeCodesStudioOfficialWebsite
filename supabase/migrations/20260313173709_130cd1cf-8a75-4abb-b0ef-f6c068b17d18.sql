
CREATE TABLE public.project_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.project_responses ENABLE ROW LEVEL SECURITY;

-- Admins full access
CREATE POLICY "Admins full access to responses" ON public.project_responses
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Clients can insert responses for own projects
CREATE POLICY "Clients can insert own responses" ON public.project_responses
  FOR INSERT TO authenticated
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

-- Clients can view own responses
CREATE POLICY "Clients can view own responses" ON public.project_responses
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));
