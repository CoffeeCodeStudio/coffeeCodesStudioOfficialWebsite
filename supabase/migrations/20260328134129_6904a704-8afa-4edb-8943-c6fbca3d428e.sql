
CREATE TABLE public.project_pub_agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signed_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

ALTER TABLE public.project_pub_agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to pub agreements"
  ON public.project_pub_agreements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Clients can view own pub agreements"
  ON public.project_pub_agreements FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

CREATE POLICY "Clients can sign own pub agreements"
  ON public.project_pub_agreements FOR UPDATE TO authenticated
  USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()) AND status = 'sent')
  WITH CHECK (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()) AND status = 'signed');
