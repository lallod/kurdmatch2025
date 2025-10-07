-- ============================================================================
-- FIX SECURITY LINTER ISSUES (Corrected)
-- ============================================================================

-- 1. Fix the user_public_view to remove SECURITY DEFINER
DROP VIEW IF EXISTS public.user_public_view;

CREATE VIEW public.user_public_view 
WITH (security_invoker = true) AS
SELECT
  p.id,
  p.name,
  p.age,
  p.gender,
  p.bio,
  p.profile_image,
  p.location,
  p.occupation,
  p.verified,
  p.last_active,
  p.latitude,
  p.longitude,
  pd.height,
  pd.body_type,
  pd.ethnicity,
  pd.religion,
  pd.education,
  pp.relationship_goals,
  pp.want_children,
  pp.kurdistan_region,
  ARRAY_AGG(DISTINCT i.name) FILTER (WHERE i.category = 'languages') as languages,
  ARRAY_AGG(DISTINCT i.name) FILTER (WHERE i.category = 'interests') as interests,
  ARRAY_AGG(DISTINCT i.name) FILTER (WHERE i.category = 'hobbies') as hobbies
FROM public.profiles p
LEFT JOIN public.profile_details pd ON p.id = pd.profile_id
LEFT JOIN public.profile_preferences pp ON p.id = pp.profile_id
LEFT JOIN public.profile_interests pi ON p.id = pi.profile_id
LEFT JOIN public.interests i ON pi.interest_id = i.id
GROUP BY p.id, pd.id, pp.id;

-- 2. Fix update_updated_at_column function to set search_path (use CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;