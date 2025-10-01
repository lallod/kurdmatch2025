-- Phase 1: Convert Mock Profiles to Real Auth Users (Final Fix)

-- Step 1: Drop existing trigger to prevent conflicts during migration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Create auth.users from profiles with unique emails
DO $$
DECLARE
  profile_record RECORD;
  email_address TEXT;
  email_counter INTEGER;
BEGIN
  FOR profile_record IN SELECT * FROM profiles WHERE NOT EXISTS (SELECT 1 FROM auth.users WHERE id = profiles.id) LOOP
    email_address := LOWER(REPLACE(profile_record.name, ' ', '.')) || '@kurdmatch.com';
    email_counter := 1;
    
    WHILE EXISTS (SELECT 1 FROM auth.users WHERE email = email_address) LOOP
      email_address := LOWER(REPLACE(profile_record.name, ' ', '.')) || email_counter || '@kurdmatch.com';
      email_counter := email_counter + 1;
    END LOOP;
    
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_user_meta_data, created_at, updated_at, confirmation_token, 
      email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000'::uuid, profile_record.id, 'authenticated', 'authenticated',
      email_address, crypt('KurdMatch2025!', gen_salt('bf')), now(),
      jsonb_build_object('name', profile_record.name, 'avatar_url', profile_record.profile_image),
      COALESCE(profile_record.created_at, now()), now(), '', '', '', ''
    );
  END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE muted_conversations ENABLE ROW LEVEL SECURITY;

-- Step 4: Restore auth.uid() in database functions
CREATE OR REPLACE FUNCTION can_perform_action(
  action_type varchar, OUT can_perform boolean, OUT remaining_count integer, OUT is_premium boolean
)
RETURNS record LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  subscription_record user_subscriptions;
  usage_record daily_usage;
  daily_limit INTEGER;
  current_count INTEGER;
BEGIN
  SELECT * INTO subscription_record FROM user_subscriptions
  WHERE user_id = auth.uid() AND (expires_at IS NULL OR expires_at > now())
  ORDER BY created_at DESC LIMIT 1;
  
  is_premium := CASE WHEN subscription_record IS NULL THEN FALSE
    ELSE subscription_record.subscription_type != 'free' END;
  
  usage_record := get_or_create_daily_usage(auth.uid());
  
  CASE action_type
    WHEN 'like' THEN daily_limit := CASE WHEN is_premium THEN 9999 ELSE 50 END; current_count := usage_record.likes_count;
    WHEN 'super_like' THEN daily_limit := CASE WHEN is_premium THEN 10 ELSE 1 END; current_count := usage_record.super_likes_count;
    WHEN 'rewind' THEN daily_limit := CASE WHEN is_premium THEN 5 ELSE 0 END; current_count := usage_record.rewinds_count;
    WHEN 'boost' THEN daily_limit := CASE WHEN is_premium THEN 3 ELSE 0 END; current_count := usage_record.boosts_count;
    ELSE daily_limit := 0; current_count := 0;
  END CASE;
  
  can_perform := current_count < daily_limit;
  remaining_count := GREATEST(0, daily_limit - current_count);
END;
$$;

-- Step 5: Create profile auto-creation trigger for future signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, age, location, occupation, bio, profile_image, gender)
  VALUES (
    NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'New User'), 18, 'Kurdistan',
    'Not specified', 'Tell us about yourself...', 
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://placehold.co/400'),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'other')
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();