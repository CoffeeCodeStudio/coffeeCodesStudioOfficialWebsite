-- Enable RLS on realtime.messages
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Allow users to only subscribe to channels for their own projects (or all if admin)
CREATE POLICY "Users can only listen to own project channels"
ON realtime.messages
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR (realtime.topic())::uuid IN (
    SELECT id FROM projects WHERE client_user_id = auth.uid()
  )
);