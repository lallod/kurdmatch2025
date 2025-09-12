-- Add only missing foreign key constraints and indexes
-- Check and add foreign keys for likes table only if they don't exist
DO $$ 
BEGIN
    -- Add likes foreign keys if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'likes_liker_id_fkey') THEN
        ALTER TABLE public.likes 
        ADD CONSTRAINT likes_liker_id_fkey 
        FOREIGN KEY (liker_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'likes_likee_id_fkey') THEN
        ALTER TABLE public.likes 
        ADD CONSTRAINT likes_likee_id_fkey 
        FOREIGN KEY (likee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    -- Add messages foreign keys if they don't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_sender_id_fkey') THEN
        ALTER TABLE public.messages 
        ADD CONSTRAINT messages_sender_id_fkey 
        FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_recipient_id_fkey') THEN
        ALTER TABLE public.messages 
        ADD CONSTRAINT messages_recipient_id_fkey 
        FOREIGN KEY (recipient_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_matches_user1_id ON public.matches(user1_id);
CREATE INDEX IF NOT EXISTS idx_matches_user2_id ON public.matches(user2_id);
CREATE INDEX IF NOT EXISTS idx_likes_liker_id ON public.likes(liker_id);
CREATE INDEX IF NOT EXISTS idx_likes_likee_id ON public.likes(likee_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);

-- Fix function search path security issues
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, name, age, location, occupation, verified, profile_image)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'), 
    COALESCE((NEW.raw_user_meta_data->>'age')::int, 25),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Unknown Location'),
    COALESCE(NEW.raw_user_meta_data->>'occupation', 'Not specified'),
    false,
    COALESCE(NEW.raw_user_meta_data->>'profile_image', 'https://placehold.co/400')
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_demo_profile(user_id uuid, user_name text, user_age integer, user_location text, user_gender text, user_occupation text, user_profile_image text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  profile_id UUID;
BEGIN
  INSERT INTO public.profiles (
    id, 
    name, 
    age, 
    location, 
    gender, 
    occupation, 
    profile_image,
    verified,
    last_active
  ) VALUES (
    user_id,
    user_name,
    user_age,
    user_location,
    user_gender,
    user_occupation,
    user_profile_image,
    CASE WHEN RANDOM() > 0.3 THEN TRUE ELSE FALSE END,
    NOW() - (RANDOM() * INTERVAL '30 days')
  )
  RETURNING id INTO profile_id;
  
  RETURN profile_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_dummy_auth_user(email text, user_uuid uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  result JSONB;
BEGIN
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  VALUES (
    user_uuid,
    email,
    '**dummy_password_hash**',
    NOW(),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}'
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING '{"success": true, "id": "' || id || '"}' INTO result;
  
  IF result IS NULL THEN
    result := '{"success": false, "message": "User with this ID already exists"}';
  END IF;
  
  RETURN result;
END;
$function$;