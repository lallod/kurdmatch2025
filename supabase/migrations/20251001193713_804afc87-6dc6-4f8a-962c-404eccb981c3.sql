-- Generate messages for test1@gmail.com user (Evın Zangana)
DO $$
DECLARE
  test_user_id uuid;
  other_user_id uuid;
  other_user_record RECORD;
  message_templates TEXT[] := ARRAY[
    'Hey! How are you doing? 😊',
    'I saw your profile and wanted to say hi!',
    'Would you like to grab coffee sometime?',
    'That''s so interesting! Tell me more.',
    'I love your photos! 📸',
    'What do you like to do for fun?',
    'Have you been to any good restaurants lately?',
    'I''m doing great! How about you?',
    'That sounds amazing! I''d love to hear more.',
    'When are you free to meet up?',
    'I really enjoyed chatting with you!',
    'Let''s stay in touch! 💬',
    'What are you up to this weekend?',
    'I think we have a lot in common!',
    'Your interests are really cool!'
  ];
BEGIN
  -- Get the test user ID
  SELECT id INTO test_user_id
  FROM auth.users
  WHERE email = 'test1@gmail.com';

  IF test_user_id IS NULL THEN
    RAISE NOTICE 'User test1@gmail.com not found';
    RETURN;
  END IF;

  RAISE NOTICE 'Generating messages for user: %', test_user_id;

  -- Get 10 random other users to create conversations with
  FOR other_user_record IN 
    SELECT p.id, p.name
    FROM profiles p
    WHERE p.id != test_user_id
    ORDER BY random()
    LIMIT 10
  LOOP
    other_user_id := other_user_record.id;
    
    -- Create 3-8 messages per conversation
    FOR i IN 1..(3 + floor(random() * 6))
    LOOP
      -- Alternate who sends the message
      IF i % 2 = 1 THEN
        -- Other user sends to test user
        INSERT INTO messages (sender_id, recipient_id, text, read, created_at)
        VALUES (
          other_user_id,
          test_user_id,
          message_templates[1 + floor(random() * array_length(message_templates, 1))],
          random() > 0.3, -- 70% read
          now() - (random() * interval '5 days')
        );
      ELSE
        -- Test user sends to other user
        INSERT INTO messages (sender_id, recipient_id, text, read, created_at)
        VALUES (
          test_user_id,
          other_user_id,
          message_templates[1 + floor(random() * array_length(message_templates, 1))],
          true, -- All outgoing messages are "read"
          now() - (random() * interval '5 days')
        );
      END IF;
    END LOOP;
    
    RAISE NOTICE 'Created conversation with: %', other_user_record.name;
  END LOOP;

  RAISE NOTICE 'Message generation complete!';
END $$;

-- Show conversations for test user
SELECT 
  m.id,
  m.sender_id,
  m.recipient_id,
  m.text,
  m.read,
  m.created_at,
  p.name as other_user_name
FROM messages m
JOIN auth.users u ON u.id = (
  CASE 
    WHEN m.sender_id = (SELECT id FROM auth.users WHERE email = 'test1@gmail.com')
    THEN m.recipient_id
    ELSE m.sender_id
  END
)
JOIN profiles p ON p.id = u.id
WHERE m.sender_id = (SELECT id FROM auth.users WHERE email = 'test1@gmail.com')
   OR m.recipient_id = (SELECT id FROM auth.users WHERE email = 'test1@gmail.com')
ORDER BY m.created_at DESC
LIMIT 20;