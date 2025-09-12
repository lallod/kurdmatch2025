-- Insert essential registration questions that match profile structure
INSERT INTO registration_questions (id, text, category, field_type, registration_step, placeholder, field_options, profile_field, required, enabled, display_order, is_system_field) VALUES

-- Basic Information Step
('full_name', 'What''s your full name?', 'basic_info', 'text', 'basic_info', 'Enter your full name', '{}', 'name', true, true, 1, true),
('age', 'How old are you?', 'basic_info', 'number', 'basic_info', 'Enter your age', '{}', 'age', true, true, 2, true),
('gender', 'What''s your gender?', 'basic_info', 'select', 'basic_info', 'Select gender', '{"Male", "Female", "Non-binary", "Prefer not to say"}', 'gender', true, true, 3, true),
('location', 'Where are you located?', 'basic_info', 'text', 'basic_info', 'Enter your city, country', '{}', 'location', true, true, 4, true),

-- Profile Details Step
('occupation', 'What do you do for work?', 'profile_details', 'text', 'profile_details', 'Enter your occupation', '{}', 'occupation', true, true, 5, true),
('education', 'What''s your education level?', 'profile_details', 'select', 'profile_details', 'Select education', '{"High School", "Some College", "Bachelor''s Degree", "Master''s Degree", "PhD", "Trade School", "Other"}', 'education', true, true, 6, true),
('height', 'How tall are you?', 'profile_details', 'select', 'profile_details', 'Select height', '{"4''10\"", "4''11\"", "5''0\"", "5''1\"", "5''2\"", "5''3\"", "5''4\"", "5''5\"", "5''6\"", "5''7\"", "5''8\"", "5''9\"", "5''10\"", "5''11\"", "6''0\"", "6''1\"", "6''2\"", "6''3\"", "6''4\"", "6''5\"", "6''6\""}', 'height', true, true, 7, true),
('body_type', 'What''s your body type?', 'profile_details', 'select', 'profile_details', 'Select body type', '{"Slim", "Average", "Athletic", "Curvy", "Heavyset", "Prefer not to say"}', 'body_type', true, true, 8, true),

-- Cultural Identity Step  
('kurdistan_region', 'Which part of Kurdistan are you from?', 'cultural_identity', 'select', 'cultural_identity', 'Select region', '{"South-Kurdistan", "West-Kurdistan", "East-Kurdistan", "North-Kurdistan"}', 'kurdistan_region', true, true, 9, true),
('ethnicity', 'What''s your ethnicity?', 'cultural_identity', 'select', 'cultural_identity', 'Select ethnicity', '{"Kurdish", "Kurdish-Arab", "Kurdish-Turkish", "Kurdish-Persian", "Mixed", "Other"}', 'ethnicity', true, true, 10, true),
('religion', 'What''s your religious background?', 'cultural_identity', 'select', 'cultural_identity', 'Select religion', '{"Islam", "Christianity", "Judaism", "Zoroastrianism", "Yarsanism", "Atheist", "Agnostic", "Spiritual", "Other", "Prefer not to say"}', 'religion', true, true, 11, true),
('languages', 'What languages do you speak?', 'cultural_identity', 'multi_select', 'cultural_identity', 'Select languages', '{"Kurdish (Kurmanji)", "Kurdish (Sorani)", "Kurdish (Pehlewani)", "Kurdish (Zazaki)", "Arabic", "Turkish", "Persian", "English", "French", "German", "Other"}', 'languages', true, true, 12, true),

-- Lifestyle Step
('relationship_goals', 'What are you looking for?', 'lifestyle', 'select', 'lifestyle', 'Select relationship goals', '{"Long-term relationship", "Marriage", "Dating", "Friendship", "Not sure yet"}', 'relationship_goals', true, true, 13, true),
('want_children', 'Do you want children?', 'lifestyle', 'select', 'lifestyle', 'Select preference', '{"Want children", "Have children", "Don''t want children", "Open to children", "Not sure"}', 'want_children', true, true, 14, true),
('exercise_habits', 'How often do you exercise?', 'lifestyle', 'select', 'lifestyle', 'Select frequency', '{"Daily", "Few times a week", "Weekly", "Sometimes", "Rarely", "Never"}', 'exercise_habits', true, true, 15, true),

-- Interests Step
('interests', 'What are your interests? (Select at least 3)', 'interests', 'multi_select', 'interests', 'Select interests', '{"Music", "Travel", "Food & Cooking", "Sports", "Reading", "Movies & TV", "Photography", "Art", "Technology", "Politics", "History", "Nature & Outdoors", "Fashion", "Gaming", "Dancing", "Family Time"}', 'interests', true, true, 16, true),
('hobbies', 'What are your hobbies? (Select at least 2)', 'interests', 'multi_select', 'interests', 'Select hobbies', '{"Reading", "Cooking", "Hiking", "Gaming", "Traveling", "Photography", "Music", "Sports", "Art", "Writing", "Gardening", "Fitness", "Movies", "Dancing", "Learning languages"}', 'hobbies', true, true, 17, true),
('values', 'What values are important to you? (Select at least 3)', 'interests', 'multi_select', 'interests', 'Select values', '{"Family", "Honesty", "Respect", "Loyalty", "Independence", "Tradition", "Adventure", "Ambition", "Kindness", "Humor", "Intelligence", "Spirituality", "Creativity", "Social Justice"}', 'values', true, true, 18, true),

-- About Me Step
('bio', 'Tell us about yourself (minimum 20 characters)', 'about_me', 'textarea', 'about_me', 'Write a brief description about yourself, your interests, and what you''re looking for...', '{}', 'bio', true, true, 19, true),

-- Account Setup Step
('email', 'What''s your email address?', 'account_setup', 'email', 'account_setup', 'Enter your email', '{}', 'email', true, true, 20, true),
('password', 'Create a password', 'account_setup', 'password', 'account_setup', 'Enter a secure password', '{}', 'password', true, true, 21, true)

ON CONFLICT (id) DO UPDATE SET
  text = EXCLUDED.text,
  category = EXCLUDED.category,
  field_type = EXCLUDED.field_type,
  registration_step = EXCLUDED.registration_step,
  placeholder = EXCLUDED.placeholder,
  field_options = EXCLUDED.field_options,
  profile_field = EXCLUDED.profile_field,
  required = EXCLUDED.required,
  enabled = EXCLUDED.enabled,
  display_order = EXCLUDED.display_order,
  is_system_field = EXCLUDED.is_system_field;