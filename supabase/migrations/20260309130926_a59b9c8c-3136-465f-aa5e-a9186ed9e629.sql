
-- ==========================================
-- FIX 1: Convert ALL RESTRICTIVE policies to PERMISSIVE
-- ==========================================

-- ai_chat_messages
DROP POLICY IF EXISTS "Admins can read all ai chat messages" ON public.ai_chat_messages;
CREATE POLICY "Admins can read all ai chat messages" ON public.ai_chat_messages FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can delete their own ai chat messages" ON public.ai_chat_messages;
CREATE POLICY "Users can delete their own ai chat messages" ON public.ai_chat_messages FOR DELETE TO authenticated USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert their own ai chat messages" ON public.ai_chat_messages;
CREATE POLICY "Users can insert their own ai chat messages" ON public.ai_chat_messages FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can read their own ai chat messages" ON public.ai_chat_messages;
CREATE POLICY "Users can read their own ai chat messages" ON public.ai_chat_messages FOR SELECT TO authenticated USING (user_id = auth.uid());

-- client_requests
DROP POLICY IF EXISTS "Admins full access to requests" ON public.client_requests;
CREATE POLICY "Admins full access to requests" ON public.client_requests FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Clients can cancel own pending requests" ON public.client_requests;
CREATE POLICY "Clients can cancel own pending requests" ON public.client_requests FOR UPDATE TO authenticated USING ((user_id = auth.uid()) AND (status = 'pending')) WITH CHECK ((user_id = auth.uid()) AND (status = 'cancelled'));

DROP POLICY IF EXISTS "Clients can create requests" ON public.client_requests;
CREATE POLICY "Clients can create requests" ON public.client_requests FOR INSERT TO authenticated WITH CHECK ((user_id = auth.uid()) AND (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid())));

DROP POLICY IF EXISTS "Clients can view own requests" ON public.client_requests;
CREATE POLICY "Clients can view own requests" ON public.client_requests FOR SELECT TO authenticated USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

-- profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());

-- project_messages
DROP POLICY IF EXISTS "Admins full access to messages" ON public.project_messages;
CREATE POLICY "Admins full access to messages" ON public.project_messages FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Clients can insert own project messages" ON public.project_messages;
CREATE POLICY "Clients can insert own project messages" ON public.project_messages FOR INSERT TO authenticated WITH CHECK ((sender_id = auth.uid()) AND (is_admin = false) AND (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid())));

DROP POLICY IF EXISTS "Clients can view own project messages" ON public.project_messages;
CREATE POLICY "Clients can view own project messages" ON public.project_messages FOR SELECT TO authenticated USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

-- project_todos
DROP POLICY IF EXISTS "Admins can manage todos" ON public.project_todos;
CREATE POLICY "Admins can manage todos" ON public.project_todos FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Clients can update own todos" ON public.project_todos;
CREATE POLICY "Clients can update own todos" ON public.project_todos FOR UPDATE TO authenticated USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid())) WITH CHECK (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

DROP POLICY IF EXISTS "Clients can view own todos" ON public.project_todos;
CREATE POLICY "Clients can view own todos" ON public.project_todos FOR SELECT TO authenticated USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

-- projects
DROP POLICY IF EXISTS "Admins full access to projects" ON public.projects;
CREATE POLICY "Admins full access to projects" ON public.projects FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Clients can view own projects" ON public.projects;
CREATE POLICY "Clients can view own projects" ON public.projects FOR SELECT TO authenticated USING (client_user_id = auth.uid());

-- project_files
DROP POLICY IF EXISTS "Admins can manage files" ON public.project_files;
CREATE POLICY "Admins can manage files" ON public.project_files FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Clients can upload files to own projects" ON public.project_files;
CREATE POLICY "Clients can upload files to own projects" ON public.project_files FOR INSERT TO authenticated WITH CHECK (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

DROP POLICY IF EXISTS "Clients can view own project files" ON public.project_files;
CREATE POLICY "Clients can view own project files" ON public.project_files FOR SELECT TO authenticated USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

-- status_logs
DROP POLICY IF EXISTS "Admins can manage status logs" ON public.status_logs;
CREATE POLICY "Admins can manage status logs" ON public.status_logs FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Clients can view own status logs" ON public.status_logs;
CREATE POLICY "Clients can view own status logs" ON public.status_logs FOR SELECT TO authenticated USING (project_id IN (SELECT id FROM projects WHERE client_user_id = auth.uid()));

-- user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- workflow_checklists
DROP POLICY IF EXISTS "Admins full access to workflow checklists" ON public.workflow_checklists;
CREATE POLICY "Admins full access to workflow checklists" ON public.workflow_checklists FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ==========================================
-- FIX 2: Drop overly broad storage read policy
-- ==========================================
DROP POLICY IF EXISTS "Clients can read own project files" ON storage.objects;

-- ==========================================
-- FIX 5: Server-side monthly quota enforcement
-- ==========================================
CREATE OR REPLACE FUNCTION public.check_monthly_quota()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$
DECLARE
  used integer;
  quota integer;
BEGIN
  SELECT monthly_quota INTO quota FROM projects WHERE id = NEW.project_id;
  SELECT COUNT(*) INTO used
  FROM client_requests
  WHERE project_id = NEW.project_id
    AND status != 'cancelled'
    AND created_at >= date_trunc('month', now());
  IF used >= quota THEN
    RAISE EXCEPTION 'Monthly quota exceeded';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER enforce_monthly_quota
  BEFORE INSERT ON public.client_requests
  FOR EACH ROW EXECUTE FUNCTION public.check_monthly_quota();
