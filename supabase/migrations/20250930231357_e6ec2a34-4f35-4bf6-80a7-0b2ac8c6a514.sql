-- ============================================
-- PHASE 1: COMPLETE DATABASE CLEANUP
-- ============================================

-- Delete all user-related data in correct order (respecting foreign keys)
DELETE FROM story_views;
DELETE FROM post_comments;
DELETE FROM post_likes;
DELETE FROM event_attendees;
DELETE FROM followers;
DELETE FROM likes;
DELETE FROM matches;
DELETE FROM messages;
DELETE FROM user_subscriptions;
DELETE FROM daily_usage;
DELETE FROM photos;
DELETE FROM stories;
DELETE FROM posts;
DELETE FROM events;
DELETE FROM user_roles WHERE role != 'super_admin'; -- Keep super_admin roles
DELETE FROM profiles WHERE id NOT IN (SELECT user_id FROM user_roles WHERE role = 'super_admin'); -- Keep super_admin profiles

-- ============================================
-- PHASE 2: GENERATE EXACTLY 500 COMPLETE PROFILES
-- ============================================

CREATE OR REPLACE FUNCTION generate_exactly_500_profiles()
RETURNS INTEGER AS $$
DECLARE
  profile_count INTEGER := 0;
  current_id UUID;
  random_gender TEXT;
  random_name TEXT;
  random_surname TEXT;
  random_age INTEGER;
  random_height INTEGER;
  
  kurdish_male_names TEXT[] := ARRAY['Azad', 'Dilshad', 'Rojhat', 'Heval', 'Kawa', 'Rizgar', 'Sherko', 'Baran', 'Soran', 'Hawar', 'Rekotyn', 'Xabat', 'Newroz', 'Chia', 'Dler', 'Karwan', 'Rawaz', 'Zhiwan', 'Diyar', 'Barzan'];
  kurdish_female_names TEXT[] := ARRAY['Rojin', 'Berfin', 'Zilan', 'Shilan', 'Avesta', 'Berivan', 'Runak', 'Helin', 'Nazdar', 'Delal', 'Awara', 'Jina', 'Ava', 'Cihan', 'Darya', 'Govend', 'Narin', 'Sozdar', 'Evın', 'Jîyan'];
  kurdish_surnames TEXT[] := ARRAY['Ahmadi', 'Barzani', 'Talabani', 'Kurdi', 'Shekaki', 'Zaza', 'Hawrami', 'Dizayi', 'Bajalan', 'Zangana', 'Ardelan', 'Mukri', 'Sorani', 'Feyli', 'Kirmanji', 'Mahabad', 'Dersimi'];
  
  kurdish_locations TEXT[] := ARRAY['Erbil, Kurdistan', 'Sulaymaniyah, Kurdistan', 'Duhok, Kurdistan', 'Halabja, Kurdistan', 'Qamishli, Kurdistan', 'Kobani, Kurdistan', 'Diyarbakir, Kurdistan', 'Sanandaj, Kurdistan', 'Mahabad, Kurdistan', 'Zakho, Kurdistan'];
  kurdish_regions TEXT[] := ARRAY['South-Kurdistan', 'West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan'];
  
  occupations TEXT[] := ARRAY['Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Artist', 'Lawyer', 'Nurse', 'Engineer', 'Translator', 'Journalist', 'Cultural Activist', 'Marketing Manager'];
  body_types TEXT[] := ARRAY['Slim', 'Average', 'Athletic', 'Curvy', 'Muscular'];
  ethnicities TEXT[] := ARRAY['Kurdish', 'Kurdish-Persian', 'Kurdish-Turkish', 'Kurdish-Arab', 'Middle Eastern'];
  religions TEXT[] := ARRAY['Islam', 'Yarsanism', 'Yazidism', 'Christianity', 'Secular', 'Spiritual'];
  educations TEXT[] := ARRAY['High School', 'Some College', 'Bachelor''s Degree', 'Master''s Degree', 'PhD'];
  
  interests_pool TEXT[] := ARRAY['Kurdish music', 'Poetry', 'Literature', 'Cultural events', 'Traditional dance', 'History', 'Photography', 'Travel', 'Cooking', 'Hiking'];
  hobbies_pool TEXT[] := ARRAY['Reading', 'Dancing', 'Cooking', 'Photography', 'Hiking', 'Music', 'Writing', 'Learning languages', 'Volunteering', 'Sports'];
  values_pool TEXT[] := ARRAY['Family', 'Kurdish heritage', 'Honesty', 'Community', 'Tradition', 'Freedom', 'Education', 'Respect', 'Cultural preservation'];
  languages_pool TEXT[] := ARRAY['Kurdish', 'English', 'Arabic', 'Turkish', 'Persian'];
  
  bio_templates TEXT[] := ARRAY[
    'Proud Kurdish individual who values family and heritage. Looking for meaningful connections with someone who appreciates our rich culture and traditions.',
    'Passionate about Kurdish culture, music, and literature. Seeking someone who shares similar values and wants to build a future together.',
    'Family-oriented person with deep roots in Kurdish traditions. Love exploring our beautiful homeland and celebrating our cultural events.',
    'Cultural activist and proud Kurd. Interested in preserving our heritage while building new connections. Looking for like-minded individuals.',
    'Adventurous spirit with a love for Kurdish music and dance. Seeking genuine connections with someone who values authenticity and cultural pride.'
  ];
  
  male_photos TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop'
  ];
  
  female_photos TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop'
  ];
  
