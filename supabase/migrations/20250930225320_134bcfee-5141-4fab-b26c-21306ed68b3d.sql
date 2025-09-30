-- Drop all foreign keys
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE followers DROP CONSTRAINT IF EXISTS followers_follower_id_fkey,DROP CONSTRAINT IF EXISTS followers_following_id_fkey;
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_liker_id_fkey,DROP CONSTRAINT IF EXISTS likes_likee_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey,DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_user1_id_fkey,DROP CONSTRAINT IF EXISTS matches_user2_id_fkey;
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_user_id_fkey;
ALTER TABLE stories DROP CONSTRAINT IF EXISTS stories_user_id_fkey;
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_user_id_fkey;
ALTER TABLE user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE user_subscriptions DROP CONSTRAINT IF EXISTS user_subscriptions_user_id_fkey;
ALTER TABLE daily_usage DROP CONSTRAINT IF EXISTS daily_usage_user_id_fkey;
TRUNCATE post_comments,post_likes,event_attendees,stories,posts,events,messages,likes,matches,followers,photos,daily_usage,user_subscriptions,user_roles,admin_activities,dashboard_stats,user_engagement,profiles CASCADE;

CREATE TEMP TABLE c (n TEXT,co TEXT,lat FLOAT,lon FLOAT,r TEXT);
INSERT INTO c VALUES('Erbil','Iraq',36.19,44.01,'South-Kurdistan'),('Sulaymaniyah','Iraq',35.56,45.44,'South-Kurdistan'),('Dohuk','Iraq',36.87,42.97,'South-Kurdistan'),('Diyarbakır','Turkey',37.91,40.23,'North-Kurdistan'),('Van','Turkey',38.49,43.41,'North-Kurdistan'),('Qamishli','Syria',37.05,41.22,'West-Kurdistan'),('Kobane','Syria',36.89,38.35,'West-Kurdistan'),('Sanandaj','Iran',35.32,47.01,'East-Kurdistan'),('Tehran','Iran',35.69,51.39,'East-Kurdistan'),('Istanbul','Turkey',41.01,28.98,'North-Kurdistan'),('Damascus','Syria',33.51,36.28,'West-Kurdistan'),('Berlin','Germany',52.52,13.41,NULL),('Paris','France',48.86,2.35,NULL),('London','UK',51.51,-0.13,NULL),('New York','USA',40.71,-74.01,NULL),('Toronto','Canada',43.65,-79.38,NULL),('Stockholm','Sweden',59.33,18.07,NULL),('Sydney','Australia',-33.87,151.21,NULL);

DO $$ DECLARE uid uuid; ct RECORD; BEGIN
  FOR i IN 1..500 LOOP uid:=gen_random_uuid(); SELECT * INTO ct FROM c ORDER BY random() LIMIT 1;
    INSERT INTO profiles (id,name,age,gender,location,kurdistan_region,occupation,education,height,body_type,religion,relationship_goals,want_children,exercise_habits,verified,last_active,created_at,latitude,longitude,values,interests,hobbies,languages,bio,profile_image,ethnicity,political_views,smoking,drinking,zodiac_sign,personality_type,sleep_schedule,travel_frequency,communication_style,love_language,work_environment)
    VALUES (uid,(ARRAY['Azad','Rojhat','Kawa','Rojin','Berfin','Zilan'])[1+floor(random()*6)]||' '||(ARRAY['Barzani','Talabani','Kurdi'])[1+floor(random()*3)],22+floor(random()*35),CASE WHEN random()>0.5 THEN 'male' ELSE 'female' END,ct.n||', '||ct.co,COALESCE(ct.r,'Diaspora'),(ARRAY['Engineer','Doctor','Teacher'])[1+floor(random()*3)],(ARRAY['Bachelor''s','Master''s'])[1+floor(random()*2)],(ARRAY['5''6"','5''8"','5''10"'])[1+floor(random()*3)],(ARRAY['Slim','Average','Athletic'])[1+floor(random()*3)],(ARRAY['Islam','Secular'])[1+floor(random()*2)],(ARRAY['Marriage','Serious'])[1+floor(random()*2)],(ARRAY['Want children','Open'])[1+floor(random()*2)],'Often',random()>0.8,now()-random()*'7d'::interval,now()-random()*'365d'::interval,ct.lat,ct.lon,ARRAY['Family','Heritage','Honesty','Community'],ARRAY['Music','Culture','Poetry','Travel','Art'],ARRAY['Reading','Cooking','Dancing'],ARRAY['Kurdish','English','Arabic'],'Proud Kurdish from '||ct.n,'https://randomuser.me/api/portraits/'||CASE WHEN random()>0.5 THEN 'men/' ELSE 'women/' END||(1+floor(random()*80))::text||'.jpg','Kurdish','Moderate','Non-smoker','Social',(ARRAY['Aries','Taurus'])[1+floor(random()*2)],'INFJ','Early bird','Frequent','Direct','Quality Time','Remote');
    FOR j IN 1..6 LOOP INSERT INTO photos (profile_id,url,is_primary) VALUES (uid,'https://randomuser.me/api/portraits/'||CASE WHEN random()>0.5 THEN 'men/' ELSE 'women/' END||(1+floor(random()*80))::text||'.jpg',j=1); END LOOP;
    FOR j IN 1..7 LOOP INSERT INTO posts (user_id,content,media_url,media_type) VALUES (uid,(ARRAY['دڵخۆشە ❤️','Kurdish 💚','Family 👨‍👩‍👧‍👦'])[1+floor(random()*3)],'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800','image'); END LOOP;
    FOR j IN 1..4 LOOP INSERT INTO stories (user_id,media_url,media_type,duration) VALUES (uid,'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600','image',15); END LOOP;
    IF random()<0.1 THEN INSERT INTO user_subscriptions (user_id,subscription_type,expires_at) VALUES (uid,'premium',now()+'90d'::interval); END IF;
  END LOOP; END $$;

