CREATE OR REPLACE FUNCTION public.clear_questionnaire_reminder()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.status = 'questionnaire' AND NEW.status != 'questionnaire' THEN
    NEW.questionnaire_reminded_at := NULL;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER clear_questionnaire_reminder_trigger
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.clear_questionnaire_reminder();