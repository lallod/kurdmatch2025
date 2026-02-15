
-- ==============================================
-- FIX 1: Create a public view for profiles hiding sensitive fields
-- ==============================================

CREATE OR REPLACE VIEW public.user_public_profile
WITH (security_invoker = on) AS
SELECT
  id, name, age, gender, bio, occupation, 
  profile_image, interests, hobbies, languages,
  relationship_goals, verified, video_verified,
  dating_profile_visible, blur_photos,
  last_active, created_at
FROM public.profiles;

-- ==============================================
-- FIX 2: Tighten profiles SELECT — authenticated only, exclude blocked
-- ==============================================

DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view non-blocked profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
  OR NOT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = auth.uid() AND blocked_id = profiles.id)
       OR (blocker_id = profiles.id AND blocked_id = auth.uid())
  )
);

-- ==============================================
-- FIX 3: payments — restrict to authenticated role
-- ==============================================

DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
ON public.payments FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super admins can view all payments" ON public.payments;
CREATE POLICY "Super admins can view all payments"
ON public.payments FOR SELECT TO authenticated
USING (is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Super admins can insert payments" ON public.payments;
CREATE POLICY "Super admins can insert payments"
ON public.payments FOR INSERT TO authenticated
WITH CHECK (is_super_admin(auth.uid()));

DROP POLICY IF EXISTS "Super admins can update payments" ON public.payments;
CREATE POLICY "Super admins can update payments"
ON public.payments FOR UPDATE TO authenticated
USING (is_super_admin(auth.uid()));

-- ==============================================
-- FIX 4: phone_verifications — restrict to authenticated
-- ==============================================

DROP POLICY IF EXISTS "Users can view own verifications" ON public.phone_verifications;
CREATE POLICY "Users can view own verifications"
ON public.phone_verifications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own verifications" ON public.phone_verifications;
CREATE POLICY "Users can insert own verifications"
ON public.phone_verifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own verifications" ON public.phone_verifications;
CREATE POLICY "Users can update own verifications"
ON public.phone_verifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

-- ==============================================
-- FIX 5: video_verifications — restrict to authenticated
-- ==============================================

DROP POLICY IF EXISTS "Users can view own verifications" ON public.video_verifications;
CREATE POLICY "Users can view own verifications"
ON public.video_verifications FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own verification" ON public.video_verifications;
CREATE POLICY "Users can create own verification"
ON public.video_verifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update verifications" ON public.video_verifications;
CREATE POLICY "Admins can update verifications"
ON public.video_verifications FOR UPDATE TO authenticated
USING (is_super_admin(auth.uid()) OR auth.uid() = user_id);
