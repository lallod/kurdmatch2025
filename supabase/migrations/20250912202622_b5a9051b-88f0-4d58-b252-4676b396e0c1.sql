-- Create function to enrich profiles with Kurdish test data
CREATE OR REPLACE FUNCTION public.enrich_profiles_with_test_data()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_record RECORD;
  enriched_count INTEGER := 0;
  random_gender TEXT;
  random_name TEXT;
  random_age INTEGER;
  kurdish_male_names TEXT[] := ARRAY['Azad', 'Dilshad', 'Rojhat', 'Heval', 'Kawa', 'Rizgar', 'Sherko', 'Baran', 'Soran', 'Hawar'];
  kurdish_female_names TEXT[] := ARRAY['Rojin', 'Berfin', 'Zilan', 'Shilan', 'Avesta', 'Berivan', 'Runak', 'Helin', 'Nazdar', 'Delal'];
  kurdish_surnames TEXT[] := ARRAY['Ahmadi', 'Barzani', 'Talabani', 'Kurdi', 'Shekaki', 'Zaza', 'Hawrami', 'Dizayi', 'Bajalan', 'Zangana'];
  kurdish_locations TEXT[] := ARRAY['Erbil, Kurdistan', 'Sulaymaniyah, Kurdistan', 'Duhok, Kurdistan', 'Halabja, Kurdistan', 'Qamishli, Kurdistan'];
  kurdish_regions TEXT[] := ARRAY['South-Kurdistan', 'West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan'];
  occupations TEXT[] := ARRAY['Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Artist', 'Lawyer', 'Marketing Manager'];
  heights TEXT[] := ARRAY['5''2"', '5''4"', '5''6"', '5''8"', '5''10"', '6''0"', '6''2"'];
  body_types TEXT[] := ARRAY['Slim', 'Average', 'Athletic', 'Curvy', 'Plus-size'];
  ethnicities TEXT[] := ARRAY['Kurdish', 'Middle Eastern', 'Mixed'];
  religions TEXT[] := ARRAY['Muslim', 'Christian', 'Yazidi', 'Secular', 'Spiritual'];
BEGIN
  -- Loop through all existing profiles
  FOR profile_record IN 
    SELECT id, name, age, gender FROM profiles
  LOOP
    -- Determine gender
    random_gender := CASE 
      WHEN profile_record.gender IS NULL OR profile_record.gender = 'null' 
      THEN CASE WHEN random() > 0.5 THEN 'male' ELSE 'female' END
      ELSE profile_record.gender
    END;
    
    -- Generate Kurdish name
    random_name := CASE 
      WHEN profile_record.name IS NULL OR profile_record.name = 'New User' OR profile_record.name = 'null'
      THEN CASE 
        WHEN random_gender = 'male' 
        THEN kurdish_male_names[1 + floor(random() * array_length(kurdish_male_names, 1))] || ' ' || 
             kurdish_surnames[1 + floor(random() * array_length(kurdish_surnames, 1))]
        ELSE kurdish_female_names[1 + floor(random() * array_length(kurdish_female_names, 1))] || ' ' || 
             kurdish_surnames[1 + floor(random() * array_length(kurdish_surnames, 1))]
      END
      ELSE profile_record.name
    END;
    
    -- Generate age
    random_age := CASE 
      WHEN profile_record.age IS NULL OR profile_record.age < 18
      THEN 22 + floor(random() * 30)
      ELSE profile_record.age
    END;
    
    -- Update profile with Kurdish test data
    UPDATE profiles SET
      name = random_name,
      age = random_age,
      gender = random_gender,
      verified = random() > 0.2,
      last_active = now() - (random() * interval '7 days'),
      location = kurdish_locations[1 + floor(random() * array_length(kurdish_locations, 1))],
      kurdistan_region = kurdish_regions[1 + floor(random() * array_length(kurdish_regions, 1))],
      occupation = occupations[1 + floor(random() * array_length(occupations, 1))],
      height = heights[1 + floor(random() * array_length(heights, 1))],
      body_type = body_types[1 + floor(random() * array_length(body_types, 1))],
      ethnicity = ethnicities[1 + floor(random() * array_length(ethnicities, 1))],
      religion = religions[1 + floor(random() * array_length(religions, 1))],
      education = CASE floor(random() * 5)
        WHEN 0 THEN 'High School'
        WHEN 1 THEN 'Some College'
        WHEN 2 THEN 'Bachelor''s Degree'
        WHEN 3 THEN 'Master''s Degree'  
        ELSE 'PhD'
      END,
      relationship_goals = CASE floor(random() * 4)
        WHEN 0 THEN 'Looking for something serious'
        WHEN 1 THEN 'Open to dating'
        WHEN 2 THEN 'Looking for friends'
        ELSE 'Exploring options'
      END,
      want_children = CASE floor(random() * 4)
        WHEN 0 THEN 'Want children'
        WHEN 1 THEN 'Open to children'
        WHEN 2 THEN 'Don''t want children'
        ELSE 'Have children'
      END,
      exercise_habits = CASE floor(random() * 4)
        WHEN 0 THEN 'Daily'
        WHEN 1 THEN 'Often'
        WHEN 2 THEN 'Sometimes'
        ELSE 'Rarely'
      END,
      values = ARRAY['Family', 'Kurdish heritage', 'Honesty', 'Community'],
      interests = ARRAY['Kurdish music', 'Poetry', 'Literature', 'Cultural events'],
      hobbies = ARRAY['Reading', 'Dancing', 'Cooking', 'Photography'],
      languages = ARRAY['Kurdish', 'English', 'Arabic'],
      bio = 'Proud Kurdish individual who values family, heritage, and building meaningful connections. Looking for someone who shares similar values and appreciates our rich culture.',
      smoking = CASE floor(random() * 3)
        WHEN 0 THEN 'Never'
        WHEN 1 THEN 'Socially'
        ELSE 'Regularly'
      END,
      drinking = CASE floor(random() * 4)
        WHEN 0 THEN 'Never'
        WHEN 1 THEN 'Rarely'
        WHEN 2 THEN 'Socially'
        ELSE 'Regularly'
      END,
      dietary_preferences = CASE floor(random() * 3)
        WHEN 0 THEN 'Halal'
        WHEN 1 THEN 'Vegetarian'
        ELSE 'Omnivore'
      END
    WHERE id = profile_record.id;
    
    enriched_count := enriched_count + 1;
  END LOOP;
  
  RETURN enriched_count;
END;
$$;

-- Execute the function to enrich profiles
SELECT public.enrich_profiles_with_test_data();