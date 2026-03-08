
-- Fix the failed part: scheduled_content
DROP POLICY IF EXISTS "Only super admins can manage scheduled content" ON public.scheduled_content;
CREATE POLICY "Only super admins can manage scheduled content"
  ON public.scheduled_content
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));
