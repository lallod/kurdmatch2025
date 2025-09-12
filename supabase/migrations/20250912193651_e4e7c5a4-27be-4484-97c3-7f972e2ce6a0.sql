-- Make essential profile fields required and add defaults for existing users

-- First, update existing records with default values for required fields
UPDATE public.profiles 
SET 
  occupation = COALESCE(occupation, 'Not specified'),
  bio = COALESCE(bio, 'Tell us about yourself...'),
  profile_image = COALESCE(profile_image, 'https://placehold.co/400'),
  height = COALESCE(height, '5''6"'),
  body_type = COALESCE(body_type, 'Average'),
  ethnicity = COALESCE(ethnicity, 'Prefer not to say'),
  religion = COALESCE(religion, 'Prefer not to say'),
  kurdistan_region = COALESCE(kurdistan_region, 'South-Kurdistan'),
  education = COALESCE(education, 'Not specified'),
  relationship_goals = COALESCE(relationship_goals, 'Looking for something serious'),
  want_children = COALESCE(want_children, 'Open to children'),
  exercise_habits = COALESCE(exercise_habits, 'Sometimes'),
  values = COALESCE(values, ARRAY['Family', 'Honesty', 'Respect']),
  interests = COALESCE(interests, ARRAY['Music', 'Travel', 'Food']),
  hobbies = COALESCE(hobbies, ARRAY['Reading', 'Movies']),
  languages = COALESCE(languages, ARRAY['Kurdish', 'English'])
WHERE 
  occupation IS NULL 
  OR bio IS NULL 
  OR profile_image IS NULL 
  OR height IS NULL 
  OR body_type IS NULL 
  OR ethnicity IS NULL 
  OR religion IS NULL 
  OR kurdistan_region IS NULL 
  OR education IS NULL 
  OR relationship_goals IS NULL 
  OR want_children IS NULL 
  OR exercise_habits IS NULL 
  OR values IS NULL 
  OR interests IS NULL 
  OR hobbies IS NULL 
  OR languages IS NULL;

-- Now make the essential fields NOT NULL
ALTER TABLE public.profiles 
ALTER COLUMN occupation SET NOT NULL,
ALTER COLUMN bio SET NOT NULL,
ALTER COLUMN profile_image SET NOT NULL,
ALTER COLUMN height SET NOT NULL,
ALTER COLUMN body_type SET NOT NULL,
ALTER COLUMN ethnicity SET NOT NULL,
ALTER COLUMN religion SET NOT NULL,
ALTER COLUMN kurdistan_region SET NOT NULL,
ALTER COLUMN education SET NOT NULL,
ALTER COLUMN relationship_goals SET NOT NULL,
ALTER COLUMN want_children SET NOT NULL,
ALTER COLUMN exercise_habits SET NOT NULL;

-- Set defaults for required fields for new users
ALTER TABLE public.profiles 
ALTER COLUMN occupation SET DEFAULT 'Not specified',
ALTER COLUMN bio SET DEFAULT 'Tell us about yourself...',
ALTER COLUMN profile_image SET DEFAULT 'https://placehold.co/400',
ALTER COLUMN height SET DEFAULT '5''6"',
ALTER COLUMN body_type SET DEFAULT 'Average',
ALTER COLUMN ethnicity SET DEFAULT 'Prefer not to say',
ALTER COLUMN religion SET DEFAULT 'Prefer not to say',
ALTER COLUMN kurdistan_region SET DEFAULT 'South-Kurdistan',
ALTER COLUMN education SET DEFAULT 'Not specified',
ALTER COLUMN relationship_goals SET DEFAULT 'Looking for something serious',
ALTER COLUMN want_children SET DEFAULT 'Open to children',
ALTER COLUMN exercise_habits SET DEFAULT 'Sometimes';

-- Add check constraints to ensure minimum quality
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_bio_length_check CHECK (char_length(bio) >= 20),
ADD CONSTRAINT profiles_interests_min_check CHECK (array_length(interests, 1) >= 3),
ADD CONSTRAINT profiles_hobbies_min_check CHECK (array_length(hobbies, 1) >= 2),
ADD CONSTRAINT profiles_values_min_check CHECK (array_length(values, 1) >= 3),
ADD CONSTRAINT profiles_languages_min_check CHECK (array_length(languages, 1) >= 1);

-- Create function to check if profile is complete
CREATE OR REPLACE FUNCTION public.is_profile_complete(profile_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  profile_record RECORD;
  photo_count INTEGER;
BEGIN
  -- Get profile data
  SELECT * INTO profile_record
  FROM profiles 
  WHERE id = profile_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Check if user has at least one photo
  SELECT COUNT(*) INTO photo_count
  FROM photos 
  WHERE profile_id = profile_record.id;
  
  -- Check all required fields and constraints
  RETURN (
    profile_record.name IS NOT NULL AND profile_record.name != '' AND
    profile_record.age IS NOT NULL AND profile_record.age >= 18 AND
    profile_record.location IS NOT NULL AND profile_record.location != '' AND
    profile_record.occupation IS NOT NULL AND profile_record.occupation != 'Not specified' AND
    profile_record.bio IS NOT NULL AND char_length(profile_record.bio) >= 20 AND profile_record.bio != 'Tell us about yourself...' AND
    profile_record.profile_image IS NOT NULL AND profile_record.profile_image != '' AND
    profile_record.height IS NOT NULL AND profile_record.height != '' AND
    profile_record.body_type IS NOT NULL AND profile_record.body_type != '' AND
    profile_record.ethnicity IS NOT NULL AND profile_record.ethnicity != '' AND
    profile_record.religion IS NOT NULL AND profile_record.religion != '' AND
    profile_record.kurdistan_region IS NOT NULL AND profile_record.kurdistan_region != '' AND
    profile_record.education IS NOT NULL AND profile_record.education != 'Not specified' AND
    profile_record.relationship_goals IS NOT NULL AND profile_record.relationship_goals != '' AND
    profile_record.want_children IS NOT NULL AND profile_record.want_children != '' AND
    profile_record.exercise_habits IS NOT NULL AND profile_record.exercise_habits != '' AND
    array_length(profile_record.values, 1) >= 3 AND
    array_length(profile_record.interests, 1) >= 3 AND
    array_length(profile_record.hobbies, 1) >= 2 AND
    array_length(profile_record.languages, 1) >= 1 AND
    photo_count >= 1
  );
END;
$function$;