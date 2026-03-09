
-- Create project_agreements table
CREATE TABLE public.project_agreements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  scope_description TEXT NOT NULL,
  total_price NUMERIC NOT NULL,
  payment_terms TEXT NOT NULL DEFAULT '50% vid projektstart, 50% vid leverans',
  estimated_delivery TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  signed_at TIMESTAMPTZ,
  signed_by_name TEXT,
  signed_by_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(project_id)
);

-- Enable RLS
ALTER TABLE public.project_agreements ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins full access to agreements"
  ON public.project_agreements
  FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'))
  WITH CHECK (has_role(auth.uid(), 'admin'));

-- Clients can view own project agreements
CREATE POLICY "Clients can view own agreements"
  ON public.project_agreements
  FOR SELECT
  TO authenticated
  USING (project_id IN (
    SELECT id FROM projects WHERE client_user_id = auth.uid()
  ));

-- Clients can update (sign) their own agreements when status is 'sent'
CREATE POLICY "Clients can sign own agreements"
  ON public.project_agreements
  FOR UPDATE
  TO authenticated
  USING (
    project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid())
    AND status = 'sent'
  )
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid())
    AND status = 'signed'
  );

-- Trigger: prevent project status change past 'design' without signed agreement
CREATE OR REPLACE FUNCTION public.enforce_agreement_before_status_change()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
BEGIN
  -- Only enforce when changing FROM 'design' to something else
  IF OLD.status = 'design' AND NEW.status != 'design' THEN
    IF NOT EXISTS (
      SELECT 1 FROM project_agreements
      WHERE project_id = NEW.id AND status = 'signed'
    ) THEN
      RAISE EXCEPTION 'Avtalet måste vara signerat innan projektet kan lämna Design-status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_agreement_on_status_change
  BEFORE UPDATE OF status ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_agreement_before_status_change();
