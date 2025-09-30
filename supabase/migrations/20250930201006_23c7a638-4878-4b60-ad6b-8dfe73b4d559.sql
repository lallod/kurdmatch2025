-- Create function to generate sample posts from existing users
CREATE OR REPLACE FUNCTION public.generate_sample_posts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  profile_record RECORD;
  post_count INTEGER := 0;
  sample_contents TEXT[] := ARRAY[
    'Just had the most amazing Kurdish tea at a local café ☕️ Nothing beats our traditional hospitality!',
    'Exploring the beautiful mountains of Kurdistan today. The view is breathtaking! 🏔️',
    'Missing home and the taste of authentic dolma. Who else loves Kurdish cuisine? 🍽️',
    'Attended a wonderful Kurdish cultural event tonight. So proud of our heritage! 🎉',
    'Learning to play the daf. Our traditional music is so beautiful and meaningful 🥁',
    'Reading some beautiful Kurdish poetry tonight. Sherko Bekas always touches my soul 📖',
    'Family gathering today! Nothing is more important than being together ❤️',
    'Started my day with some traditional Kurdish breakfast. Best way to start the morning! 🌅',
    'Practicing my English and Arabic. Language learning is a journey! 📚',
    'Just finished an amazing workout session. Staying healthy and strong! 💪',
    'Weekend plans: visiting relatives and enjoying home-cooked meals 🍲',
    'Watching the sunset from the citadel. Kurdistan has the most beautiful sunsets 🌇',
    'Coffee date with friends. Good conversations and even better company ☕',
    'Working on my new project. Excited about what''s coming! 🚀',
    'Celebrating Newroz with family and friends. Happy New Year! 🔥'
  ];
  sample_images TEXT[] := ARRAY[
    'https://images.unsplash.com/photo-1495562569060-2eec283d3391?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800'
  ];
BEGIN
  -- Loop through random profiles and create 2-3 posts each
  FOR profile_record IN 
    SELECT id, name FROM profiles ORDER BY random() LIMIT 20
  LOOP
    -- Create 2-3 posts per user
    FOR i IN 1..(1 + floor(random() * 3))
    LOOP
      INSERT INTO posts (
        user_id,
        content,
        media_url,
        media_type,
        likes_count,
        comments_count,
        created_at
      )
      VALUES (
        profile_record.id,
        sample_contents[1 + floor(random() * array_length(sample_contents, 1))],
        CASE 
          WHEN random() > 0.4 THEN sample_images[1 + floor(random() * array_length(sample_images, 1))]
          ELSE NULL
        END,
        CASE 
          WHEN random() > 0.4 THEN 'image'
          ELSE NULL
        END,
        floor(random() * 100),
        floor(random() * 20),
        now() - (random() * interval '7 days')
      );
      
      post_count := post_count + 1;
    END LOOP;
  END LOOP;
  
  RETURN post_count;
END;
$$;

-- Generate sample posts
SELECT generate_sample_posts();