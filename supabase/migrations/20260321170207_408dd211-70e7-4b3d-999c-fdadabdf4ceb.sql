-- Create project_admin_data table for sensitive admin-only fields
CREATE TABLE public.project_admin_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  admin_notes text,
  system_prompt text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_admin_data ENABLE ROW LEVEL SECURITY;

-- Only admins can access this table
CREATE POLICY "Admins full access to project admin data"
  ON public.project_admin_data
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Migrate existing data
INSERT INTO public.project_admin_data (project_id, admin_notes, system_prompt)
SELECT id, admin_notes, system_prompt FROM public.projects
WHERE admin_notes IS NOT NULL OR system_prompt IS NOT NULL;

-- Remove columns from projects table
ALTER TABLE public.projects DROP COLUMN admin_notes;
ALTER TABLE public.projects DROP COLUMN system_prompt;