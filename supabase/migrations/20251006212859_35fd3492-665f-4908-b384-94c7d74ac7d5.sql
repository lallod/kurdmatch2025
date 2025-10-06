-- Create rate limiting table for messages
CREATE TABLE IF NOT EXISTS public.message_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.message_rate_limits ENABLE ROW LEVEL SECURITY;

-- Users can view their own rate limits
CREATE POLICY "Users can view own rate limits"
  ON public.message_rate_limits
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own rate limits
CREATE POLICY "Users can insert own rate limits"
  ON public.message_rate_limits
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own rate limits
CREATE POLICY "Users can update own rate limits"
  ON public.message_rate_limits
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to check and enforce message rate limits
-- Limit: 30 messages per minute
CREATE OR REPLACE FUNCTION check_message_rate_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rate_record RECORD;
  time_diff INTERVAL;
  max_messages INTEGER := 30; -- Max messages per window
  window_duration INTERVAL := '1 minute'::INTERVAL;
BEGIN
  -- Get or create rate limit record
  SELECT * INTO rate_record
  FROM message_rate_limits
  WHERE user_id = NEW.sender_id;
  
  IF NOT FOUND THEN
    -- First message, create record
    INSERT INTO message_rate_limits (user_id, message_count, window_start)
    VALUES (NEW.sender_id, 1, now());
    RETURN NEW;
  END IF;
  
  -- Calculate time since window start
  time_diff := now() - rate_record.window_start;
  
  -- If window expired, reset counter
  IF time_diff > window_duration THEN
    UPDATE message_rate_limits
    SET message_count = 1, window_start = now()
    WHERE user_id = NEW.sender_id;
    RETURN NEW;
  END IF;
  
  -- Check if rate limit exceeded
  IF rate_record.message_count >= max_messages THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before sending more messages.';
  END IF;
  
  -- Increment counter
  UPDATE message_rate_limits
  SET message_count = message_count + 1
  WHERE user_id = NEW.sender_id;
  
  RETURN NEW;
END;
$$;

-- Add trigger to enforce rate limiting on message inserts
CREATE TRIGGER enforce_message_rate_limit
  BEFORE INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION check_message_rate_limit();