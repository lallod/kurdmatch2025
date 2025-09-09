-- Fix function search path security issues
-- Update handle_new_user function to have secure search path
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

-- Update create_demo_profile function to have secure search path
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

-- Update create_dummy_auth_user function to have secure search path
CREATE OR REPLACE FUNCTION public.create_dummy_auth_user(email text, user_uuid uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public, auth
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

-- Add missing trigger for handle_new_user function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();