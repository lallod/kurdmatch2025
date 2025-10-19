
-- Fix RLS for user_public_view by recreating with security_invoker
-- This ensures the view respects RLS policies of underlying tables

-- Drop the existing view
DROP VIEW IF EXISTS public.user_public_view;

-- Recreate the view with security_invoker option
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

COMMENT ON VIEW public.user_public_view IS 
'Public view of user profiles with limited information. Uses security_invoker to respect RLS policies from underlying profiles table.';
