-- ============================================
-- PART 1: HEIGHT CONVERSION TO CM ONLY
-- ============================================

-- Update all existing heights from feet/inches to centimeters
UPDATE profiles
SET height = CASE
  -- 4'10" to 4'11"
  WHEN height = '4''10"' OR height = '4''10' THEN '147 cm'
  WHEN height = '4''11"' OR height = '4''11' THEN '150 cm'
  -- 5'0" to 5'11"
  WHEN height = '5''0"' OR height = '5''0' THEN '152 cm'
  WHEN height = '5''1"' OR height = '5''1' THEN '155 cm'
  WHEN height = '5''2"' OR height = '5''2' THEN '157 cm'
  WHEN height = '5''3"' OR height = '5''3' THEN '160 cm'
  WHEN height = '5''4"' OR height = '5''4' THEN '163 cm'
  WHEN height = '5''5"' OR height = '5''5' THEN '165 cm'
  WHEN height = '5''6"' OR height = '5''6' THEN '168 cm'
  WHEN height = '5''7"' OR height = '5''7' THEN '170 cm'
  WHEN height = '5''8"' OR height = '5''8' THEN '173 cm'
  WHEN height = '5''9"' OR height = '5''9' THEN '175 cm'
  WHEN height = '5''10"' OR height = '5''10' THEN '178 cm'
  WHEN height = '5''11"' OR height = '5''11' THEN '180 cm'
  -- 6'0" to 6'6"
  WHEN height = '6''0"' OR height = '6''0' THEN '183 cm'
  WHEN height = '6''1"' OR height = '6''1' THEN '185 cm'
  WHEN height = '6''2"' OR height = '6''2' THEN '188 cm'
  WHEN height = '6''3"' OR height = '6''3' THEN '191 cm'
  WHEN height = '6''4"' OR height = '6''4' THEN '193 cm'
  WHEN height = '6''5"' OR height = '6''5' THEN '196 cm'
  WHEN height = '6''6"' OR height = '6''6' THEN '198 cm'
  ELSE height
END
WHERE height LIKE '%''%' OR height LIKE '%"%';

-- ============================================
-- PART 2: STORY VIEWS AND REACTIONS
-- ============================================

-- Create story_views table
CREATE TABLE IF NOT EXISTS story_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  viewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, viewer_id)
);

-- Enable RLS on story_views
ALTER TABLE story_views ENABLE ROW LEVEL SECURITY;

-- Story views policies
CREATE POLICY "Anyone can view story views"
  ON story_views FOR SELECT
  USING (true);

CREATE POLICY "Users can create story views"
  ON story_views FOR INSERT
  WITH CHECK (auth.uid() = viewer_id);

-- Add reactions column to stories
ALTER TABLE stories ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '[]'::jsonb;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_story_views_story_id ON story_views(story_id);
CREATE INDEX IF NOT EXISTS idx_story_views_viewer_id ON story_views(viewer_id);

-- ============================================
-- PART 3: ENHANCED COMMENTS WITH MENTIONS
-- ============================================

-- Add mentions column to post_comments
ALTER TABLE post_comments ADD COLUMN IF NOT EXISTS mentions UUID[] DEFAULT ARRAY[]::UUID[];

-- Create index for mentions
CREATE INDEX IF NOT EXISTS idx_post_comments_mentions ON post_comments USING GIN(mentions);

-- ============================================
-- PART 4: GENERATE REALISTIC MESSAGES
-- ============================================

-- Function to generate realistic messages for all matches
CREATE OR REPLACE FUNCTION generate_realistic_messages()
RETURNS INTEGER AS $$
DECLARE
  match_record RECORD;
  msg_count INTEGER := 0;
  messages_to_create INTEGER;
  i INTEGER;
  sender UUID;
  recipient UUID;
  message_templates TEXT[] := ARRAY[
    'Hey! How are you doing?',
    'Thanks for the match! 😊',
    'I saw you''re into Kurdish culture too. That''s awesome!',
    'Would love to grab coffee sometime',
    'Your profile is really interesting!',
    'Have you been to the Kurdish festival this year?',
    'What kind of music do you like?',
    'I love your photos! Where was that taken?',
    'Do you speak Kurdish fluently?',
    'I''m planning to visit Kurdistan soon. Any recommendations?',
    'What do you do for fun on weekends?',
    'That''s so cool! Tell me more about it',
    'Haha that''s funny! 😄',
    'I completely agree with you',
    'Let''s plan something soon!',
    'Are you free this weekend?',
    'I know a great Kurdish restaurant we could try',
    'Your family sounds amazing!',
    'I value family a lot too',
    'What''s your favorite Kurdish dish?',
    'Mine is dolma! 🍽️',
    'Do you attend cultural events often?',
    'I try to stay connected with my heritage',
    'That sounds like a great plan!',
    'Count me in! ✨',
    'When would be good for you?',
    'I''m flexible this week',
    'Looking forward to meeting you!',
    'This has been a great conversation',
    'You seem like a really genuine person',
    'I appreciate your honesty',
    'Let''s keep in touch!',
    'Hope you have a wonderful day!',
    'Bzhnin! (Good luck in Kurdish)',
    'Spas! (Thank you in Kurdish)',
    'I love connecting with fellow Kurds',
    'Our culture is so beautiful',
    'Do you celebrate Newroz?',
    'It''s my favorite celebration!',
    'Family is everything to me too',
    'What''s your favorite memory from Kurdistan?'
  ];
