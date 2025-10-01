-- EMERGENCY FIX: Create missing profile for authenticated user
-- This user has auth.users record but no profile, causing all submissions to fail

INSERT INTO public.profiles (
  id, 
  name, 
  age, 
  gender, 
  location, 
  occupation, 
  bio,
  profile_image,
  kurdistan_region,
  verified,
  last_active,
  created_at
) VALUES (
  'ebd61474-e0a3-44e2-b6b2-76003985ec9d',
  'User Profile',
  25,
  'male',
  'Erbil, Kurdistan',
  'Professional',
  'Welcome to my profile!',
  'https://randomuser.me/api/portraits/men/1.jpg',
  'South-Kurdistan',
  true,
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  last_active = now();

-- Verify the profile was created
SELECT id, name, age, location FROM profiles WHERE id = 'ebd61474-e0a3-44e2-b6b2-76003985ec9d';