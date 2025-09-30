-- First, ensure the current authenticated user has a profile
INSERT INTO profiles (id, name, age, gender, location, occupation, bio, profile_image, height, body_type, ethnicity, religion, kurdistan_region, education, relationship_goals, want_children, exercise_habits)
SELECT 
  id,
  COALESCE(raw_user_meta_data->>'name', 'User'),
  25,
  'male',
  'Erbil, Kurdistan',
  'Not specified',
  'Tell us about yourself...',
  'https://placehold.co/400',
  '5''8"',
  'Average',
  'Kurdish',
  'Prefer not to say',
  'South-Kurdistan',
  'Not specified',
  'Looking for something serious',
  'Open to children',
  'Sometimes'
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = auth.users.id
);

-- Clean up any orphaned records before adding foreign keys
DELETE FROM user_subscriptions WHERE user_id NOT IN (SELECT id FROM profiles);
DELETE FROM user_roles WHERE user_id NOT IN (SELECT id FROM profiles);
DELETE FROM daily_usage WHERE user_id NOT IN (SELECT id FROM profiles);
DELETE FROM likes WHERE liker_id NOT IN (SELECT id FROM profiles) OR likee_id NOT IN (SELECT id FROM profiles);
DELETE FROM followers WHERE follower_id NOT IN (SELECT id FROM profiles) OR following_id NOT IN (SELECT id FROM profiles);
DELETE FROM matches WHERE user1_id NOT IN (SELECT id FROM profiles) OR user2_id NOT IN (SELECT id FROM profiles);
DELETE FROM messages WHERE sender_id NOT IN (SELECT id FROM profiles) OR recipient_id NOT IN (SELECT id FROM profiles);
DELETE FROM posts WHERE user_id NOT IN (SELECT id FROM profiles);
DELETE FROM stories WHERE user_id NOT IN (SELECT id FROM profiles);
DELETE FROM events WHERE user_id NOT IN (SELECT id FROM profiles);

-- Now add foreign key relationships to profiles table
ALTER TABLE posts 
ADD CONSTRAINT posts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE stories 
ADD CONSTRAINT stories_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE events 
ADD CONSTRAINT events_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_recipient_id_fkey 
FOREIGN KEY (recipient_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE likes 
ADD CONSTRAINT likes_liker_id_fkey 
FOREIGN KEY (liker_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE likes 
ADD CONSTRAINT likes_likee_id_fkey 
FOREIGN KEY (likee_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE matches 
ADD CONSTRAINT matches_user1_id_fkey 
FOREIGN KEY (user1_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE matches 
ADD CONSTRAINT matches_user2_id_fkey 
FOREIGN KEY (user2_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE followers 
ADD CONSTRAINT followers_follower_id_fkey 
FOREIGN KEY (follower_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE followers 
ADD CONSTRAINT followers_following_id_fkey 
FOREIGN KEY (following_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_roles 
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_subscriptions 
ADD CONSTRAINT user_subscriptions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE daily_usage 
ADD CONSTRAINT daily_usage_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;