BEGIN
  -- Loop through all matches and create conversations
  FOR match_record IN 
    SELECT user1_id, user2_id FROM matches 
    ORDER BY random()
    LIMIT 1000
  LOOP
    -- Generate 5-15 messages per match
    messages_to_create := 5 + floor(random() * 11)::INTEGER;
    
    FOR i IN 1..messages_to_create LOOP
      -- Alternate sender/recipient
      IF i % 2 = 1 THEN
        sender := match_record.user1_id;
        recipient := match_record.user2_id;
      ELSE
        sender := match_record.user2_id;
        recipient := match_record.user1_id;
      END IF;
      
      -- Insert message
      INSERT INTO messages (sender_id, recipient_id, text, read, created_at)
      VALUES (
        sender,
        recipient,
        message_templates[1 + floor(random() * array_length(message_templates, 1))],
        random() > 0.3, -- 70% chance message is read
        now() - (random() * interval '30 days') + (i * interval '5 minutes')
      );
      
      msg_count := msg_count + 1;
    END LOOP;
  END LOOP;
  
  RETURN msg_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT generate_realistic_messages();

-- ============================================
-- PART 5: GENERATE STORY VIEWS
-- ============================================

-- Generate story views for existing stories
INSERT INTO story_views (story_id, viewer_id, viewed_at)
SELECT 
  s.id as story_id,
  p.id as viewer_id,
  s.created_at + (random() * interval '20 hours') as viewed_at
FROM stories s
CROSS JOIN LATERAL (
  SELECT id FROM profiles 
  WHERE id != s.user_id 
  ORDER BY random() 
  LIMIT (2 + floor(random() * 15)::INTEGER)
) p
ON CONFLICT (story_id, viewer_id) DO NOTHING;

-- Update stories view counts
UPDATE stories s
SET views_count = (
  SELECT COUNT(*) FROM story_views sv WHERE sv.story_id = s.id
);

-- ============================================
-- PART 6: GENERATE MORE STORIES
-- ============================================

-- Generate additional stories for 300 users
INSERT INTO stories (user_id, media_url, media_type, category, duration, created_at, expires_at)
SELECT 
  p.id as user_id,
  'https://images.unsplash.com/photo-' || (1400000000 + floor(random() * 300000000)::bigint) || '?w=600&h=800&fit=crop' as media_url,
  'image' as media_type,
  (ARRAY['general', 'travel', 'food', 'culture', 'family'])[1 + floor(random() * 5)] as category,
  (10 + floor(random() * 10)::INTEGER) as duration,
  now() - (random() * interval '20 hours') as created_at,
  now() + (interval '4 hours') as expires_at
FROM profiles p
ORDER BY random()
LIMIT 300;

-- ============================================
-- PART 7: ENHANCE COMMENTS WITH MENTIONS
-- ============================================

-- Update existing comments to include mentions
UPDATE post_comments pc
SET 
  content = CASE 
    WHEN random() > 0.6 THEN '@' || (SELECT name FROM profiles WHERE id = (SELECT user_id FROM posts WHERE id = pc.post_id LIMIT 1)) || ' ' || pc.content
    ELSE pc.content
  END,
  mentions = CASE
    WHEN random() > 0.6 THEN ARRAY[(SELECT user_id FROM posts WHERE id = pc.post_id LIMIT 1)]
    ELSE ARRAY[]::UUID[]
  END
WHERE random() > 0.7;

-- ============================================
-- PART 8: GENERATE CULTURAL EVENTS
-- ============================================

-- Generate 20 diverse Kurdish cultural events
INSERT INTO events (user_id, title, description, location, event_date, max_attendees, category, image_url, created_at)
SELECT 
  (SELECT id FROM profiles ORDER BY random() LIMIT 1),
  event_data.title,
  event_data.description,
  event_data.location,
  now() + (random() * interval '60 days'),
  (20 + floor(random() * 80)::INTEGER),
  event_data.category,
  'https://images.unsplash.com/photo-' || (1500000000 + floor(random() * 200000000)::bigint) || '?w=800&h=600&fit=crop',
  now()
