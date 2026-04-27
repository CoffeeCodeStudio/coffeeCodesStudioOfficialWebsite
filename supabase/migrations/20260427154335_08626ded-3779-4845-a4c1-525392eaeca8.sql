-- 1) Remove the broad public SELECT policy on portfolio-images.
-- The bucket itself is public, so direct object URLs continue to work via CDN.
-- This only blocks the LIST operation against storage.objects.
DROP POLICY IF EXISTS "Anyone can view portfolio images" ON storage.objects;

-- 2) Lock down SECURITY DEFINER trigger functions so they can't be called
--    from the public REST API by anon/authenticated. Triggers still execute
--    them because the trigger system runs as table owner.
REVOKE EXECUTE ON FUNCTION public.notify_admin_new_request()       FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_agreement_before_status_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_new_message()                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.clear_questionnaire_reminder()   FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user()                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_project_status_change()      FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_new_request()                FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admin_new_file()          FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_monthly_quota()            FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_admin_new_message()       FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_file_upload()                FROM PUBLIC, anon, authenticated;

-- 3) has_role() is used inside RLS policies. RLS evaluates policies as the
--    calling role, so authenticated MUST keep EXECUTE. Anon does not need it
--    (no policy uses has_role for anon). Revoke from PUBLIC and anon only.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;