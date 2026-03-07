
CREATE TABLE public.workflow_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  checklist_type text NOT NULL, -- 'admin_process' or 'client_questions'
  item_index integer NOT NULL,
  checked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, checklist_type, item_index)
);

ALTER TABLE public.workflow_checklists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to workflow checklists"
ON public.workflow_checklists FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
