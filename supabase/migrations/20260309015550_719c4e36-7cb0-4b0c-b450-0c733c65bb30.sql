-- Allow clients to INSERT files into their own projects
CREATE POLICY "Clients can upload files to own projects"
ON public.project_files FOR INSERT
TO authenticated
WITH CHECK (
  project_id IN (
    SELECT id FROM projects WHERE client_user_id = auth.uid()
  )
);