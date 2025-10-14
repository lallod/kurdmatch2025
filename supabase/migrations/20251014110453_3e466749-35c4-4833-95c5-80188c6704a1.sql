-- Fix function search paths for security definer functions
-- This prevents search_path manipulation attacks

-- Fix is_user_blocked function
CREATE OR REPLACE FUNCTION public.is_user_blocked(target_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM blocked_users
    WHERE (blocker_id = auth.uid() AND blocked_id = target_user_id)
       OR (blocker_id = target_user_id AND blocked_id = auth.uid())
  );
END;
$$;