-- P1-1: Create RPC function for adding story reactions (avoids needing UPDATE permission)
CREATE OR REPLACE FUNCTION public.add_story_reaction(p_story_id uuid, p_user_id uuid, p_emoji text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_reactions jsonb;
  new_reaction jsonb;
BEGIN
  -- Verify the user is authenticated
  IF auth.uid() IS NULL OR auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  new_reaction := jsonb_build_object(
    'userId', p_user_id,
    'emoji', p_emoji,
    'timestamp', now()::text
  );

  SELECT COALESCE(reactions::jsonb, '[]'::jsonb) INTO current_reactions
  FROM stories WHERE id = p_story_id;

  UPDATE stories
  SET reactions = (current_reactions || new_reaction)::jsonb
  WHERE id = p_story_id;
END;
$$;

-- P0-3: Fix overly permissive INSERT policy on admin_audit_log
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_log;
CREATE POLICY "Authenticated admins can insert audit logs"
ON public.admin_audit_log
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);

-- P0-3: Fix overly permissive all-access policy on scheduled_content
DROP POLICY IF EXISTS "Service role full access to scheduled_content" ON public.scheduled_content;
CREATE POLICY "Admins can manage scheduled_content"
ON public.scheduled_content
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  )
);