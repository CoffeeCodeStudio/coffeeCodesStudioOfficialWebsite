
-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  client_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'design' CHECK (status IN ('design', 'development', 'backup', 'launch', 'completed')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Project files table
CREATE TABLE public.project_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Status logs table
CREATE TABLE public.status_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Project todos table
CREATE TABLE public.project_todos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_todos ENABLE ROW LEVEL SECURITY;

-- RLS policies: clients see only their own projects
CREATE POLICY "Clients can view own projects" ON public.projects
  FOR SELECT TO authenticated
  USING (client_user_id = auth.uid());

CREATE POLICY "Clients can view own project files" ON public.project_files
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE client_user_id = auth.uid()));

CREATE POLICY "Clients can view own status logs" ON public.status_logs
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE client_user_id = auth.uid()));

CREATE POLICY "Clients can view own todos" ON public.project_todos
  FOR SELECT TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE client_user_id = auth.uid()));

CREATE POLICY "Clients can update own todos" ON public.project_todos
  FOR UPDATE TO authenticated
  USING (project_id IN (SELECT id FROM public.projects WHERE client_user_id = auth.uid()))
  WITH CHECK (project_id IN (SELECT id FROM public.projects WHERE client_user_id = auth.uid()));

-- Storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', false);

-- Storage RLS: clients can download their own project files
CREATE POLICY "Clients can download own project files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-files' AND
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.projects WHERE client_user_id = auth.uid()
    )
  );