DO $$ DECLARE u RECORD; ts uuid[]; t uuid; p RECORD; BEGIN
  FOR u IN SELECT id FROM profiles ORDER BY random() LIMIT 500 LOOP
    SELECT array_agg(id) INTO ts FROM (SELECT id FROM profiles WHERE id!=u.id ORDER BY random() LIMIT 12) s;
    FOREACH t IN ARRAY ts LOOP
      IF random()>0.3 THEN INSERT INTO likes (liker_id,likee_id) VALUES (u.id,t) ON CONFLICT DO NOTHING; END IF;
      IF random()>0.5 THEN INSERT INTO followers (follower_id,following_id) VALUES (u.id,t) ON CONFLICT DO NOTHING; END IF;
      IF random()>0.8 AND EXISTS (SELECT 1 FROM likes WHERE liker_id=t AND likee_id=u.id) THEN
        INSERT INTO matches (user1_id,user2_id) VALUES (u.id,t) ON CONFLICT DO NOTHING;
        FOR i IN 1..5 LOOP INSERT INTO messages (sender_id,recipient_id,text) VALUES (CASE WHEN random()>0.5 THEN u.id ELSE t END,CASE WHEN random()>0.5 THEN t ELSE u.id END,(ARRAY['Hey!','سڵاو'])[1+floor(random()*2)]); END LOOP;
      END IF;
    END LOOP;
    FOR p IN SELECT id FROM posts WHERE user_id=ANY(ts) ORDER BY random() LIMIT 8 LOOP
      INSERT INTO post_likes (post_id,user_id) VALUES (p.id,u.id) ON CONFLICT DO NOTHING;
      IF random()>0.7 THEN INSERT INTO post_comments (post_id,user_id,content) VALUES (p.id,u.id,'Love this!'); END IF;
    END LOOP;
  END LOOP; END $$;

DO $$ DECLARE a uuid; e uuid; BEGIN
  FOR i IN 1..2 LOOP SELECT id INTO a FROM profiles ORDER BY random() LIMIT 1;
    INSERT INTO user_roles (user_id,role) VALUES (a,'super_admin');
    UPDATE profiles SET verified=true WHERE id=a;
  END LOOP;
  FOR i IN 1..10 LOOP
    INSERT INTO events (user_id,title,description,location,event_date,max_attendees,category) VALUES ((SELECT id FROM profiles ORDER BY random() LIMIT 1),'Newroz 2024','Kurdish culture!',(SELECT location FROM profiles ORDER BY random() LIMIT 1),now()+random()*'60d'::interval,50,'cultural') RETURNING id INTO e;
    INSERT INTO event_attendees (event_id,user_id) SELECT e,id FROM profiles ORDER BY random() LIMIT floor(random()*20) ON CONFLICT DO NOTHING;
  END LOOP; END $$;

UPDATE posts p SET likes_count=(SELECT COUNT(*) FROM post_likes WHERE post_id=p.id),comments_count=(SELECT COUNT(*) FROM post_comments WHERE post_id=p.id);
UPDATE events e SET attendees_count=(SELECT COUNT(*) FROM event_attendees WHERE event_id=e.id);