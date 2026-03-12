
-- Admin notifications table
CREATE TABLE public.admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table text NOT NULL,
  source_id uuid NOT NULL,
  project_id uuid NOT NULL,
  preview text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins full access to notifications"
  ON public.admin_notifications FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_notifications;

-- Trigger: new client message
CREATE OR REPLACE FUNCTION public.notify_admin_new_message()
  RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.is_admin = false THEN
    INSERT INTO public.admin_notifications (source_table, source_id, project_id, preview)
    VALUES ('project_messages', NEW.id, NEW.project_id,
      'Nytt meddelande: ' || LEFT(NEW.message, 80));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_admin_new_message
  AFTER INSERT ON public.project_messages
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_message();

-- Trigger: new client request
CREATE OR REPLACE FUNCTION public.notify_admin_new_request()
  RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.admin_notifications (source_table, source_id, project_id, preview)
  VALUES ('client_requests', NEW.id, NEW.project_id,
    'Nytt ärende: ' || LEFT(NEW.message, 80));
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_admin_new_request
  AFTER INSERT ON public.client_requests
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_request();

-- Trigger: new file upload by client
CREATE OR REPLACE FUNCTION public.notify_admin_new_file()
  RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.uploaded_by AND role = 'admin'
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    INSERT INTO public.admin_notifications (source_table, source_id, project_id, preview)
    VALUES ('project_files', NEW.id, NEW.project_id,
      'Ny fil: ' || NEW.file_name);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_admin_new_file
  AFTER INSERT ON public.project_files
  FOR EACH ROW EXECUTE FUNCTION public.notify_admin_new_file();
