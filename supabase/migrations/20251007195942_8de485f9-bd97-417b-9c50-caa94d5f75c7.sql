-- ============================================================================
-- PHASE 1: Create New Normalized Schema
-- ============================================================================

-- 1. Create profile_details table for extended personal information
CREATE TABLE IF NOT EXISTS public.profile_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  height VARCHAR,
  body_type VARCHAR,
  ethnicity VARCHAR,
  religion VARCHAR,
  political_views VARCHAR,
  education VARCHAR,
  company VARCHAR,
  smoking VARCHAR,
  drinking VARCHAR,
  dietary_preferences VARCHAR,
  zodiac_sign VARCHAR,
  personality_type VARCHAR,
  sleep_schedule VARCHAR,
  travel_frequency VARCHAR,
  communication_style VARCHAR,
  love_language VARCHAR,
  have_pets VARCHAR,
  work_environment VARCHAR,
  family_closeness VARCHAR,
  ideal_date VARCHAR,
  career_ambitions VARCHAR,
  work_life_balance VARCHAR,
  dream_vacation VARCHAR,
  financial_habits VARCHAR,
  children_status VARCHAR,
  friendship_style VARCHAR,
  favorite_quote VARCHAR,
  morning_routine VARCHAR,
  evening_routine VARCHAR,
  favorite_season VARCHAR,
  ideal_weather VARCHAR,
  dream_home VARCHAR,
  transportation_preference VARCHAR,
  charity_involvement VARCHAR,
  favorite_memory VARCHAR,
  decision_making_style VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

-- 2. Create profile_preferences table for dating/relationship preferences
CREATE TABLE IF NOT EXISTS public.profile_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship_goals VARCHAR,
  want_children VARCHAR,
  kurdistan_region VARCHAR,
  exercise_habits VARCHAR,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id)
);

-- 3. Create interests lookup table
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,
  category VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create profile_interests junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.profile_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, interest_id)
);

-- ============================================================================
-- PHASE 2: Migrate Data from Old Profiles Structure
-- ============================================================================

-- Migrate extended personal info to profile_details
INSERT INTO public.profile_details (
  profile_id, height, body_type, ethnicity, religion, political_views,
  education, company, smoking, drinking, dietary_preferences, zodiac_sign,
  personality_type, sleep_schedule, travel_frequency, communication_style,
  love_language, have_pets, work_environment, family_closeness, ideal_date,
  career_ambitions, work_life_balance, dream_vacation, financial_habits,
  children_status, friendship_style, favorite_quote, morning_routine,
  evening_routine, favorite_season, ideal_weather, dream_home,
  transportation_preference, charity_involvement, favorite_memory,
  decision_making_style
)
SELECT 
  id, height, body_type, ethnicity, religion, political_views,
  education, company, smoking, drinking, dietary_preferences, zodiac_sign,
  personality_type, sleep_schedule, travel_frequency, communication_style,
  love_language, have_pets, work_environment, family_closeness, ideal_date,
  career_ambitions, work_life_balance, dream_vacation, financial_habits,
  children_status, friendship_style, favorite_quote, morning_routine,
  evening_routine, favorite_season, ideal_weather, dream_home,
  transportation_preference, charity_involvement, favorite_memory,
  decision_making_style
FROM public.profiles
ON CONFLICT (profile_id) DO NOTHING;

-- Migrate preferences to profile_preferences
INSERT INTO public.profile_preferences (
  profile_id, relationship_goals, want_children, kurdistan_region, exercise_habits
)
SELECT 
  id, relationship_goals, want_children, kurdistan_region, exercise_habits
FROM public.profiles
ON CONFLICT (profile_id) DO NOTHING;

-- Migrate interests (values, interests, hobbies, languages, etc.) to interests table
INSERT INTO public.interests (name, category)
SELECT DISTINCT unnest(values) as name, 'values' as category FROM public.profiles WHERE values IS NOT NULL
UNION
SELECT DISTINCT unnest(interests) as name, 'interests' as category FROM public.profiles WHERE interests IS NOT NULL
UNION
SELECT DISTINCT unnest(hobbies) as name, 'hobbies' as category FROM public.profiles WHERE hobbies IS NOT NULL
UNION
SELECT DISTINCT unnest(languages) as name, 'languages' as category FROM public.profiles WHERE languages IS NOT NULL
UNION
SELECT DISTINCT unnest(creative_pursuits) as name, 'creative_pursuits' as category FROM public.profiles WHERE creative_pursuits IS NOT NULL
UNION
SELECT DISTINCT unnest(weekend_activities) as name, 'weekend_activities' as category FROM public.profiles WHERE weekend_activities IS NOT NULL
ON CONFLICT (name) DO NOTHING;

