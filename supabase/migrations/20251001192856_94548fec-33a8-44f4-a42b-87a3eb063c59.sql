-- Find a complete profile and update its auth credentials to test1@gmail.com
-- Password: Kurdistan2025!

-- Update a random complete profile to use test1@gmail.com credentials
DO $$
DECLARE
  selected_user_id uuid;
BEGIN
  -- Find a complete profile (has name, age, location, bio filled)
  SELECT p.id INTO selected_user_id
  FROM profiles p
  WHERE p.id != 'ebd61474-e0a3-44e2-b6b2-76003985ec9d'
    AND p.name IS NOT NULL 
    AND p.name != 'New User'
    AND p.age >= 18
    AND p.location IS NOT NULL
    AND p.bio IS NOT NULL
    AND p.bio != 'Tell us about yourself...'
    AND p.profile_image IS NOT NULL
  ORDER BY random()
  LIMIT 1;

  IF selected_user_id IS NOT NULL THEN
    -- Update the auth.users email and password for this user
    UPDATE auth.users
    SET 
      email = 'test1@gmail.com',
      encrypted_password = crypt('Kurdistan2025!', gen_salt('bf')),
      email_confirmed_at = now(),
      updated_at = now()
    WHERE id = selected_user_id;

    RAISE NOTICE 'Updated user ID: % to use email test1@gmail.com', selected_user_id;
  ELSE
    RAISE NOTICE 'No suitable profile found';
  END IF;
END $$;

-- Show the updated user profile details
SELECT 
  p.id,
  p.name,
  p.age,
  p.gender,
  p.location,
  p.bio,
  u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'test1@gmail.com';