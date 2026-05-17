
-- 1) Remove admin_notifications from realtime publication
ALTER PUBLICATION supabase_realtime DROP TABLE public.admin_notifications;

-- 2) Lock down user_roles: explicit admin-only INSERT/UPDATE/DELETE policies
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3) Remove client direct UPDATE on project_pub_agreements
-- Signing flows exclusively through sign-pub-agreement edge function (service role).
DROP POLICY IF EXISTS "Clients can sign own pub agreements" ON public.project_pub_agreements;

-- 4) Revoke EXECUTE on SECURITY DEFINER trigger/utility functions from public roles.
-- Triggers still fire (they run as definer); we just block direct invocation.
-- has_role() is intentionally kept executable because RLS policies depend on it.
REVOKE EXECUTE ON FUNCTION public.notify_admin_new_request() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admin_new_file() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admin_new_message() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_agreement_before_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_new_message() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.clear_questionnaire_reminder() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_project_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_new_request() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_file_upload() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_monthly_quota() FROM PUBLIC, anon, authenticated;
