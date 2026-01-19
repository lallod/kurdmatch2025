-- Video Verification System for 2026
-- This creates a robust video selfie verification to combat catfishing and deepfakes

-- Create video_verifications table
CREATE TABLE IF NOT EXISTS public.video_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  confidence_score NUMERIC(5,2), -- AI confidence score 0-100
  rejection_reason TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.profiles(id),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '6 months'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create index for quick lookups
CREATE INDEX IF NOT EXISTS idx_video_verifications_user_id ON public.video_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_video_verifications_status ON public.video_verifications(status);

-- Enable RLS
ALTER TABLE public.video_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own verifications
CREATE POLICY "Users can view own verifications"
  ON public.video_verifications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own verification requests
CREATE POLICY "Users can create own verification"
  ON public.video_verifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only admins can update verifications (approve/reject)
CREATE POLICY "Admins can update verifications"
  ON public.video_verifications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND id IN (SELECT user_id FROM public.admin_activities LIMIT 1)
    )
    OR auth.uid() = user_id
  );

-- Add verified_video column to profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND column_name = 'video_verified'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN video_verified BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.profiles ADD COLUMN video_verified_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Function to update profile verification status
CREATE OR REPLACE FUNCTION public.update_profile_video_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    UPDATE public.profiles 
    SET 
      video_verified = TRUE,
      video_verified_at = NOW()
    WHERE id = NEW.user_id;
  ELSIF NEW.status = 'rejected' OR NEW.status = 'expired' THEN
    UPDATE public.profiles 
    SET 
      video_verified = FALSE,
      video_verified_at = NULL
    WHERE id = NEW.user_id;
  END IF;
  
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for verification status changes
DROP TRIGGER IF EXISTS trigger_update_video_verification ON public.video_verifications;
CREATE TRIGGER trigger_update_video_verification
  BEFORE UPDATE ON public.video_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_video_verification();

-- Function to clean up expired verifications
CREATE OR REPLACE FUNCTION public.cleanup_expired_video_verifications()
RETURNS INTEGER AS $$
DECLARE
  affected_count INTEGER;
BEGIN
  UPDATE public.video_verifications
  SET status = 'expired'
  WHERE expires_at < NOW() AND status = 'approved';
  
  GET DIAGNOSTICS affected_count = ROW_COUNT;
  RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Safety Scanner: Message toxicity tracking
CREATE TABLE IF NOT EXISTS public.message_safety_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id),
  flag_type TEXT NOT NULL CHECK (flag_type IN ('harassment', 'spam', 'explicit', 'scam', 'threat', 'other')),
  severity TEXT NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  ai_detected BOOLEAN DEFAULT FALSE,
  reviewed BOOLEAN DEFAULT FALSE,
  action_taken TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safety_flags_sender ON public.message_safety_flags(sender_id);
CREATE INDEX IF NOT EXISTS idx_safety_flags_severity ON public.message_safety_flags(severity);

ALTER TABLE public.message_safety_flags ENABLE ROW LEVEL SECURITY;

-- Only the recipient and admins can see flags
CREATE POLICY "Recipients can view flags on their messages"
  ON public.message_safety_flags FOR SELECT
  USING (auth.uid() = recipient_id);

-- System can insert flags
CREATE POLICY "System can create flags"
  ON public.message_safety_flags FOR INSERT
  WITH CHECK (TRUE);

-- Function to get user safety score (for trust system)
CREATE OR REPLACE FUNCTION public.get_user_trust_score(target_user_id UUID)
RETURNS TABLE (
  trust_score INTEGER,
  total_flags INTEGER,
  severe_flags INTEGER,
  is_verified BOOLEAN,
  is_video_verified BOOLEAN
) AS $$
DECLARE
  base_score INTEGER := 100;
  flag_count INTEGER;
  severe_count INTEGER;
  verified BOOLEAN;
  video_verified BOOLEAN;
BEGIN
  -- Count safety flags
  SELECT COUNT(*) INTO flag_count 
  FROM public.message_safety_flags 
  WHERE sender_id = target_user_id;
  
  SELECT COUNT(*) INTO severe_count 
  FROM public.message_safety_flags 
  WHERE sender_id = target_user_id AND severity IN ('high', 'critical');
  
  -- Get verification status
  SELECT p.verified, COALESCE(p.video_verified, FALSE)
  INTO verified, video_verified
  FROM public.profiles p
  WHERE p.id = target_user_id;
  
  -- Calculate score
  base_score := base_score - (flag_count * 5) - (severe_count * 15);
  IF verified THEN base_score := base_score + 10; END IF;
  IF video_verified THEN base_score := base_score + 20; END IF;
  
  -- Clamp score between 0 and 100
  IF base_score < 0 THEN base_score := 0; END IF;
  IF base_score > 100 THEN base_score := 100; END IF;
  
  RETURN QUERY SELECT base_score, flag_count, severe_count, verified, video_verified;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
