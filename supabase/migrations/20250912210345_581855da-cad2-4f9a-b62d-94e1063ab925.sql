-- Update all existing profiles with comprehensive Kurdish cultural data
UPDATE public.profiles SET
  -- Ensure all profiles have complete basic information
  height = COALESCE(height, (ARRAY['5''2"', '5''3"', '5''4"', '5''5"', '5''6"', '5''7"', '5''8"', '5''9"', '5''10"', '5''11"', '6''0"', '6''1"', '6''2"'])[1 + floor(random() * 13)]),
  body_type = COALESCE(body_type, (ARRAY['Slim', 'Average', 'Athletic', 'Curvy', 'Plus-size'])[1 + floor(random() * 5)]),
  ethnicity = COALESCE(ethnicity, (ARRAY['Kurdish', 'Kurdish-Persian', 'Kurdish-Turkish', 'Kurdish-Arab', 'Middle Eastern', 'Mixed'])[1 + floor(random() * 6)]),
  religion = COALESCE(religion, (ARRAY['Islam', 'Yarsanism', 'Yazidism', 'Christianity', 'Secular', 'Spiritual'])[1 + floor(random() * 6)]),
  
  -- Complete lifestyle information
  exercise_habits = COALESCE(exercise_habits, (ARRAY['Regular exercise', 'Occasional exercise', 'Daily fitness routine', 'Sports enthusiast'])[1 + floor(random() * 4)]),
  dietary_preferences = COALESCE(dietary_preferences, (ARRAY['Halal', 'Vegetarian', 'Omnivore', 'Pescatarian'])[1 + floor(random() * 4)]),
  smoking = COALESCE(smoking, (ARRAY['Non-smoker', 'Social smoker', 'Regular smoker', 'Former smoker'])[1 + floor(random() * 4)]),
  drinking = COALESCE(drinking, (ARRAY['Non-drinker', 'Social drinker', 'Regular drinker', 'Former drinker'])[1 + floor(random() * 4)]),
  sleep_schedule = COALESCE(sleep_schedule, (ARRAY['Early bird', 'Night owl', 'Balanced sleeper', 'Inconsistent schedule'])[1 + floor(random() * 4)]),
  have_pets = COALESCE(have_pets, (ARRAY['Have pets', 'Love pets but don''t have any', 'Allergic to pets', 'No pets'])[1 + floor(random() * 4)]),
  travel_frequency = COALESCE(travel_frequency, (ARRAY['Frequent traveler', 'Occasional traveler', 'Aspiring traveler', 'Home-oriented'])[1 + floor(random() * 4)]),
  
  -- Values and personality
  political_views = COALESCE(political_views, (ARRAY['Progressive', 'Liberal', 'Moderate', 'Conservative', 'Kurdish Nationalist', 'Apolitical'])[1 + floor(random() * 6)]),
  zodiac_sign = COALESCE(zodiac_sign, (ARRAY['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'])[1 + floor(random() * 12)]),
  personality_type = COALESCE(personality_type, (ARRAY['INFJ', 'INFP', 'ENFJ', 'ENFP', 'INTJ', 'INTP', 'ENTJ', 'ENTP', 'ISFJ', 'ISFP', 'ESFJ', 'ESFP', 'ISTJ', 'ISTP', 'ESTJ', 'ESTP'])[1 + floor(random() * 16)]),
  communication_style = COALESCE(communication_style, (ARRAY['Direct and honest', 'Thoughtful and reflective', 'Expressive and emotional', 'Reserved but caring'])[1 + floor(random() * 4)]),
  
  -- Career and education
  education = COALESCE(NULLIF(education, 'Not specified'), (ARRAY['High School', 'Some College', 'Bachelor''s Degree', 'Master''s Degree', 'PhD'])[1 + floor(random() * 5)]),
  company = COALESCE(company, (ARRAY['Tech Kurdistan', 'Kurdistan Regional Government', 'University of Kurdistan', 'Kurdish Media Group', 'Self-employed'])[1 + floor(random() * 5)]),
  career_ambitions = COALESCE(career_ambitions, (ARRAY['Leadership role', 'Start own business', 'Make cultural impact', 'Help my community', 'Achieve work-life balance'])[1 + floor(random() * 5)]),
  work_life_balance = COALESCE(work_life_balance, (ARRAY['Work comes first', 'Life comes first', 'Balanced approach', 'Depends on season'])[1 + floor(random() * 4)]),
  work_environment = COALESCE(work_environment, (ARRAY['Office worker', 'Remote worker', 'Hybrid schedule', 'Field work', 'Own business'])[1 + floor(random() * 5)]),
  
  -- Relationship preferences
  want_children = COALESCE(want_children, (ARRAY['Want children someday', 'Don''t want children', 'Open to children', 'Have children already'])[1 + floor(random() * 4)]),
  love_language = COALESCE(love_language, (ARRAY['Acts of Service', 'Words of Affirmation', 'Quality Time', 'Physical Touch', 'Receiving Gifts'])[1 + floor(random() * 5)]),
  family_closeness = COALESCE(family_closeness, (ARRAY['Very close', 'Close', 'Moderately close', 'Not very close'])[1 + floor(random() * 4)]),
  ideal_date = COALESCE(ideal_date, (ARRAY['Coffee and conversation', 'Cultural event or museum', 'Outdoor adventure', 'Home-cooked meal', 'Traditional Kurdish celebration'])[1 + floor(random() * 5)]),
  
  -- Ensure arrays are populated
  values = CASE 
    WHEN values IS NULL OR array_length(values, 1) IS NULL OR array_length(values, 1) < 3 
    THEN (
      SELECT array_agg(value) 
      FROM (
        SELECT unnest(ARRAY['Family', 'Kurdish heritage', 'Honesty', 'Community', 'Tradition', 'Freedom', 'Education', 'Respect', 'Cultural preservation', 'Independence']) AS value 
        ORDER BY random() 
        LIMIT 3 + floor(random() * 4)
      ) AS selected_values
    )
    ELSE values
  END,
  
  interests = CASE 
    WHEN interests IS NULL OR array_length(interests, 1) IS NULL OR array_length(interests, 1) < 3 
    THEN (
      SELECT array_agg(interest) 
      FROM (
        SELECT unnest(ARRAY['Kurdish music', 'Poetry', 'Literature', 'Cultural events', 'Traditional dance', 'History', 'Politics', 'Art', 'Photography', 'Travel']) AS interest 
        ORDER BY random() 
        LIMIT 3 + floor(random() * 4)
      ) AS selected_interests
    )
    ELSE interests
  END,
  
  hobbies = CASE 
    WHEN hobbies IS NULL OR array_length(hobbies, 1) IS NULL OR array_length(hobbies, 1) < 2 
    THEN (
      SELECT array_agg(hobby) 
      FROM (
        SELECT unnest(ARRAY['Reading', 'Dancing', 'Cooking', 'Photography', 'Hiking', 'Music', 'Writing', 'Travel', 'Learning languages', 'Volunteering']) AS hobby 
        ORDER BY random() 
        LIMIT 2 + floor(random() * 4)
      ) AS selected_hobbies
    )
    ELSE hobbies
  END,
  
  creative_pursuits = CASE 
    WHEN creative_pursuits IS NULL OR array_length(creative_pursuits, 1) IS NULL 
    THEN (
      SELECT array_agg(pursuit) 
      FROM (
        SELECT unnest(ARRAY['Photography', 'Painting', 'Drawing', 'Writing', 'Music production', 'Graphic design', 'Pottery', 'Jewelry making']) AS pursuit 
        ORDER BY random() 
        LIMIT 1 + floor(random() * 3)
      ) AS selected_pursuits
    )
    ELSE creative_pursuits
  END,
  
  weekend_activities = CASE 
    WHEN weekend_activities IS NULL OR array_length(weekend_activities, 1) IS NULL 
    THEN (
      SELECT array_agg(activity) 
      FROM (
        SELECT unnest(ARRAY['Family gatherings', 'Cultural events', 'Outdoor activities', 'Relaxing at home', 'Exploring new places', 'Creative projects']) AS activity 
        ORDER BY random() 
        LIMIT 2 + floor(random() * 3)
      ) AS selected_activities
    )
    ELSE weekend_activities
  END,
  
  languages = CASE 
    WHEN languages IS NULL OR array_length(languages, 1) IS NULL OR array_length(languages, 1) < 1 
    THEN (
      SELECT array_agg(language) 
      FROM (
        SELECT unnest(ARRAY['Kurdish', 'English', 'Arabic', 'Turkish', 'Persian', 'German', 'French', 'Spanish']) AS language 
        ORDER BY random() 
        LIMIT 2 + floor(random() * 4)
      ) AS selected_languages
    )
    ELSE languages
  END,
  
  -- Ensure bio is meaningful
  bio = CASE 
    WHEN bio = 'Tell us about yourself...' OR bio IS NULL OR length(bio) < 20
    THEN 'Proud Kurdish individual who values family, heritage, and building meaningful connections. Looking for someone who shares similar values and appreciates our rich culture.'
    ELSE bio
  END,
  
  -- Ensure profile image exists
  profile_image = CASE 
    WHEN profile_image = 'https://placehold.co/400' OR profile_image IS NULL
    THEN CASE 
      WHEN gender = 'male' 
      THEN (ARRAY[
        'https://randomuser.me/api/portraits/men/1.jpg',
        'https://randomuser.me/api/portraits/men/2.jpg',
        'https://randomuser.me/api/portraits/men/3.jpg',
        'https://randomuser.me/api/portraits/men/4.jpg',
        'https://randomuser.me/api/portraits/men/5.jpg'
      ])[1 + floor(random() * 5)]
      ELSE (ARRAY[
        'https://randomuser.me/api/portraits/women/1.jpg',
        'https://randomuser.me/api/portraits/women/2.jpg',
        'https://randomuser.me/api/portraits/women/3.jpg',
        'https://randomuser.me/api/portraits/women/4.jpg',
        'https://randomuser.me/api/portraits/women/5.jpg'
      ])[1 + floor(random() * 5)]
    END
    ELSE profile_image
  END,
  
  verified = COALESCE(verified, random() > 0.3),
  last_active = COALESCE(last_active, now() - (random() * interval '7 days'));

