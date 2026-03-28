CREATE TABLE public.checklist_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  item_key text NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.checklist_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to checklist verifications"
  ON public.checklist_verifications
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE UNIQUE INDEX checklist_verifications_project_item ON public.checklist_verifications (project_id, item_key);