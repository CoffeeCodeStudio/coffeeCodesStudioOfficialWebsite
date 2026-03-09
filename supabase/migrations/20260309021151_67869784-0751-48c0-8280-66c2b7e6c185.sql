-- Allow clients to cancel their own pending requests
CREATE POLICY "Clients can cancel own pending requests"
ON public.client_requests FOR UPDATE
TO authenticated
USING (
  user_id = auth.uid() AND status = 'pending'
)
WITH CHECK (
  user_id = auth.uid() AND status = 'cancelled'
);