BEGIN
  RAISE NOTICE 'Starting generation of exactly 500 complete profiles...';
  
  FOR i IN 1..500 LOOP
    -- Generate random data
    random_gender := CASE WHEN random() > 0.5 THEN 'male' ELSE 'female' END;
    random_age := 18 + floor(random() * 18)::INTEGER; -- Age 18-35
    random_height := 145 + floor(random() * 66)::INTEGER; -- Height 145-210 cm
    
    -- Select name based on gender
    IF random_gender = 'male' THEN
      random_name := kurdish_male_names[1 + floor(random() * array_length(kurdish_male_names, 1))];
    ELSE
      random_name := kurdish_female_names[1 + floor(random() * array_length(kurdish_female_names, 1))];
    END IF;
    
    random_surname := kurdish_surnames[1 + floor(random() * array_length(kurdish_surnames, 1))];
    
    -- Generate unique ID
    current_id := gen_random_uuid();
    
    -- Insert complete profile
    INSERT INTO profiles (
      id, name, age, gender, location, kurdistan_region, occupation, bio, 
      profile_image, height, body_type, ethnicity, religion, education,
      relationship_goals, want_children, exercise_habits, verified,
      interests, hobbies, values, languages,
      last_active, created_at
    ) VALUES (
      current_id,
      random_name || ' ' || random_surname,
      random_age,
      random_gender,
      kurdish_locations[1 + floor(random() * array_length(kurdish_locations, 1))],
      kurdish_regions[1 + floor(random() * array_length(kurdish_regions, 1))],
      occupations[1 + floor(random() * array_length(occupations, 1))],
      bio_templates[1 + floor(random() * array_length(bio_templates, 1))],
      CASE WHEN random_gender = 'male' 
        THEN male_photos[1 + floor(random() * array_length(male_photos, 1))]
        ELSE female_photos[1 + floor(random() * array_length(female_photos, 1))]
      END,
      random_height || ' cm',
      body_types[1 + floor(random() * array_length(body_types, 1))],
      ethnicities[1 + floor(random() * array_length(ethnicities, 1))],
      religions[1 + floor(random() * array_length(religions, 1))],
      educations[1 + floor(random() * array_length(educations, 1))],
      CASE floor(random() * 3)
        WHEN 0 THEN 'Looking for something serious'
        WHEN 1 THEN 'Marriage'
        ELSE 'Friendship first'
      END,
      CASE floor(random() * 3)
        WHEN 0 THEN 'Want children someday'
        WHEN 1 THEN 'Open to children'
        ELSE 'Don''t want children'
      END,
      CASE floor(random() * 3)
        WHEN 0 THEN 'Regular exercise'
        WHEN 1 THEN 'Occasional exercise'
        ELSE 'Daily fitness routine'
      END,
      random() > 0.3, -- 70% verified
      (SELECT array_agg(interest) FROM (SELECT unnest(interests_pool) AS interest ORDER BY random() LIMIT 5 + floor(random() * 3)) sub),
      (SELECT array_agg(hobby) FROM (SELECT unnest(hobbies_pool) AS hobby ORDER BY random() LIMIT 4 + floor(random() * 3)) sub),
      (SELECT array_agg(value) FROM (SELECT unnest(values_pool) AS value ORDER BY random() LIMIT 4 + floor(random() * 3)) sub),
      (SELECT array_agg(lang) FROM (SELECT unnest(languages_pool) AS lang ORDER BY random() LIMIT 2 + floor(random() * 2)) sub),
      now() - (random() * interval '7 days'),
      now() - (random() * interval '180 days')
    );
    
    -- Add profile photo
    INSERT INTO photos (profile_id, url, is_primary)
    VALUES (
      current_id,
      CASE WHEN random_gender = 'male' 
        THEN male_photos[1 + floor(random() * array_length(male_photos, 1))]
        ELSE female_photos[1 + floor(random() * array_length(female_photos, 1))]
      END,
      true
    );
    
    profile_count := profile_count + 1;
    
    -- Log progress every 100 profiles
    IF profile_count % 100 = 0 THEN
      RAISE NOTICE 'Generated % profiles...', profile_count;
    END IF;
  END LOOP;
  
  RAISE NOTICE 'Completed generation of % profiles', profile_count;
  RETURN profile_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute profile generation
