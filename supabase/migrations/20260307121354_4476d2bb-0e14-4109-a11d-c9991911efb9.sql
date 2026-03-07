ALTER TABLE public.client_requests ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS package text NOT NULL DEFAULT 'bas';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS monthly_quota integer NOT NULL DEFAULT 3;