
-- Drop the unsafe overload that accepts user_uuid
DROP FUNCTION IF EXISTS public.can_perform_action(uuid, character varying);

-- Drop and recreate increment_usage_count to use auth.uid() instead of user_uuid
DROP FUNCTION IF EXISTS public.increment_usage_count(uuid, character varying);

CREATE OR REPLACE FUNCTION public.increment_usage_count(action_type character varying)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  can_perform_result BOOLEAN;
  remaining_count INTEGER;
  is_premium BOOLEAN;
  current_user_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN FALSE;
  END IF;

  -- Check if user can perform the action (uses the auth.uid() overload)
  SELECT * FROM can_perform_action(action_type)
  INTO can_perform_result, remaining_count, is_premium;
  
  IF NOT can_perform_result THEN
    RETURN FALSE;
  END IF;
  
  -- Increment the appropriate counter
  CASE action_type
    WHEN 'like' THEN
      INSERT INTO daily_usage (user_id, date, likes_count)
      VALUES (current_user_id, CURRENT_DATE, 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        likes_count = daily_usage.likes_count + 1,
        updated_at = now();
    WHEN 'super_like' THEN
      INSERT INTO daily_usage (user_id, date, super_likes_count)
      VALUES (current_user_id, CURRENT_DATE, 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        super_likes_count = daily_usage.super_likes_count + 1,
        updated_at = now();
    WHEN 'rewind' THEN
      INSERT INTO daily_usage (user_id, date, rewinds_count)
      VALUES (current_user_id, CURRENT_DATE, 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        rewinds_count = daily_usage.rewinds_count + 1,
        updated_at = now();
    WHEN 'boost' THEN
      INSERT INTO daily_usage (user_id, date, boosts_count)
      VALUES (current_user_id, CURRENT_DATE, 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        boosts_count = daily_usage.boosts_count + 1,
        updated_at = now();
  END CASE;
  
  RETURN TRUE;
END;
$$;
