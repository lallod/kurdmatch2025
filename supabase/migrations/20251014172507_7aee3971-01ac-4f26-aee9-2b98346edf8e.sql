-- Update gender field to only Male/Female
UPDATE registration_questions 
SET field_options = ARRAY['Male', 'Female']
WHERE id = 'gender' OR profile_field = 'gender';

-- Ensure profiles table has coordinate columns for distance calculation
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Add index for efficient geospatial queries
CREATE INDEX IF NOT EXISTS idx_profiles_coordinates 
ON profiles (latitude, longitude) 
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;