-- Add photos for profiles that don't have any
INSERT INTO public.photos (profile_id, url, is_primary)
SELECT 
  p.id,
  CASE 
    WHEN p.gender = 'male' 
    THEN (ARRAY[
      'https://randomuser.me/api/portraits/men/1.jpg',
      'https://randomuser.me/api/portraits/men/2.jpg',
      'https://randomuser.me/api/portraits/men/3.jpg',
      'https://randomuser.me/api/portraits/men/4.jpg',
      'https://randomuser.me/api/portraits/men/5.jpg'
    ])[1 + floor(random() * 5)]
    ELSE (ARRAY[
      'https://randomuser.me/api/portraits/women/1.jpg',
      'https://randomuser.me/api/portraits/women/2.jpg',
      'https://randomuser.me/api/portraits/women/3.jpg',
      'https://randomuser.me/api/portraits/women/4.jpg',
      'https://randomuser.me/api/portraits/women/5.jpg'
    ])[1 + floor(random() * 5)]
  END,
  true
FROM profiles p
LEFT JOIN photos ph ON p.id = ph.profile_id
WHERE ph.profile_id IS NULL
ON CONFLICT DO NOTHING;

-- Add additional photos for variety (2-3 photos per profile)
INSERT INTO public.photos (profile_id, url, is_primary)
SELECT 
  p.id,
  CASE 
    WHEN p.gender = 'male' 
    THEN (ARRAY[
      'https://randomuser.me/api/portraits/men/6.jpg',
      'https://randomuser.me/api/portraits/men/7.jpg',
      'https://randomuser.me/api/portraits/men/8.jpg',
      'https://randomuser.me/api/portraits/men/9.jpg',
      'https://randomuser.me/api/portraits/men/10.jpg'
    ])[1 + floor(random() * 5)]
    ELSE (ARRAY[
      'https://randomuser.me/api/portraits/women/6.jpg',
      'https://randomuser.me/api/portraits/women/7.jpg',
      'https://randomuser.me/api/portraits/women/8.jpg',
      'https://randomuser.me/api/portraits/women/9.jpg',
      'https://randomuser.me/api/portraits/women/10.jpg'
    ])[1 + floor(random() * 5)]
  END,
  false
FROM profiles p
WHERE random() > 0.3  -- 70% chance of getting additional photos
ON CONFLICT DO NOTHING;