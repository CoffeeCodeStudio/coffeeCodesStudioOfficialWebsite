-- Fix storage policies: change from public role to authenticated
-- Drop the public-scoped policies and recreate them for authenticated only
DROP POLICY IF EXISTS "Clients can upload to own project" ON storage.objects;
DROP POLICY IF EXISTS "Clients can view own project files" ON storage.objects;

-- Recreate upload policy for authenticated only
CREATE POLICY "Clients can upload to own project" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE client_user_id = auth.uid()
  )
);

-- Recreate view policy for authenticated only
CREATE POLICY "Clients can view own project files" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE client_user_id = auth.uid()
  )
);