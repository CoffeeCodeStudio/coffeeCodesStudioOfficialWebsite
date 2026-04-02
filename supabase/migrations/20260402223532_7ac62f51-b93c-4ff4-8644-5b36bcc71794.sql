-- Client SELECT policies for checklist tables
CREATE POLICY "Clients can view own project checklists"
ON public.project_checklists
FOR SELECT TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE client_user_id = auth.uid()
  )
);

CREATE POLICY "Clients can view own workflow checklists"
ON public.workflow_checklists
FOR SELECT TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE client_user_id = auth.uid()
  )
);

CREATE POLICY "Clients can view own checklist verifications"
ON public.checklist_verifications
FOR SELECT TO authenticated
USING (
  project_id IN (
    SELECT id FROM projects WHERE client_user_id = auth.uid()
  )
);

-- Client DELETE policy for storage (own project files)
CREATE POLICY "Clients can delete own project files"
ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'project-files'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM projects WHERE client_user_id = auth.uid()
  )
);