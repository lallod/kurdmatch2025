-- =============================================
-- P0: Fix privilege escalation vulnerabilities
-- =============================================

-- 1. Remove user INSERT/UPDATE policies on user_subscriptions
-- Subscriptions should ONLY be managed by backend/super admins
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;

-- Keep read-only access for users to see their own subscription
-- "Users can read own subscription" and "Users can view their own subscription" remain

-- 2. Fix video_verifications UPDATE policy - remove user self-update
DROP POLICY IF EXISTS "Admins can update verifications" ON public.video_verifications;

-- Replace with admin-only UPDATE policy
CREATE POLICY "Only super admins can update verifications"
ON public.video_verifications
FOR UPDATE
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- Restrict INSERT to only allow 'pending' status
DROP POLICY IF EXISTS "Users can create own verification" ON public.video_verifications;

CREATE POLICY "Users can submit verification requests"
ON public.video_verifications
FOR INSERT
WITH CHECK (
  auth.uid() = user_id 
  AND status = 'pending'
);

-- 3. Fix scheduled_content - remove the overly permissive duplicate policy
-- Keep only the is_super_admin policy
DROP POLICY IF EXISTS "Admins can manage scheduled_content" ON public.scheduled_content;
-- The "Only super admins can manage scheduled content" policy with is_super_admin() already exists