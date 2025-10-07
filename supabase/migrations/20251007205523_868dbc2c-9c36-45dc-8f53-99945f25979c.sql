-- CRITICAL SECURITY FIX: Restrict access to sensitive user data
-- This migration adds proper RLS policies to protect user privacy

-- 1. Fix user_roles table - prevent unauthorized role viewing and insertion
DROP POLICY IF EXISTS "Anyone can insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Anyone can select user_roles" ON public.user_roles;

-- Only allow users to see their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only super admins can create roles
CREATE POLICY "Super admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  )
);

-- 2. Restrict profiles table to authenticated users only
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- 3. Restrict profile_details to authenticated users
DROP POLICY IF EXISTS "Anyone can view profile details" ON public.profile_details;

CREATE POLICY "Authenticated users can view profile details"
ON public.profile_details
FOR SELECT
TO authenticated
USING (true);

-- 4. Restrict profile_preferences to authenticated users
DROP POLICY IF EXISTS "Anyone can view profile preferences" ON public.profile_preferences;

CREATE POLICY "Authenticated users can view profile preferences"
ON public.profile_preferences
FOR SELECT
TO authenticated
USING (true);

-- 5. Restrict photos to authenticated users
DROP POLICY IF EXISTS "Anyone can view photos" ON public.photos;

CREATE POLICY "Authenticated users can view photos"
ON public.photos
FOR SELECT
TO authenticated
USING (true);

-- 6. Restrict posts to authenticated users
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;

CREATE POLICY "Authenticated users can view posts"
ON public.posts
FOR SELECT
TO authenticated
USING (true);

-- 7. Restrict post_comments to authenticated users
DROP POLICY IF EXISTS "Anyone can view comments" ON public.post_comments;

CREATE POLICY "Authenticated users can view comments"
ON public.post_comments
FOR SELECT
TO authenticated
USING (true);

-- 8. Restrict events to authenticated users
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;

CREATE POLICY "Authenticated users can view events"
ON public.events
FOR SELECT
TO authenticated
USING (true);

-- 9. Restrict event_attendees to authenticated users
DROP POLICY IF EXISTS "Anyone can view event attendees" ON public.event_attendees;

CREATE POLICY "Authenticated users can view event attendees"
ON public.event_attendees
FOR SELECT
TO authenticated
USING (true);

-- 10. Restrict profile_interests to authenticated users
DROP POLICY IF EXISTS "Anyone can view profile interests" ON public.profile_interests;

CREATE POLICY "Authenticated users can view profile interests"
ON public.profile_interests
FOR SELECT
TO authenticated
USING (true);

-- 11. Restrict post_likes to authenticated users
DROP POLICY IF EXISTS "Anyone can view post likes" ON public.post_likes;

CREATE POLICY "Authenticated users can view post likes"
ON public.post_likes
FOR SELECT
TO authenticated
USING (true);

-- 12. Restrict post_reactions to authenticated users
DROP POLICY IF EXISTS "Anyone can view post reactions" ON public.post_reactions;

CREATE POLICY "Authenticated users can view post reactions"
ON public.post_reactions
FOR SELECT
TO authenticated
USING (true);

-- 13. Restrict comment_likes to authenticated users
DROP POLICY IF EXISTS "Anyone can view comment likes" ON public.comment_likes;

CREATE POLICY "Authenticated users can view comment likes"
ON public.comment_likes
FOR SELECT
TO authenticated
USING (true);

-- 14. Restrict followers table
DROP POLICY IF EXISTS "Users can view all followers" ON public.followers;

CREATE POLICY "Authenticated users can view followers"
ON public.followers
FOR SELECT
TO authenticated
USING (true);

-- 15. Drop and recreate the public view with better security
DROP VIEW IF EXISTS public.user_public_view;

-- Create a more secure view that only shows non-sensitive data
CREATE VIEW public.user_public_view
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.name,
  p.age,
  p.gender,
  p.location,
  p.profile_image,
  p.verified,
  p.kurdistan_region,
  p.bio,
  p.occupation,
  p.interests,
  p.hobbies,
  p.languages
FROM profiles p;

-- Add RLS policy for the view
ALTER VIEW public.user_public_view SET (security_invoker = true);

-- 16. Restrict social_login_providers to admins only
DROP POLICY IF EXISTS "Anyone can view social providers" ON public.social_login_providers;

CREATE POLICY "Only admins can view social providers"
ON public.social_login_providers
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'super_admin'
  )
);

COMMENT ON POLICY "Authenticated users can view profiles" ON public.profiles IS 
'Requires authentication to view any profile data. Prevents public scraping of user information.';