-- Migrate profile_interests relationships
INSERT INTO public.profile_interests (profile_id, interest_id)
SELECT DISTINCT p.id, i.id
FROM public.profiles p
CROSS JOIN LATERAL (
  SELECT unnest(COALESCE(values, ARRAY[]::text[])) || 
         unnest(COALESCE(interests, ARRAY[]::text[])) || 
         unnest(COALESCE(hobbies, ARRAY[]::text[])) || 
         unnest(COALESCE(languages, ARRAY[]::text[])) ||
         unnest(COALESCE(creative_pursuits, ARRAY[]::text[])) ||
         unnest(COALESCE(weekend_activities, ARRAY[]::text[])) as interest_name
) interests_flat
JOIN public.interests i ON i.name = interests_flat.interest_name
ON CONFLICT (profile_id, interest_id) DO NOTHING;

-- ============================================================================
-- PHASE 3: Fix Foreign Key References
-- ============================================================================

-- Fix conversation_metadata to reference profiles instead of direct user references
-- (already correctly references profiles, no change needed)

-- Fix reported_messages foreign keys
-- (already correctly set up, no change needed)

-- Fix ai_conversation_insights foreign keys
-- (already correctly set up, no change needed)

-- ============================================================================
-- PHASE 4: Create user_public_view for Simplified Queries
-- ============================================================================

CREATE OR REPLACE VIEW public.user_public_view AS
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

-- ============================================================================
-- PHASE 5: Add Critical Performance Indexes
-- ============================================================================

-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_last_active ON public.profiles(last_active DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified) WHERE verified = true;
CREATE INDEX IF NOT EXISTS idx_profiles_age ON public.profiles(age);
CREATE INDEX IF NOT EXISTS idx_profiles_gender ON public.profiles(gender);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient ON public.messages(sender_id, recipient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_unread ON public.messages(recipient_id, read) WHERE read = false;

-- Posts indexes  
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_user_created ON public.posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_engagement ON public.posts(likes_count DESC, comments_count DESC, created_at DESC);

-- Likes indexes
CREATE INDEX IF NOT EXISTS idx_likes_liker_created ON public.likes(liker_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_likes_likee ON public.likes(likee_id);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_user1 ON public.matches(user1_id, matched_at DESC);
CREATE INDEX IF NOT EXISTS idx_matches_user2 ON public.matches(user2_id, matched_at DESC);

-- Profile relationships indexes
CREATE INDEX IF NOT EXISTS idx_profile_details_profile ON public.profile_details(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_preferences_profile ON public.profile_preferences(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_interests_profile ON public.profile_interests(profile_id);
CREATE INDEX IF NOT EXISTS idx_profile_interests_interest ON public.profile_interests(interest_id);
CREATE INDEX IF NOT EXISTS idx_interests_category ON public.interests(category);

-- ============================================================================
-- PHASE 6: Set Up RLS Policies for New Tables
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE public.profile_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_interests ENABLE ROW LEVEL SECURITY;

-- Profile details policies
CREATE POLICY "Anyone can view profile details"
ON public.profile_details FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile details"
ON public.profile_details FOR UPDATE
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own profile details"
ON public.profile_details FOR INSERT
WITH CHECK (profile_id = auth.uid());

-- Profile preferences policies
CREATE POLICY "Anyone can view profile preferences"
ON public.profile_preferences FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile preferences"
ON public.profile_preferences FOR UPDATE
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert own profile preferences"
ON public.profile_preferences FOR INSERT
WITH CHECK (profile_id = auth.uid());

-- Interests policies (read-only for users)
CREATE POLICY "Anyone can view interests"
ON public.interests FOR SELECT
USING (true);

-- Profile interests policies
CREATE POLICY "Anyone can view profile interests"
ON public.profile_interests FOR SELECT
USING (true);

CREATE POLICY "Users can manage own profile interests"
ON public.profile_interests FOR ALL
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- ============================================================================
-- PHASE 7: Create Triggers for Updated_at Columns
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profile_details_updated_at
BEFORE UPDATE ON public.profile_details
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profile_preferences_updated_at
BEFORE UPDATE ON public.profile_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();