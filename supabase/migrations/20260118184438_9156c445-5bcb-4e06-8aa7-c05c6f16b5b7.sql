-- =============================================
-- STEG 1: Typing Status Cleanup
-- =============================================

-- 1. Funksjon for å rydde opp gamle typing status records
CREATE OR REPLACE FUNCTION public.cleanup_old_typing_status()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM typing_status 
  WHERE updated_at < NOW() - INTERVAL '1 hour';
$$;

-- 2. Trigger-funksjon som kjører cleanup ved hver insert
CREATE OR REPLACE FUNCTION public.trigger_cleanup_typing_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Kjør cleanup asynkront (sletter gamle records)
  PERFORM cleanup_old_typing_status();
  RETURN NEW;
END;
$$;

-- 3. Trigger som aktiveres ved INSERT på typing_status
DROP TRIGGER IF EXISTS cleanup_typing_on_insert ON typing_status;
CREATE TRIGGER cleanup_typing_on_insert
  AFTER INSERT ON typing_status
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_cleanup_typing_status();

-- =============================================
-- STEG 2: Push Subscriptions Cleanup
-- =============================================

-- 1. Funksjon for å rydde opp døde push subscriptions
CREATE OR REPLACE FUNCTION public.cleanup_dead_push_subscriptions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Slett subscriptions som ikke er brukt på 30 dager eller er inaktive
  DELETE FROM push_subscriptions 
  WHERE last_used_at < NOW() - INTERVAL '30 days'
  OR is_active = false;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- =============================================
-- STEG 3: Kompatibilitets-algoritme
-- =============================================

-- Funksjon for å beregne kompatibilitet mellom to brukere
CREATE OR REPLACE FUNCTION public.calculate_compatibility(user1_uuid UUID, user2_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  score INTEGER := 50; -- Base score
  user1_profile profiles%ROWTYPE;
  user2_profile profiles%ROWTYPE;
  shared_interests INTEGER := 0;
  shared_values INTEGER := 0;
  shared_hobbies INTEGER := 0;
BEGIN
  -- Hent begge profiler
  SELECT * INTO user1_profile FROM profiles WHERE id = user1_uuid;
  SELECT * INTO user2_profile FROM profiles WHERE id = user2_uuid;
  
  -- Hvis en profil ikke finnes, returner base score
  IF user1_profile.id IS NULL OR user2_profile.id IS NULL THEN
    RETURN score;
  END IF;
  
  -- Felles interesser (+2 per interesse, max +20)
  IF user1_profile.interests IS NOT NULL AND user2_profile.interests IS NOT NULL THEN
    SELECT COUNT(*) INTO shared_interests
    FROM unnest(user1_profile.interests) AS i1
    WHERE i1 = ANY(user2_profile.interests);
    score := score + LEAST(shared_interests * 2, 20);
  END IF;
  
  -- Felles verdier (+3 per verdi, max +15)
  IF user1_profile.values IS NOT NULL AND user2_profile.values IS NOT NULL THEN
    SELECT COUNT(*) INTO shared_values
    FROM unnest(user1_profile.values) AS v1
    WHERE v1 = ANY(user2_profile.values);
    score := score + LEAST(shared_values * 3, 15);
  END IF;
  
  -- Felles hobbyer (+2 per hobby, max +10)
  IF user1_profile.hobbies IS NOT NULL AND user2_profile.hobbies IS NOT NULL THEN
    SELECT COUNT(*) INTO shared_hobbies
    FROM unnest(user1_profile.hobbies) AS h1
    WHERE h1 = ANY(user2_profile.hobbies);
    score := score + LEAST(shared_hobbies * 2, 10);
  END IF;
  
  -- Samme Kurdistan-region (+5)
  IF user1_profile.kurdistan_region IS NOT NULL 
     AND user1_profile.kurdistan_region = user2_profile.kurdistan_region THEN
    score := score + 5;
  END IF;
  
  -- Samme relationship goals (+10)
  IF user1_profile.relationship_goals IS NOT NULL 
     AND user1_profile.relationship_goals = user2_profile.relationship_goals THEN
    score := score + 10;
  END IF;
  
  -- Samme religion (+5)
  IF user1_profile.religion IS NOT NULL 
     AND user1_profile.religion = user2_profile.religion THEN
    score := score + 5;
  END IF;
  
  -- Lignende alder (±5 år = +5)
  IF ABS(user1_profile.age - user2_profile.age) <= 5 THEN
    score := score + 5;
  END IF;
  
  -- Begrens til 100
  RETURN LEAST(score, 100);
END;
$$;

-- Funksjon for å hente ekte notification counts
CREATE OR REPLACE FUNCTION public.get_notification_counts(user_uuid UUID)
RETURNS TABLE(
  unread_messages INTEGER,
  new_views INTEGER,
  new_likes INTEGER,
  new_matches INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    -- Uleste meldinger
    (SELECT COUNT(*)::INTEGER FROM messages 
     WHERE recipient_id = user_uuid AND read = false),
    
    -- Nye profilvisninger (siste 7 dager)
    (SELECT COUNT(*)::INTEGER FROM profile_views 
     WHERE viewed_profile_id = user_uuid 
     AND created_at > NOW() - INTERVAL '7 days'),
    
    -- Nye likes (siste 7 dager)
    (SELECT COUNT(*)::INTEGER FROM likes 
     WHERE likee_id = user_uuid 
     AND created_at > NOW() - INTERVAL '7 days'),
    
    -- Nye matches (siste 7 dager)
    (SELECT COUNT(*)::INTEGER FROM matches 
     WHERE (user1_id = user_uuid OR user2_id = user_uuid) 
     AND matched_at > NOW() - INTERVAL '7 days');
END;
$$;