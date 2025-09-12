-- Add missing required registration questions for comprehensive profile validation

-- Dietary Preferences
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('dietary_preferences', 'What''s your diet like?', 'lifestyle', 'select', true, true, 'lifestyle', 50, NULL, ARRAY['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Gluten-free', 'Other'], 'dietary_preferences')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Smoking
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('smoking', 'Do you smoke?', 'lifestyle', 'select', true, true, 'lifestyle', 51, NULL, ARRAY['Never', 'Occasionally', 'Socially', 'Regularly', 'Trying to quit', 'Prefer not to say'], 'smoking')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Drinking
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('drinking', 'Do you drink alcohol?', 'lifestyle', 'select', true, true, 'lifestyle', 52, NULL, ARRAY['Never', 'Rarely', 'Socially', 'Regularly', 'Occasionally', 'Prefer not to say'], 'drinking')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Sleep Schedule
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('sleep_schedule', 'Are you a night owl or early bird?', 'lifestyle', 'select', true, true, 'lifestyle', 53, NULL, ARRAY['Early Bird', 'Night Owl', 'Flexible', 'Depends on the day'], 'sleep_schedule')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Pets
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('have_pets', 'Do you have pets?', 'lifestyle', 'select', true, true, 'lifestyle', 54, NULL, ARRAY['No pets', 'Dog', 'Cat', 'Both', 'Other pets', 'Want pets', 'Allergic to pets'], 'have_pets')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Political Views
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('political_views', 'Select political views', 'values_personality', 'select', true, true, 'cultural_identity', 25, NULL, ARRAY['Liberal', 'Conservative', 'Moderate', 'Progressive', 'Libertarian', 'Socialist', 'Independent', 'Not political', 'Prefer not to say'], 'political_views')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Zodiac Sign
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('zodiac_sign', 'Select zodiac sign', 'values_personality', 'select', true, true, 'cultural_identity', 26, NULL, ARRAY['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'], 'zodiac_sign')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- MBTI Personality Type
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('personality_type', 'Select personality type', 'values_personality', 'select', true, true, 'cultural_identity', 27, NULL, ARRAY['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP', 'Not sure'], 'personality_type')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Family Closeness
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('family_closeness', 'How close are you to family?', 'relationship_preferences', 'select', true, true, 'lifestyle', 55, NULL, ARRAY['Very close', 'Close', 'Somewhat close', 'Not very close', 'Distant', 'Complicated'], 'family_closeness')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Love Language
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('love_language', 'How do you feel most loved?', 'relationship_preferences', 'select', true, true, 'lifestyle', 56, NULL, ARRAY['Words of Affirmation', 'Quality Time', 'Physical Touch', 'Acts of Service', 'Receiving Gifts'], 'love_language')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Communication Style
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('communication_style', 'How do you communicate?', 'relationship_preferences', 'select', true, true, 'lifestyle', 57, NULL, ARRAY['Direct', 'Gentle', 'Humorous', 'Thoughtful', 'Emotional', 'Logical', 'Mixed'], 'communication_style')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Ideal Date
INSERT INTO registration_questions (id, text, category, field_type, required, enabled, registration_step, display_order, placeholder, field_options, profile_field)
VALUES ('ideal_date', 'What''s your ideal date?', 'relationship_preferences', 'select', true, true, 'lifestyle', 58, NULL, ARRAY['Dinner and movie', 'Coffee and conversation', 'Outdoor adventure', 'Museum or cultural event', 'Cooking together', 'Concert or show', 'Beach or park', 'Something spontaneous'], 'ideal_date')
ON CONFLICT (id) DO UPDATE SET
  field_options = EXCLUDED.field_options,
  text = EXCLUDED.text;

-- Update Interests with comprehensive list
UPDATE registration_questions 
SET field_options = ARRAY[
  'Travel', 'Photography', 'Cooking', 'Hiking', 'Reading', 'Music', 'Dancing', 'Sports', 'Fitness', 'Art', 
  'Movies', 'Gaming', 'Technology', 'Fashion', 'Food', 'Nature', 'Animals', 'History', 'Science', 'Politics'
],
text = 'Select your interests (Choose at least 3)'
WHERE id = 'interests';

-- Update Hobbies with comprehensive list including Creative Pursuits and Weekend Activities  
UPDATE registration_questions 
SET field_options = ARRAY[
  'Drawing', 'Painting', 'Writing', 'Singing', 'Playing instruments', 'Gardening', 'Crafting', 'Collecting', 
  'Board games', 'Video games', 'Yoga', 'Meditation', 'Running', 'Cycling', 'Swimming', 'Rock climbing', 
  'Martial arts', 'Chess', 'Photography', 'Music production', 'Graphic design', 'Web development', 'Pottery', 
  'Jewelry making', 'Knitting', 'Woodworking', 'Sculpture', 'Hiking', 'Beach trips', 'Museum visits', 
  'Concerts', 'Farmers markets', 'Brunch', 'Movie marathons', 'Game nights', 'Road trips', 'Camping', 
  'Shopping', 'Volunteering'
],
text = 'Select your hobbies (Choose at least 2)'
WHERE id = 'hobbies';

-- Update Core Values with exact list provided
UPDATE registration_questions 
SET field_options = ARRAY[
  'Honesty', 'Kindness', 'Growth', 'Balance', 'Adventure', 'Family', 'Career', 'Health', 'Creativity', 
  'Spirituality', 'Freedom', 'Loyalty'
],
text = 'Select your core values (Choose at least 3)'
WHERE id = 'values';

-- Update Languages with comprehensive list
UPDATE registration_questions 
SET field_options = ARRAY[
  'Kurdish', 'English', 'Arabic', 'Turkish', 'Persian', 'German', 'French', 'Spanish', 'Italian', 'Dutch', 'Swedish'
],
text = 'What languages do you speak? (Select at least 1)'
WHERE id = 'languages';