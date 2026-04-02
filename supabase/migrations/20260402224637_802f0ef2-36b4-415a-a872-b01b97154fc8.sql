
DROP TRIGGER IF EXISTS on_new_message_notify ON public.project_messages;
DROP TRIGGER IF EXISTS on_file_upload_notify ON public.project_files;
DROP TRIGGER IF EXISTS on_request_status_change_notify ON public.client_requests;
DROP FUNCTION IF EXISTS public.trigger_notify_new_message();
DROP FUNCTION IF EXISTS public.trigger_notify_file_upload();
DROP FUNCTION IF EXISTS public.trigger_notify_request_status();
