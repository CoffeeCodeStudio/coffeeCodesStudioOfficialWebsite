-- Policy: Users can delete their own messages
CREATE POLICY "Users can delete their own ai chat messages"
  ON public.ai_chat_messages
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());