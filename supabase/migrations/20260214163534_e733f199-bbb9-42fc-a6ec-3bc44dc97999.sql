
-- Per-field visibility settings for each user
CREATE TABLE public.profile_visibility_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, field_name)
);

ALTER TABLE public.profile_visibility_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own visibility settings"
  ON public.profile_visibility_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own visibility settings"
  ON public.profile_visibility_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own visibility settings"
  ON public.profile_visibility_settings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own visibility settings"
  ON public.profile_visibility_settings FOR DELETE
  USING (auth.uid() = user_id);

-- Other users can read visibility settings to know what to hide
CREATE POLICY "Authenticated users can read others visibility settings"
  ON public.profile_visibility_settings FOR SELECT
  TO authenticated
  USING (true);

-- User-specific sharing (share hidden fields / unblurred photos with specific users)
CREATE TABLE public.profile_sharing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_with_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_type TEXT NOT NULL DEFAULT 'all', -- 'all', 'photos', 'fields'
  shared_fields TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(owner_id, shared_with_user_id)
);

ALTER TABLE public.profile_sharing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sharing"
  ON public.profile_sharing FOR ALL
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can see if shared with them"
  ON public.profile_sharing FOR SELECT
  TO authenticated
  USING (auth.uid() = shared_with_user_id);

-- Add blur_photos column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS blur_photos BOOLEAN DEFAULT false;
