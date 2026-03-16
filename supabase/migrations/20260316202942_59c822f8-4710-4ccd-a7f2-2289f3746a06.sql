-- Fix: Recreate views with security_invoker (the previous migration partially applied, 
-- so we ensure idempotency with CREATE OR REPLACE)

-- 1. Recreate user_public_profile with security_invoker to respect RLS
CREATE OR REPLACE VIEW public.user_public_profile
WITH (security_invoker = true)
AS
SELECT 
    id, name, age, gender, bio, occupation, profile_image,
    interests, hobbies, languages, relationship_goals,
    verified, video_verified, dating_profile_visible,
    blur_photos, last_active, created_at
FROM profiles;

-- 2. Recreate user_public_view with security_invoker to respect RLS  
CREATE OR REPLACE VIEW public.user_public_view
WITH (security_invoker = true)
AS
SELECT 
    p.id, p.name, p.age, p.gender, p.location, p.profile_image,
    p.verified, p.kurdistan_region, p.bio, p.occupation,
    p.interests, p.hobbies, p.languages
FROM profiles p;

-- 3. Revoke anon access from these views
REVOKE SELECT ON public.user_public_profile FROM anon;
REVOKE SELECT ON public.user_public_view FROM anon;