SELECT generate_exactly_500_profiles();

-- ============================================
-- PHASE 3: GENERATE PROPORTIONAL CONTENT
-- ============================================

-- Generate exactly 10 posts per user (5,000 total)
INSERT INTO posts (user_id, content, media_url, media_type, likes_count, comments_count, created_at)
SELECT 
  p.id,
  content_data.content,
  content_data.media_url,
  'image',
  floor(random() * 50)::INTEGER,
  floor(random() * 15)::INTEGER,
  now() - (random() * interval '30 days')
FROM profiles p
CROSS JOIN LATERAL (
  SELECT * FROM (VALUES
    ('Celebrating Kurdish culture today! 🎉 Proud of our heritage and traditions.', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'),
    ('Family gathering this weekend. Nothing beats spending time with loved ones! ❤️', 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800'),
    ('Exploring the beautiful mountains of Kurdistan. Nature therapy at its finest! 🏔️', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'),
    ('Traditional Kurdish cooking class today. Learned to make the perfect dolma! 🍽️', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'),
    ('Kurdish music concert tonight. Our traditional instruments are so beautiful! 🎵', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'),
    ('Reading Kurdish poetry. Sherko Bekas always touches my soul 📖', NULL),
    ('Weekend plans: Cultural festival in the city! Who''s coming? 🎊', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'),
    ('Morning coffee with a view. Starting the day right ☕', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'),
    ('Grateful for my Kurdish roots and the strong community we have 🙏', NULL),
    ('Sunset over Erbil. My beautiful homeland 🌅', 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800')
  ) AS t(content, media_url)
  ORDER BY random()
  LIMIT 10
) AS content_data(content, media_url);

-- Generate exactly 2 stories per user (1,000 total)
INSERT INTO stories (user_id, media_url, media_type, category, duration, created_at, expires_at, views_count)
SELECT 
  p.id,
  'https://images.unsplash.com/photo-' || (1500000000 + floor(random() * 200000000)::bigint) || '?w=600&h=800&fit=crop',
  'image',
  categories.category,
  10 + floor(random() * 10)::INTEGER,
  now() - (random() * interval '20 hours'),
  now() + (interval '4 hours'),
  floor(random() * 30)::INTEGER
FROM profiles p
CROSS JOIN LATERAL (
  SELECT unnest(ARRAY['general', 'travel', 'food', 'culture', 'family']) AS category
  ORDER BY random()
  LIMIT 2
) AS categories;

-- Generate 15 Kurdish cultural events
INSERT INTO events (user_id, title, description, location, event_date, max_attendees, category, image_url, created_at, attendees_count)
SELECT 
  (SELECT id FROM profiles ORDER BY random() LIMIT 1),
  event_data.title,
  event_data.description,
  event_data.location,
  now() + (random() * interval '60 days'),
  30 + floor(random() * 70)::INTEGER,
  event_data.category,
  'https://images.unsplash.com/photo-' || (1500000000 + floor(random() * 200000000)::bigint) || '?w=800&h=600&fit=crop',
  now(),
  8 + floor(random() * 5)::INTEGER
FROM (VALUES
  ('Newroz Celebration 2025', 'Join us for traditional Kurdish New Year with music, dance, and food!', 'Erbil Cultural Center', 'festival'),
  ('Kurdish Language Workshop', 'Learn Sorani and Kurmanji dialects. All levels welcome!', 'Sulaymaniyah Community Hall', 'educational'),
  ('Traditional Cooking Class', 'Master Kurdish delicacies with experienced chefs.', 'Duhok Culinary School', 'food'),
  ('Poetry Night', 'Evening of Kurdish poetry readings. Share your work!', 'Halabja Arts Center', 'cultural'),
  ('Dabke Dance Social', 'Learn traditional line dancing. Live music included!', 'Qamishli Community Center', 'social'),
  ('Kurdish Film Festival', 'Award-winning films with Q&A sessions.', 'Kobani Cinema', 'entertainment'),
  ('Heritage Museum Tour', 'Guided tour of Kurdish artifacts and exhibitions.', 'Kurdistan National Museum', 'educational'),
  ('Young Professionals Meetup', 'Network with Kurdish professionals in tech and arts.', 'Sulaymaniyah Business Hub', 'networking'),
  ('Family Picnic Day', 'Outdoor gathering with games and activities for all ages.', 'Sami Abdulrahman Park', 'social'),
  ('Music Concert', 'Live traditional instruments: tanbur and daf.', 'Duhok Amphitheater', 'entertainment'),
  ('Wedding Traditions Workshop', 'Learn about Kurdish wedding customs and attire.', 'Halabja Cultural Center', 'cultural'),
  ('Mountain Hiking Trip', 'Explore Kurdistan mountains. Guide included!', 'Zagros Mountains', 'outdoor'),
  ('Storytelling Evening', 'Traditional tales by community elders.', 'Qamishli Library', 'cultural'),
  ('Fashion Show', 'Modern Kurdish attire by local designers.', 'Erbil Fashion Gallery', 'entertainment'),
  ('Charity Fundraiser', 'Support education in Kurdish regions.', 'Sulaymaniyah Convention Center', 'charity')
) AS event_data(title, description, location, category);

-- Generate event attendees (8-12 per event)
INSERT INTO event_attendees (event_id, user_id, created_at)
SELECT 
  e.id,
  p.id,
  e.created_at + (random() * interval '3 days')
FROM events e
CROSS JOIN LATERAL (
  SELECT id FROM profiles 
  ORDER BY random() 
  LIMIT 8 + floor(random() * 5)::INTEGER
) p;

-- Generate realistic messages between random pairs
INSERT INTO messages (sender_id, recipient_id, text, read, created_at)
SELECT 
  p1.id,
  p2.id,
  messages.text,
  random() > 0.4,
  now() - (random() * interval '14 days')
FROM (SELECT id FROM profiles ORDER BY random() LIMIT 100) p1
CROSS JOIN LATERAL (
  SELECT id FROM profiles WHERE id != p1.id ORDER BY random() LIMIT 1
) p2
CROSS JOIN LATERAL (
  SELECT unnest(ARRAY[
    'Hey! How are you doing?',
    'Thanks for connecting! 😊',
    'I saw you''re into Kurdish culture too!',
    'Would love to chat more about our heritage',
    'Your profile is really interesting!',
    'Have you been to any cultural events lately?'
  ]) AS text
  ORDER BY random()
  LIMIT 3
) messages;

-- Generate likes between users
INSERT INTO likes (liker_id, likee_id, created_at)
SELECT 
  p1.id,
  p2.id,
  now() - (random() * interval '14 days')
FROM (SELECT id FROM profiles ORDER BY random() LIMIT 200) p1
CROSS JOIN LATERAL (
  SELECT id FROM profiles WHERE id != p1.id ORDER BY random() LIMIT 3
) p2;

-- Generate matches from mutual likes
INSERT INTO matches (user1_id, user2_id, matched_at)
SELECT DISTINCT
  LEAST(l1.liker_id, l1.likee_id) as user1_id,
  GREATEST(l1.liker_id, l1.likee_id) as user2_id,
  GREATEST(l1.created_at, l2.created_at) as matched_at
FROM likes l1
JOIN likes l2 ON l1.liker_id = l2.likee_id AND l1.likee_id = l2.liker_id
WHERE l1.liker_id < l1.likee_id
LIMIT 50;

-- ============================================
-- PHASE 4: VERIFICATION
-- ============================================

-- Verify profile count
DO $$
DECLARE
  profile_count INTEGER;
  post_count INTEGER;
  story_count INTEGER;
  event_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM profiles WHERE id NOT IN (SELECT user_id FROM user_roles WHERE role = 'super_admin');
  SELECT COUNT(*) INTO post_count FROM posts;
  SELECT COUNT(*) INTO story_count FROM stories;
  SELECT COUNT(*) INTO event_count FROM events;
  
  RAISE NOTICE '=== VERIFICATION RESULTS ===';
  RAISE NOTICE 'Total Profiles: %', profile_count;
  RAISE NOTICE 'Total Posts: %', post_count;
  RAISE NOTICE 'Total Stories: %', story_count;
  RAISE NOTICE 'Total Events: %', event_count;
  
  IF profile_count != 500 THEN
    RAISE WARNING 'Profile count is %, expected 500!', profile_count;
  ELSE
    RAISE NOTICE '✓ Profile count verified: 500';
  END IF;
END $$;

-- Drop temporary function
DROP FUNCTION IF EXISTS generate_exactly_500_profiles();