-- Fix 1: Restrict notifications insert to only allow users to insert notifications where actor_id = their own id
-- First drop the overly permissive policy
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- Notifications should only be created by triggers/service role (no direct user inserts)
-- If triggers need to insert, they run as SECURITY DEFINER and bypass RLS

-- Fix 2: Revoke anon access from check_email_exists to prevent unauthenticated email enumeration
REVOKE EXECUTE ON FUNCTION public.check_email_exists(text) FROM anon;