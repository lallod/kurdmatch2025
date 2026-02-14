
-- PHASE 1: Critical Security Fixes - Remove dangerous WITH CHECK (true) policies

-- 1. Fix user_roles: Remove unrestricted INSERT (CRITICAL - allows privilege escalation)
DROP POLICY IF EXISTS "Allow insertion of super_admin roles" ON public.user_roles;
CREATE POLICY "Only super admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.is_super_admin(auth.uid()));

-- 2. Fix matches: Remove unrestricted system INSERT
DROP POLICY IF EXISTS "System can create matches" ON public.matches;

-- 3. Fix notifications: Remove unrestricted system INSERT  
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- 4. Fix hashtags: Remove unrestricted system manage
DROP POLICY IF EXISTS "System can manage hashtags" ON public.hashtags;

-- 5. Fix message_safety_flags: Remove unrestricted service role INSERT
DROP POLICY IF EXISTS "Service role can create flags" ON public.message_safety_flags;
