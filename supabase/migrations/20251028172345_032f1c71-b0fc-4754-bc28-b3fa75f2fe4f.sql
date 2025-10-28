-- Create user_settings table for storing all user preferences
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Notification preferences
  notifications_matches BOOLEAN DEFAULT true,
  notifications_messages BOOLEAN DEFAULT true,
  notifications_likes BOOLEAN DEFAULT false,
  notifications_profile_views BOOLEAN DEFAULT true,
  notifications_marketing BOOLEAN DEFAULT false,
  notifications_push BOOLEAN DEFAULT true,
  notifications_email BOOLEAN DEFAULT true,
  notifications_sms BOOLEAN DEFAULT false,
  notifications_comments BOOLEAN DEFAULT true,
  notifications_follows BOOLEAN DEFAULT true,
  notifications_mentions BOOLEAN DEFAULT true,
  notifications_groups BOOLEAN DEFAULT true,
  notifications_events BOOLEAN DEFAULT true,
  
  -- Privacy settings
  privacy_show_age BOOLEAN DEFAULT true,
  privacy_show_distance BOOLEAN DEFAULT true,
  privacy_show_online BOOLEAN DEFAULT true,
  privacy_discoverable BOOLEAN DEFAULT true,
  privacy_read_receipts BOOLEAN DEFAULT false,
  privacy_show_online_status BOOLEAN DEFAULT true,
  privacy_show_last_active BOOLEAN DEFAULT true,
  privacy_show_profile_views BOOLEAN DEFAULT true,
  privacy_profile_visibility TEXT DEFAULT 'everyone',
  privacy_message_privacy TEXT DEFAULT 'everyone',
  privacy_location_sharing TEXT DEFAULT 'approximate',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies for user_settings
CREATE POLICY "Users can view their own settings"
  ON public.user_settings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view all settings"
  ON public.user_settings
  FOR SELECT
  USING (is_super_admin(auth.uid()));

-- Create function to automatically create settings on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger to create settings when user is created
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_user_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_user_settings_timestamp
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_settings_updated_at();

-- Add realtime support
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_settings;