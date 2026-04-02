
-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email_new_message BOOLEAN NOT NULL DEFAULT true,
  email_status_update BOOLEAN NOT NULL DEFAULT true,
  email_file_upload BOOLEAN NOT NULL DEFAULT false,
  email_agreement_signed BOOLEAN NOT NULL DEFAULT true,
  email_new_request BOOLEAN NOT NULL DEFAULT true,
  email_password_changed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences"
  ON public.notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON public.notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON public.notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all preferences"
  ON public.notification_preferences FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trigger function: notify on new message (calls send-notification edge function)
CREATE OR REPLACE FUNCTION public.trigger_notify_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  target_user_id UUID;
  project_name TEXT;
BEGIN
  -- Determine recipient: if admin sent → notify client, if client sent → notify admin (handled by edge function)
  IF NEW.is_admin = true THEN
    SELECT client_user_id INTO target_user_id FROM projects WHERE id = NEW.project_id;
  END IF;

  SELECT name INTO project_name FROM projects WHERE id = NEW.project_id;

  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := jsonb_build_object(
      'type', 'email_new_message',
      'project_id', NEW.project_id,
      'project_name', project_name,
      'is_admin_sender', NEW.is_admin,
      'target_user_id', target_user_id,
      'preview', LEFT(NEW.message, 200)
    )
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_message_notify
AFTER INSERT ON public.project_messages
FOR EACH ROW
EXECUTE FUNCTION public.trigger_notify_new_message();

-- Trigger function: notify admin on file upload by client
CREATE OR REPLACE FUNCTION public.trigger_notify_file_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  is_admin_uploader BOOLEAN;
  project_name TEXT;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.uploaded_by AND role = 'admin'
  ) INTO is_admin_uploader;

  IF NOT is_admin_uploader THEN
    SELECT name INTO project_name FROM projects WHERE id = NEW.project_id;

    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'type', 'email_file_upload',
        'project_id', NEW.project_id,
        'project_name', project_name,
        'file_name', NEW.file_name
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_file_upload_notify
AFTER INSERT ON public.project_files
FOR EACH ROW
EXECUTE FUNCTION public.trigger_notify_file_upload();

-- Trigger function: notify client on request status change
CREATE OR REPLACE FUNCTION public.trigger_notify_request_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  project_name TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    SELECT name INTO project_name FROM projects WHERE id = NEW.project_id;

    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-notification',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
      ),
      body := jsonb_build_object(
        'type', 'email_status_update',
        'project_id', NEW.project_id,
        'project_name', project_name,
        'user_id', NEW.user_id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'category', NEW.category
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_request_status_change_notify
AFTER UPDATE ON public.client_requests
FOR EACH ROW
EXECUTE FUNCTION public.trigger_notify_request_status();
