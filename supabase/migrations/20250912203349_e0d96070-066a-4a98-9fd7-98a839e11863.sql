-- Update the profile enrichment function to include all specified fields and remove favorites
CREATE OR REPLACE FUNCTION public.enrich_all_profiles_with_kurdish_data()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  profile_record RECORD;
  enriched_count INTEGER := 0;
  random_gender TEXT;
  random_name TEXT;
  random_age INTEGER;
  
  -- Kurdish names
  kurdish_male_names TEXT[] := ARRAY['Azad', 'Dilshad', 'Rojhat', 'Heval', 'Kawa', 'Rizgar', 'Sherko', 'Baran', 'Soran', 'Hawar', 'Rekotyn', 'Xabat', 'Newroz', 'Chia', 'Dler', 'Karwan', 'Rawaz'];
  kurdish_female_names TEXT[] := ARRAY['Rojin', 'Berfin', 'Zilan', 'Shilan', 'Avesta', 'Berivan', 'Runak', 'Helin', 'Nazdar', 'Delal', 'Awara', 'Jina', 'Ava', 'Cihan', 'Darya', 'Govend'];
  kurdish_surnames TEXT[] := ARRAY['Ahmadi', 'Barzani', 'Talabani', 'Kurdi', 'Shekaki', 'Zaza', 'Hawrami', 'Dizayi', 'Bajalan', 'Zangana', 'Ardelan', 'Mukri', 'Sorani', 'Feyli'];
  
  -- Kurdish locations and regions
  kurdish_locations TEXT[] := ARRAY['Erbil, Kurdistan', 'Sulaymaniyah, Kurdistan', 'Duhok, Kurdistan', 'Halabja, Kurdistan', 'Qamishli, Kurdistan', 'Kobani, Kurdistan', 'Afrin, Kurdistan', 'Diyarbakir, Kurdistan', 'Sanandaj, Kurdistan', 'Mahabad, Kurdistan'];
  kurdish_regions TEXT[] := ARRAY['South-Kurdistan', 'West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan'];
  
  -- Profile attributes
  occupations TEXT[] := ARRAY['Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Artist', 'Lawyer', 'Marketing Manager', 'Nurse', 'Engineer', 'Translator', 'Journalist', 'Cultural Activist'];
  heights TEXT[] := ARRAY['5''2"', '5''3"', '5''4"', '5''5"', '5''6"', '5''7"', '5''8"', '5''9"', '5''10"', '5''11"', '6''0"', '6''1"', '6''2"'];
  body_types TEXT[] := ARRAY['Slim', 'Average', 'Athletic', 'Curvy', 'Plus-size'];
  ethnicities TEXT[] := ARRAY['Kurdish', 'Kurdish-Persian', 'Kurdish-Turkish', 'Kurdish-Arab', 'Middle Eastern', 'Mixed'];
  religions TEXT[] := ARRAY['Islam', 'Yarsanism', 'Yazidism', 'Christianity', 'Secular', 'Spiritual'];
  political_views TEXT[] := ARRAY['Progressive', 'Liberal', 'Moderate', 'Conservative', 'Kurdish Nationalist', 'Apolitical'];
  education_levels TEXT[] := ARRAY['High School', 'Some College', 'Bachelor''s Degree', 'Master''s Degree', 'PhD'];
  relationship_goals TEXT[] := ARRAY['Looking for something serious', 'Marriage', 'Friendship first', 'Taking things slow', 'Seeking connection'];
  children_statuses TEXT[] := ARRAY['Want children someday', 'Don''t want children', 'Open to children', 'Have children already'];
  exercise_habits TEXT[] := ARRAY['Regular exercise', 'Occasional exercise', 'Daily fitness routine', 'Sports enthusiast'];
  dietary_preferences TEXT[] := ARRAY['Halal', 'Vegetarian', 'Omnivore', 'Pescatarian'];
  smoking_statuses TEXT[] := ARRAY['Non-smoker', 'Social smoker', 'Regular smoker', 'Former smoker'];
  drinking_statuses TEXT[] := ARRAY['Non-drinker', 'Social drinker', 'Regular drinker', 'Former drinker'];
  sleep_schedules TEXT[] := ARRAY['Early bird', 'Night owl', 'Balanced sleeper', 'Inconsistent schedule'];
  pet_statuses TEXT[] := ARRAY['Have pets', 'Love pets but don''t have any', 'Allergic to pets', 'No pets'];
  travel_frequencies TEXT[] := ARRAY['Frequent traveler', 'Occasional traveler', 'Aspiring traveler', 'Home-oriented'];
  communication_styles TEXT[] := ARRAY['Direct and honest', 'Thoughtful and reflective', 'Expressive and emotional', 'Reserved but caring'];
  love_languages TEXT[] := ARRAY['Acts of Service', 'Words of Affirmation', 'Quality Time', 'Physical Touch', 'Receiving Gifts'];
  work_environments TEXT[] := ARRAY['Office worker', 'Remote worker', 'Hybrid schedule', 'Field work', 'Own business'];
  family_closeness_levels TEXT[] := ARRAY['Very close', 'Close', 'Moderately close', 'Not very close'];
  ideal_dates TEXT[] := ARRAY['Coffee and conversation', 'Cultural event or museum', 'Outdoor adventure', 'Home-cooked meal', 'Traditional Kurdish celebration'];
  career_ambitions TEXT[] := ARRAY['Leadership role', 'Start own business', 'Make cultural impact', 'Help my community', 'Achieve work-life balance'];
  work_life_balances TEXT[] := ARRAY['Work comes first', 'Life comes first', 'Balanced approach', 'Depends on season'];
  
  -- Kurdish cultural elements
  kurdish_values TEXT[] := ARRAY['Family', 'Kurdish heritage', 'Honesty', 'Community', 'Tradition', 'Freedom', 'Education', 'Respect', 'Cultural preservation', 'Independence'];
  kurdish_interests TEXT[] := ARRAY['Kurdish music', 'Poetry', 'Literature', 'Cultural events', 'Traditional dance', 'History', 'Politics', 'Art', 'Photography', 'Travel'];
  kurdish_hobbies TEXT[] := ARRAY['Reading', 'Dancing', 'Cooking', 'Photography', 'Hiking', 'Music', 'Writing', 'Travel', 'Learning languages', 'Volunteering'];
  creative_pursuits TEXT[] := ARRAY['Photography', 'Painting', 'Drawing', 'Writing', 'Music production', 'Graphic design', 'Pottery', 'Jewelry making'];
  weekend_activities TEXT[] := ARRAY['Family gatherings', 'Cultural events', 'Outdoor activities', 'Relaxing at home', 'Exploring new places', 'Creative projects'];
  languages TEXT[] := ARRAY['Kurdish', 'English', 'Arabic', 'Turkish', 'Persian', 'German', 'French', 'Spanish'];
  
  -- Photo URLs for Kurdish profiles
  male_photo_urls TEXT[] := ARRAY[
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/men/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg'
  ];
  female_photo_urls TEXT[] := ARRAY[
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg',
    'https://randomuser.me/api/portraits/women/4.jpg',
    'https://randomuser.me/api/portraits/women/5.jpg'
  ];
  
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
    
    -- Update profile with comprehensive Kurdish data (ALL specified fields, NO favorites)
    UPDATE profiles SET
      name = random_name,
      age = random_age,
      gender = random_gender,
      verified = random() > 0.3,
      last_active = now() - (random() * interval '7 days'),
      location = kurdish_locations[1 + floor(random() * array_length(kurdish_locations, 1))],
      kurdistan_region = kurdish_regions[1 + floor(random() * array_length(kurdish_regions, 1))],
      occupation = occupations[1 + floor(random() * array_length(occupations, 1))],
      height = heights[1 + floor(random() * array_length(heights, 1))],
      body_type = body_types[1 + floor(random() * array_length(body_types, 1))],
      ethnicity = ethnicities[1 + floor(random() * array_length(ethnicities, 1))],
      religion = religions[1 + floor(random() * array_length(religions, 1))],
      political_views = political_views[1 + floor(random() * array_length(political_views, 1))],
      education = education_levels[1 + floor(random() * array_length(education_levels, 1))],
      company = CASE floor(random() * 5)
        WHEN 0 THEN 'Tech Kurdistan'
        WHEN 1 THEN 'Kurdistan Regional Government'
        WHEN 2 THEN 'University of Kurdistan'
        WHEN 3 THEN 'Kurdish Media Group'
        ELSE 'Self-employed'
      END,
      relationship_goals = relationship_goals[1 + floor(random() * array_length(relationship_goals, 1))],
      want_children = children_statuses[1 + floor(random() * array_length(children_statuses, 1))],
      exercise_habits = exercise_habits[1 + floor(random() * array_length(exercise_habits, 1))],
      dietary_preferences = dietary_preferences[1 + floor(random() * array_length(dietary_preferences, 1))],
      smoking = smoking_statuses[1 + floor(random() * array_length(smoking_statuses, 1))],
      drinking = drinking_statuses[1 + floor(random() * array_length(drinking_statuses, 1))],
      sleep_schedule = sleep_schedules[1 + floor(random() * array_length(sleep_schedules, 1))],
      have_pets = pet_statuses[1 + floor(random() * array_length(pet_statuses, 1))],
      travel_frequency = travel_frequencies[1 + floor(random() * array_length(travel_frequencies, 1))],
      communication_style = communication_styles[1 + floor(random() * array_length(communication_styles, 1))],
      love_language = love_languages[1 + floor(random() * array_length(love_languages, 1))],
      work_environment = work_environments[1 + floor(random() * array_length(work_environments, 1))],
      family_closeness = family_closeness_levels[1 + floor(random() * array_length(family_closeness_levels, 1))],
      ideal_date = ideal_dates[1 + floor(random() * array_length(ideal_dates, 1))],
      career_ambitions = career_ambitions[1 + floor(random() * array_length(career_ambitions, 1))],
      work_life_balance = work_life_balances[1 + floor(random() * array_length(work_life_balances, 1))],
      zodiac_sign = (ARRAY['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'])[1 + floor(random() * 12)],
      personality_type = (ARRAY['INFJ', 'INFP', 'ENFJ', 'ENFP', 'INTJ', 'INTP', 'ENTJ', 'ENTP', 'ISFJ', 'ISFP', 'ESFJ', 'ESFP', 'ISTJ', 'ISTP', 'ESTJ', 'ESTP'])[1 + floor(random() * 16)],
      values = (
        SELECT array_agg(value) 
        FROM (
          SELECT unnest(kurdish_values) AS value 
          ORDER BY random() 
          LIMIT 3 + floor(random() * 4)
        ) AS selected_values
      ),
      interests = (
        SELECT array_agg(interest) 
        FROM (
          SELECT unnest(kurdish_interests) AS interest 
          ORDER BY random() 
          LIMIT 3 + floor(random() * 4)
        ) AS selected_interests
      ),
      hobbies = (
        SELECT array_agg(hobby) 
        FROM (
          SELECT unnest(kurdish_hobbies) AS hobby 
          ORDER BY random() 
          LIMIT 2 + floor(random() * 4)
        ) AS selected_hobbies
      ),
      creative_pursuits = (
        SELECT array_agg(pursuit) 
        FROM (
          SELECT unnest(creative_pursuits) AS pursuit 
          ORDER BY random() 
          LIMIT 1 + floor(random() * 3)
        ) AS selected_pursuits
      ),
      weekend_activities = (
        SELECT array_agg(activity) 
        FROM (
          SELECT unnest(weekend_activities) AS activity 
          ORDER BY random() 
          LIMIT 2 + floor(random() * 3)
        ) AS selected_activities
      ),
      languages = (
        SELECT array_agg(language) 
        FROM (
          SELECT unnest(languages) AS language 
          ORDER BY random() 
          LIMIT 2 + floor(random() * 4)
        ) AS selected_languages
      ),
      bio = 'Proud Kurdish individual who values family, heritage, and building meaningful connections. Looking for someone who shares similar values and appreciates our rich culture.',
      profile_image = CASE 
        WHEN random_gender = 'male' 
        THEN male_photo_urls[1 + floor(random() * array_length(male_photo_urls, 1))]
        ELSE female_photo_urls[1 + floor(random() * array_length(female_photo_urls, 1))]
      END
    WHERE id = profile_record.id;
    
    -- Add photos for each profile if they don't exist
    INSERT INTO photos (profile_id, url, is_primary)
    SELECT 
      profile_record.id,
      CASE 
        WHEN random_gender = 'male' 
        THEN male_photo_urls[1 + floor(random() * array_length(male_photo_urls, 1))]
        ELSE female_photo_urls[1 + floor(random() * array_length(female_photo_urls, 1))]
      END,
      true
    WHERE NOT EXISTS (
      SELECT 1 FROM photos WHERE profile_id = profile_record.id
    );
    
    enriched_count := enriched_count + 1;
    
    -- Log progress every 100 profiles
    IF enriched_count % 100 = 0 THEN
      RAISE NOTICE 'Enriched % profiles so far', enriched_count;
    END IF;
  END LOOP;
  
  RETURN enriched_count;
END;
$$;

-- Execute the function to populate all profiles with the complete field set
SELECT public.enrich_all_profiles_with_kurdish_data();