FROM (VALUES
  ('Newroz Celebration 2025', 'Join us for the traditional Kurdish New Year celebration with music, dance, and traditional food. Bring your family!', 'Erbil Cultural Center, Kurdistan', 'festival'),
  ('Kurdish Language Workshop', 'Learn and practice Sorani and Kurmanji dialects. All levels welcome. Materials provided.', 'Sulaymaniyah Community Hall, Kurdistan', 'educational'),
  ('Traditional Kurdish Cooking Class', 'Master the art of making dolma, kubba, and other Kurdish delicacies with experienced chefs.', 'Duhok Culinary School, Kurdistan', 'food'),
  ('Kurdish Poetry Night', 'An evening of classical and contemporary Kurdish poetry readings. Share your own work!', 'Halabja Arts Center, Kurdistan', 'cultural'),
  ('Dabke Dance Social', 'Learn traditional Kurdish line dancing. No experience needed! Live music included.', 'Qamishli Community Center, Kurdistan', 'social'),
  ('Kurdish Film Festival', 'Screening of award-winning Kurdish films followed by Q&A with directors.', 'Kobani Cinema House, Kurdistan', 'entertainment'),
  ('Heritage Museum Tour', 'Guided tour of Kurdish historical artifacts and cultural exhibitions.', 'Kurdistan National Museum, Erbil', 'educational'),
  ('Young Professionals Meetup', 'Network with Kurdish professionals working in tech, business, and arts.', 'Sulaymaniyah Business Hub, Kurdistan', 'networking'),
  ('Family Picnic Day', 'Outdoor gathering with traditional games, food, and activities for all ages.', 'Sami Abdulrahman Park, Erbil', 'social'),
  ('Kurdish Music Concert', 'Live performance featuring traditional instruments including tanbur and daf.', 'Duhok Amphitheater, Kurdistan', 'entertainment'),
  ('Wedding Traditions Workshop', 'Learn about Kurdish wedding customs, attire, and ceremonies.', 'Halabja Cultural Center, Kurdistan', 'cultural'),
  ('Hiking Trip to Kurdistan Mountains', 'Explore the beautiful mountains of Kurdistan. Transportation and guide included.', 'Zagros Mountains, Kurdistan', 'outdoor'),
  ('Kurdish Storytelling Evening', 'Traditional tales and folklore shared by community elders.', 'Qamishli Library, Kurdistan', 'cultural'),
  ('Fashion Show: Modern Kurdish Attire', 'Contemporary interpretations of traditional Kurdish clothing by local designers.', 'Erbil Fashion Gallery, Kurdistan', 'entertainment'),
  ('Charity Fundraiser for Kurdistan', 'Support education and healthcare initiatives in Kurdish regions.', 'Sulaymaniyah Convention Center, Kurdistan', 'charity'),
  ('Kurdish History Lecture Series', 'Deep dive into Kurdish historical events and movements.', 'University of Kurdistan, Erbil', 'educational'),
  ('Traditional Music Workshop', 'Learn to play tanbur, daf, and zurna from master musicians.', 'Duhok Music Academy, Kurdistan', 'educational'),
  ('Kurdish Singles Mixer', 'Meet new people in a relaxed, friendly environment. Ages 25-40.', 'Erbil Social Club, Kurdistan', 'social'),
  ('Art Exhibition: Kurdish Painters', 'Showcase of paintings depicting Kurdish life, landscapes, and culture.', 'Halabja Art Gallery, Kurdistan', 'cultural'),
  ('Kurdish Book Club Meeting', 'Discussion of contemporary Kurdish literature and authors.', 'Sulaymaniyah Bookstore, Kurdistan', 'social')
) AS event_data(title, description, location, category);

-- ============================================
-- PART 9: GENERATE EVENT ATTENDEES
-- ============================================

-- Generate 5-15 attendees for each event
INSERT INTO event_attendees (event_id, user_id, created_at)
SELECT 
  e.id as event_id,
  p.id as user_id,
  e.created_at + (random() * interval '5 days') as created_at
FROM events e
CROSS JOIN LATERAL (
  SELECT id FROM profiles 
  WHERE id != e.user_id 
  ORDER BY random() 
  LIMIT (5 + floor(random() * 11)::INTEGER)
) p
ON CONFLICT DO NOTHING;

-- Update events attendee counts
UPDATE events e
SET attendees_count = (
  SELECT COUNT(*) FROM event_attendees ea WHERE ea.event_id = e.id
);

-- Drop the temporary function
DROP FUNCTION IF EXISTS generate_realistic_messages();