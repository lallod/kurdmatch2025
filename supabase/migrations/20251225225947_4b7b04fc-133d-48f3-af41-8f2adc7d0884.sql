-- Add policy for users to delete their own matches (unmatch functionality)
CREATE POLICY "Users can delete their own matches" 
ON public.matches 
FOR DELETE 
USING (auth.uid() = user1_id OR auth.uid() = user2_id);