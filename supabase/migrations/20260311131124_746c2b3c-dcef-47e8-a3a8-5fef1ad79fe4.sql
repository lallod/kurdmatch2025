
-- 1. Fix marriage_intentions: change public→authenticated + add block check
DROP POLICY IF EXISTS "Users can view all visible intentions" ON public.marriage_intentions;
CREATE POLICY "Users can view visible intentions"
ON public.marriage_intentions
FOR SELECT
TO authenticated
USING (
  (auth.uid() = user_id)
  OR (
    visible_on_profile = true
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = marriage_intentions.user_id AND blocked_id = auth.uid())
         OR (blocker_id = auth.uid() AND blocked_id = marriage_intentions.user_id)
    )
  )
);

-- 2. Fix profile_details: add block check
DROP POLICY IF EXISTS "Authenticated users can view profile details" ON public.profile_details;
CREATE POLICY "Authenticated users can view profile details"
ON public.profile_details
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR NOT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = profile_details.profile_id AND blocked_id = auth.uid())
       OR (blocker_id = auth.uid() AND blocked_id = profile_details.profile_id)
  )
);

-- 3. Fix profile_preferences: add block check
DROP POLICY IF EXISTS "Authenticated users can view profile preferences" ON public.profile_preferences;
CREATE POLICY "Authenticated users can view profile preferences"
ON public.profile_preferences
FOR SELECT
TO authenticated
USING (
  profile_id = auth.uid()
  OR NOT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = profile_preferences.profile_id AND blocked_id = auth.uid())
       OR (blocker_id = auth.uid() AND blocked_id = profile_preferences.profile_id)
  )
);

-- 4. Fix profile_visibility_settings: restrict to owner only
DROP POLICY IF EXISTS "Authenticated users can read others visibility settings" ON public.profile_visibility_settings;

-- 5. Fix stories: change public→authenticated + add block check
DROP POLICY IF EXISTS "Anyone can view non-expired stories" ON public.stories;
CREATE POLICY "Authenticated users can view non-expired stories"
ON public.stories
FOR SELECT
TO authenticated
USING (
  expires_at > now()
  AND NOT EXISTS (
    SELECT 1 FROM public.blocked_users
    WHERE (blocker_id = stories.user_id AND blocked_id = auth.uid())
       OR (blocker_id = auth.uid() AND blocked_id = stories.user_id)
  )
);
