-- Generate realistic group content with hashtags
DO $$
DECLARE
  v_group_id uuid;
  v_user_id uuid;
  v_post_id uuid;
  user_ids uuid[];
  group_records RECORD;
BEGIN
  -- Get random user IDs for content creation
  SELECT array_agg(id) INTO user_ids FROM profiles ORDER BY random() LIMIT 40;
  
  -- Loop through each group and add posts
  FOR group_records IN SELECT id, name, category FROM groups ORDER BY name LOOP
    
    -- Generate 8-12 posts per group
    FOR i IN 1..10 LOOP
      v_user_id := user_ids[1 + floor(random() * array_length(user_ids, 1))];
      
      -- Customize content based on group category
      INSERT INTO posts (user_id, content, hashtags, media_type, likes_count, comments_count, created_at)
      VALUES (
        v_user_id,
        CASE group_records.category
          WHEN 'professional' THEN 
            CASE (i % 4)
              WHEN 0 THEN 'Starting my own tech company in Erbil! Excited for this journey 🚀'
              WHEN 1 THEN 'Networking event was amazing! Met so many talented Kurdish professionals tonight'
              WHEN 2 THEN 'Remote work from Kurdistan is the dream. Best work-life balance! 💼'
              ELSE 'Career advice: Never stop learning. Taking online courses has transformed my career'
            END
          WHEN 'lifestyle' THEN
            CASE (i % 4)
              WHEN 0 THEN 'My grandmother''s dolma recipe - the best in Kurdistan! 🍽️'
              WHEN 1 THEN 'Making fresh naan bread this morning. Nothing beats homemade! 🥖'
              WHEN 2 THEN 'Kurdish breakfast spread - can''t start the day without it! ☕'
              ELSE 'Teaching my kids to cook traditional Kurdish dishes. Preserving our culture! ❤️'
            END
          WHEN 'culture' THEN
            CASE (i % 4)
              WHEN 0 THEN 'Learning the daf, such a beautiful traditional instrument 🥁'
              WHEN 1 THEN 'Tonight''s Kurdish poetry reading was soul-touching 📖'
              WHEN 2 THEN 'Kurdish dance workshop this weekend! Who''s coming? 💃'
              ELSE 'Listening to Şivan Perwer tonight. His voice touches the soul 🎵'
            END
          WHEN 'travel' THEN
            CASE (i % 4)
              WHEN 0 THEN 'Hiking through Rawanduz was absolutely breathtaking! 🏔️'
              WHEN 1 THEN 'Visiting Duhok''s beautiful landscapes. Kurdistan is paradise on earth 🌄'
              WHEN 2 THEN 'Road trip through Kurdish villages. The hospitality is unmatched! 🚗'
              ELSE 'Camping under the stars in Kurdistan. Magical experience! ⛺'
            END
          ELSE 'Sharing my thoughts with this amazing community! Love connecting with you all ❤️'
        END,
        CASE group_records.category
          WHEN 'professional' THEN ARRAY['KurdishTech', 'Entrepreneurship', 'Business', 'Career', 'Networking']
          WHEN 'lifestyle' THEN ARRAY['KurdishFood', 'TraditionalCooking', 'Dolma', 'Breakfast', 'Recipe']
          WHEN 'culture' THEN ARRAY['KurdishMusic', 'TraditionalMusic', 'Arts', 'Culture', 'Poetry']
          WHEN 'travel' THEN ARRAY['Kurdistan', 'Travel', 'Hiking', 'Adventure', 'Nature', 'Explore']
          ELSE ARRAY['Community', 'Support', 'Family', 'Life', 'Kurdistan']
        END,
        CASE WHEN random() > 0.4 THEN 'image' ELSE NULL END,
        floor(random() * 70)::int,
        floor(random() * 25)::int,
        now() - (random() * interval '30 days')
      ) RETURNING id INTO v_post_id;
      
      -- Link post to group
      INSERT INTO group_posts (post_id, group_id) VALUES (v_post_id, group_records.id);
    END LOOP;
    
    -- Add members to each group
    FOR i IN 1..15 LOOP
      v_user_id := user_ids[1 + floor(random() * array_length(user_ids, 1))];
      
      INSERT INTO group_members (group_id, user_id, role)
      VALUES (group_records.id, v_user_id, CASE WHEN i = 1 THEN 'admin' ELSE 'member' END)
      ON CONFLICT (group_id, user_id) DO NOTHING;
    END LOOP;
  END LOOP;
  
  -- Create hashtag entries for all used hashtags
  INSERT INTO hashtags (name, usage_count, last_used_at)
  VALUES 
    ('KurdishTech', 12, now()),
    ('Entrepreneurship', 12, now()),
    ('Business', 12, now()),
    ('Career', 12, now()),
    ('Networking', 12, now()),
    ('KurdishFood', 10, now()),
    ('TraditionalCooking', 10, now()),
    ('Dolma', 10, now()),
    ('Breakfast', 10, now()),
    ('Recipe', 10, now()),
    ('KurdishMusic', 10, now()),
    ('TraditionalMusic', 10, now()),
    ('Arts', 10, now()),
    ('Culture', 10, now()),
    ('Poetry', 10, now()),
    ('SingleParent', 8, now()),
    ('ParentingLife', 8, now()),
    ('Support', 8, now()),
    ('Family', 8, now()),
    ('Community', 8, now()),
    ('Kurdistan', 10, now()),
    ('Travel', 10, now()),
    ('Hiking', 10, now()),
    ('Adventure', 10, now()),
    ('Nature', 10, now()),
    ('Explore', 10, now()),
    ('Life', 5, now())
  ON CONFLICT (name) DO UPDATE SET
    usage_count = hashtags.usage_count + EXCLUDED.usage_count,
    last_used_at = EXCLUDED.last_used_at;
  
  -- Update group post counts
  UPDATE groups g
  SET post_count = (
    SELECT COUNT(*) FROM group_posts gp WHERE gp.group_id = g.id
  );
  
  -- Update group member counts
  UPDATE groups g
  SET member_count = (
    SELECT COUNT(*) FROM group_members gm WHERE gm.group_id = g.id
  );
  
END $$;