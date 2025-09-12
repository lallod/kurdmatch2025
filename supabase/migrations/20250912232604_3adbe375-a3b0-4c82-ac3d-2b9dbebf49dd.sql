-- Create user subscription tracking table
CREATE TABLE public.user_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  subscription_type VARCHAR NOT NULL DEFAULT 'free', -- 'free', 'premium', 'gold'
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create daily usage limits table
CREATE TABLE public.daily_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  likes_count INTEGER NOT NULL DEFAULT 0,
  super_likes_count INTEGER NOT NULL DEFAULT 0,
  rewinds_count INTEGER NOT NULL DEFAULT 0,
  boosts_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" 
ON public.user_subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON public.user_subscriptions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
ON public.user_subscriptions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS policies for daily_usage
CREATE POLICY "Users can view their own usage" 
ON public.daily_usage 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.daily_usage 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.daily_usage 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Function to get or create today's usage record
CREATE OR REPLACE FUNCTION public.get_or_create_daily_usage(user_uuid UUID)
RETURNS public.daily_usage
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  usage_record daily_usage;
BEGIN
  -- Try to get today's record
  SELECT * INTO usage_record
  FROM daily_usage
  WHERE user_id = user_uuid AND date = CURRENT_DATE;
  
  -- If no record exists, create one
  IF usage_record IS NULL THEN
    INSERT INTO daily_usage (user_id, date)
    VALUES (user_uuid, CURRENT_DATE)
    RETURNING * INTO usage_record;
  END IF;
  
  RETURN usage_record;
END;
$$;

-- Function to check if user can perform action
CREATE OR REPLACE FUNCTION public.can_perform_action(
  user_uuid UUID,
  action_type VARCHAR,
  OUT can_perform BOOLEAN,
  OUT remaining_count INTEGER,
  OUT is_premium BOOLEAN
)
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

-- Function to increment usage count
CREATE OR REPLACE FUNCTION public.increment_usage_count(
  user_uuid UUID,
  action_type VARCHAR
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  can_perform_result BOOLEAN;
  remaining_count INTEGER;
  is_premium BOOLEAN;
BEGIN
  -- Check if user can perform the action
  SELECT * FROM can_perform_action(user_uuid, action_type)
  INTO can_perform_result, remaining_count, is_premium;
  
  IF NOT can_perform_result THEN
    RETURN FALSE;
  END IF;
  
  -- Increment the appropriate counter
  CASE action_type
    WHEN 'like' THEN
      INSERT INTO daily_usage (user_id, date, likes_count)
      VALUES (user_uuid, CURRENT_DATE, 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        likes_count = daily_usage.likes_count + 1,
        updated_at = now();
    WHEN 'super_like' THEN
      INSERT INTO daily_usage (user_id, date, super_likes_count)
      VALUES (user_uuid, CURRENT_DATE, 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        super_likes_count = daily_usage.super_likes_count + 1,
        updated_at = now();
    WHEN 'rewind' THEN
      INSERT INTO daily_usage (user_id, date, rewinds_count)
      VALUES (user_uuid, CURRENT_DATE, 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        rewinds_count = daily_usage.rewinds_count + 1,
        updated_at = now();
    WHEN 'boost' THEN
      INSERT INTO daily_usage (user_id, date, boosts_count)
      VALUES (user_uuid, CURRENT_DATE, 1)
      ON CONFLICT (user_id, date)
      DO UPDATE SET 
        boosts_count = daily_usage.boosts_count + 1,
        updated_at = now();
  END CASE;
  
  RETURN TRUE;
END;
$$;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_daily_usage_updated_at 
    BEFORE UPDATE ON daily_usage
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();