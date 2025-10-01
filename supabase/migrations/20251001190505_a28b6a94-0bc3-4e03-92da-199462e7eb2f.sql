-- Phase 1: Delete all auth users and disable RLS for mock data system

-- Step 1: Delete all auth.users (6,220 records)
-- This removes all authentication records since we're keeping mock profiles only
DELETE FROM auth.users;

-- Step 2: Disable RLS on all tables since we're now using mock data
-- This simplifies the system and removes auth.uid() dependencies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE likes DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE followers DISABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE events DISABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees DISABLE ROW LEVEL SECURITY;
ALTER TABLE stories DISABLE ROW LEVEL SECURITY;
ALTER TABLE story_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_actions DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_usage DISABLE ROW LEVEL SECURITY;
ALTER TABLE muted_conversations DISABLE ROW LEVEL SECURITY;

-- Step 3: Update database functions to work without auth.uid()
-- These functions will now accept user_id as a parameter instead of getting it from auth

-- Update can_perform_action function
CREATE OR REPLACE FUNCTION can_perform_action(
  user_uuid uuid,
  action_type varchar,
  OUT can_perform boolean,
  OUT remaining_count integer,
  OUT is_premium boolean
)
RETURNS record
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_record user_subscriptions;
  usage_record daily_usage;
  daily_limit INTEGER;
  current_count INTEGER;
BEGIN
  -- Get user subscription
  SELECT * INTO subscription_record
  FROM user_subscriptions
  WHERE user_id = user_uuid 
  AND (expires_at IS NULL OR expires_at > now())
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Default to free if no subscription found
  IF subscription_record IS NULL THEN
    is_premium := FALSE;
  ELSE
    is_premium := subscription_record.subscription_type != 'free';
  END IF;
  
  -- Get today's usage
  usage_record := get_or_create_daily_usage(user_uuid);
  
  -- Set limits and current count based on action type
  CASE action_type
    WHEN 'like' THEN
      daily_limit := CASE WHEN is_premium THEN 9999 ELSE 50 END;
      current_count := usage_record.likes_count;
    WHEN 'super_like' THEN
      daily_limit := CASE WHEN is_premium THEN 10 ELSE 1 END;
      current_count := usage_record.super_likes_count;
    WHEN 'rewind' THEN
      daily_limit := CASE WHEN is_premium THEN 5 ELSE 0 END;
      current_count := usage_record.rewinds_count;
    WHEN 'boost' THEN
      daily_limit := CASE WHEN is_premium THEN 3 ELSE 0 END;
      current_count := usage_record.boosts_count;
    ELSE
      daily_limit := 0;
      current_count := 0;
  END CASE;
  
  can_perform := current_count < daily_limit;
  remaining_count := GREATEST(0, daily_limit - current_count);
END;
$$;

-- Step 4: Add comment to document the system change
COMMENT ON DATABASE postgres IS 'Mock data system - uses 502 profiles without auth.users. RLS disabled for demo purposes.';