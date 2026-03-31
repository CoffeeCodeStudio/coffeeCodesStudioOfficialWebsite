
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  url TEXT,
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view visible portfolio projects (public landing page)
CREATE POLICY "Anyone can view visible portfolio projects"
ON public.portfolio_projects
FOR SELECT
TO anon, authenticated
USING (is_visible = true);

-- Admins have full access
CREATE POLICY "Admins full access to portfolio projects"
ON public.portfolio_projects
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
