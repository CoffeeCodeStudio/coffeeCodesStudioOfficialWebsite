
-- Create client_requests table
CREATE TABLE public.client_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_requests ENABLE ROW LEVEL SECURITY;

-- Clients can view and create their own requests
CREATE POLICY "Clients can view own requests" ON public.client_requests
  FOR SELECT USING (
    project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid())
  );

CREATE POLICY "Clients can create requests" ON public.client_requests
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid())
  );

-- Admins full access
CREATE POLICY "Admins full access to requests" ON public.client_requests
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Storage policy: allow clients to upload to their project folders
CREATE POLICY "Clients can upload to own project" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM projects WHERE client_user_id = auth.uid()
    )
  );

CREATE POLICY "Clients can view own project files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM projects WHERE client_user_id = auth.uid()
    )
  );

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.status_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_todos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_files;
