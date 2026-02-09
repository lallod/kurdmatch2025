
-- Add travel mode columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS travel_location TEXT,
ADD COLUMN IF NOT EXISTS travel_mode_active BOOLEAN NOT NULL DEFAULT false;
