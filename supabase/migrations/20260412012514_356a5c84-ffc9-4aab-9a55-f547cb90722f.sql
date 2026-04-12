-- Helper function to check field visibility
CREATE OR REPLACE FUNCTION public.is_field_visible(p_profile_id UUID, p_field_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_visible FROM public.profile_visibility_settings 
     WHERE user_id = p_profile_id AND field_name = p_field_name),
    true
  );
$$;

-- Profile visibility enforcement view
CREATE OR REPLACE VIEW public.visible_profile_details
WITH (security_invoker = true)
AS
SELECT
  pd.id,
  pd.profile_id,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'height'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.height END AS height,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'body_type'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.body_type END AS body_type,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'ethnicity'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.ethnicity END AS ethnicity,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'education'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.education END AS education,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'company'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.company END AS company,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'religion'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.religion END AS religion,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'political_views'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.political_views END AS political_views,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'drinking'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.drinking END AS drinking,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'smoking'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.smoking END AS smoking,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'dietary_preferences'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.dietary_preferences END AS dietary_preferences,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'sleep_schedule'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.sleep_schedule END AS sleep_schedule,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'zodiac_sign'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.zodiac_sign END AS zodiac_sign,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'personality_type'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.personality_type END AS personality_type,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'love_language'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.love_language END AS love_language,
  CASE WHEN NOT public.is_field_visible(pd.profile_id, 'communication_style'::text) AND pd.profile_id != auth.uid() THEN NULL ELSE pd.communication_style END AS communication_style,
  pd.have_pets,
  pd.travel_frequency,
  pd.work_environment,
  pd.family_closeness,
  pd.ideal_date,
  pd.career_ambitions,
  pd.work_life_balance,
  pd.dream_vacation,
  pd.financial_habits,
  pd.children_status,
  pd.friendship_style,
  pd.favorite_quote,
  pd.morning_routine,
  pd.evening_routine,
  pd.favorite_season,
  pd.ideal_weather,
  pd.dream_home,
  pd.transportation_preference,
  pd.charity_involvement,
  pd.favorite_memory,
  pd.decision_making_style,
  pd.created_at,
  pd.updated_at
FROM public.profile_details pd;

-- Move uuid-ossp to extensions schema (postgis doesn't support SET SCHEMA)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp' AND extnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')) THEN
    ALTER EXTENSION "uuid-ossp" SET SCHEMA extensions;
  END IF;
END $$;