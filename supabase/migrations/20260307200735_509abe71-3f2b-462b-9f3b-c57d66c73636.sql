
-- Add event_type column to status_logs
ALTER TABLE public.status_logs ADD COLUMN event_type text NOT NULL DEFAULT 'manual';

-- Trigger: log project status changes
CREATE OR REPLACE FUNCTION public.log_project_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.status_logs (project_id, message, author_name, event_type)
    VALUES (
      NEW.id,
      'Status ändrad från "' || OLD.status || '" till "' || NEW.status || '"',
      'System',
      'status_change'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_project_status_change
AFTER UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.log_project_status_change();

-- Trigger: log new client requests
CREATE OR REPLACE FUNCTION public.log_new_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.status_logs (project_id, message, author_name, event_type)
  VALUES (
    NEW.project_id,
    'Nytt ärende skickat: ' || NEW.category || ' (' || NEW.priority || ')',
    'Kund',
    'new_request'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_new_request
AFTER INSERT ON public.client_requests
FOR EACH ROW EXECUTE FUNCTION public.log_new_request();

-- Trigger: log new messages
CREATE OR REPLACE FUNCTION public.log_new_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.status_logs (project_id, message, author_name, event_type)
  VALUES (
    NEW.project_id,
    CASE WHEN NEW.is_admin THEN 'Admin skickade ett meddelande' ELSE 'Kund skickade ett meddelande' END,
    CASE WHEN NEW.is_admin THEN 'Admin' ELSE 'Kund' END,
    'message'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_new_message
AFTER INSERT ON public.project_messages
FOR EACH ROW EXECUTE FUNCTION public.log_new_message();

-- Trigger: log file uploads
CREATE OR REPLACE FUNCTION public.log_file_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.status_logs (project_id, message, author_name, event_type)
  VALUES (
    NEW.project_id,
    'Fil uppladdad: ' || NEW.file_name,
    'System',
    'file_upload'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_file_upload
AFTER INSERT ON public.project_files
FOR EACH ROW EXECUTE FUNCTION public.log_file_upload();
