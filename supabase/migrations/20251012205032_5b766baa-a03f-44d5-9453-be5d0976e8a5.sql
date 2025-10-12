-- Generate sample stories for users with Kurdish-themed content
-- Insert stories with various media types and categories

-- Get random profile IDs to use as story creators
DO $$
DECLARE
  user_ids UUID[] := ARRAY[
    '82e68c9c-f647-4fcb-85e6-57228191a115',
    'ff422059-d69d-4630-81cf-ae7021f8c7f6',
    'bb0e9f7d-0e8b-4042-b11e-c533609f05b0',
    '4a0a7972-0129-4d7e-8257-4d2da5e445ca',
    'c05e5db4-70e5-4355-8f66-0960d0dd9fc7',
    '085b1184-305e-4d9e-bb07-e6dd05e0851e',
    '2ca968a5-efc5-4809-8519-2bd21e119bd7',
    'af184c98-e626-45bb-bce8-29bf00478c3a',
    '6a9355d4-d77e-4fbe-934a-49988621676a',
    '17fea8c3-b590-41e7-a72d-6b8a2f4b1a2c'
  ];
  
  media_urls TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
    'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=400&h=700&fit=crop',
    'https://images.unsplash.com/photo-1523906630133-f6934a1ab2b9?w=400&h=700&fit=crop',
    'https://images.unsplash.com/photo-1502759683299-cdcd6974244f?w=400&h=700&fit=crop',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=700&fit=crop',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=700&fit=crop',
    'https://images.unsplash.com/photo-1511882150382-421056c89033?w=400&h=700&fit=crop',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=700&fit=crop'
  ];
  
  categories TEXT[] := ARRAY['culture', 'lifestyle', 'food', 'travel', 'music', 'general'];
  
  random_user UUID;
  random_media TEXT;
  random_category TEXT;
  i INT;
BEGIN
  -- Create 15 new stories
  FOR i IN 1..15 LOOP
    random_user := user_ids[1 + floor(random() * array_length(user_ids, 1))];
    random_media := media_urls[1 + floor(random() * array_length(media_urls, 1))];
    random_category := categories[1 + floor(random() * array_length(categories, 1))];
    
    INSERT INTO stories (
      user_id,
      media_url,
      media_type,
      category,
      duration,
      created_at,
      expires_at
    )
    VALUES (
      random_user,
      random_media,
      'image',
      random_category,
      15,
      now() - (random() * interval '12 hours'),
      now() + interval '12 hours'
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;