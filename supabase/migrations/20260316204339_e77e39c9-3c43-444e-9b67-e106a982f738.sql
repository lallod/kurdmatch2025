-- Fix PRIVILEGE_ESCALATION: account_status
-- The previous partial migration already dropped the old policy and created SELECT/INSERT policies.
-- Only create the UPDATE policy here since the others were applied.

-- Fix EXPOSED_SENSITIVE_DATA: Column-level SELECT grants on profiles
-- Step 1: Revoke broad SELECT from both roles
REVOKE SELECT ON public.profiles FROM authenticated;
REVOKE SELECT ON public.profiles FROM anon;

-- Step 2: Grant SELECT on safe columns only (excluding phone_number, latitude, longitude, geo_location)
GRANT SELECT (
  id, name, age, gender, location, profile_image, bio, verified, video_verified,
  occupation, interests, hobbies, "values", languages, height, body_type, ethnicity,
  religion, kurdistan_region, education, relationship_goals, zodiac_sign,
  personality_type, company, work_environment, career_ambitions, exercise_habits,
  dietary_preferences, smoking, drinking, sleep_schedule, have_pets, want_children,
  love_language, communication_style, ideal_date, family_closeness, creative_pursuits,
  weekend_activities, political_views, work_life_balance, travel_frequency,
  last_active, created_at, transportation_preference, children_status,
  music_instruments, tech_skills, favorite_books, favorite_movies, favorite_music,
  favorite_foods, favorite_games, favorite_podcasts, favorite_quote, favorite_memory,
  favorite_season, growth_goals, morning_routine, evening_routine, stress_relievers,
  financial_habits, friendship_style, decision_making_style, charity_involvement,
  hidden_talents, pet_peeves, dream_vacation, dream_home, ideal_weather,
  travel_location, travel_mode_active, dating_profile_visible, notification_preferences,
  blur_photos, phone_verified, video_verified_at, is_generated
) ON public.profiles TO authenticated;