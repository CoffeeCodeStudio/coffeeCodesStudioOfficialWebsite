-- Add admin_response to client_requests so admin can reply
ALTER TABLE public.client_requests ADD COLUMN IF NOT EXISTS admin_response text;

-- Add renewal_date to projects for subscription tracking  
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS renewal_date date;