/**
 * Safe profile columns that can be exposed to other users.
 * NEVER use select('*') on the profiles table — it exposes phone_number, latitude, longitude, geo_location.
 */
export const SAFE_PROFILE_COLUMNS = `
  id, name, age, gender, location, profile_image, bio, verified, video_verified,
  occupation, interests, hobbies, values, languages, height, body_type, ethnicity,
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
  travel_location, travel_mode_active, dating_profile_visible
`.replace(/\s+/g, ' ').trim();

/**
 * All profile columns including PII — only for the authenticated user's own profile.
 */
export const ALL_OWN_PROFILE_COLUMNS = `${SAFE_PROFILE_COLUMNS}, phone_number, phone_verified, latitude, longitude, geo_location, notification_preferences`;
