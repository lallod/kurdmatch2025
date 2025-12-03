-- Create phone_verifications table
CREATE TABLE public.phone_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add phone columns to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own verifications" 
ON public.phone_verifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verifications" 
ON public.phone_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own verifications" 
ON public.phone_verifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_phone_verifications_user_id ON public.phone_verifications(user_id);
CREATE INDEX idx_phone_verifications_phone ON public.phone_verifications(phone_number);
CREATE INDEX idx_profiles_phone ON public.profiles(phone_number);