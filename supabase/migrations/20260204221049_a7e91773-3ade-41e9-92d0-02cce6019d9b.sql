-- Add notification_preferences column to profiles table for push notification settings
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"push_new_messages": true, "push_new_matches": true, "push_new_likes": true, "push_profile_views": false, "push_compatibility_updates": true}'::jsonb;