
-- Marriage Intentions table
CREATE TABLE public.marriage_intentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intention TEXT NOT NULL CHECK (intention IN ('looking_to_marry', 'open_to_marriage', 'not_sure', 'prefer_not_to_say')),
  timeline TEXT CHECK (timeline IN ('asap', 'within_1_year', 'within_2_years', 'no_rush', 'not_specified')),
  family_plans TEXT CHECK (family_plans IN ('want_children', 'dont_want_children', 'open_to_discussion', 'already_have_children', 'prefer_not_to_say')),
  visible_on_profile BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.marriage_intentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all visible intentions"
  ON public.marriage_intentions FOR SELECT
  USING (visible_on_profile = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage own intentions"
  ON public.marriage_intentions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own intentions"
  ON public.marriage_intentions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own intentions"
  ON public.marriage_intentions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Chaperone Mode table
CREATE TABLE public.chaperone_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT false,
  chaperone_email TEXT,
  chaperone_name TEXT,
  chaperone_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notify_on_match BOOLEAN NOT NULL DEFAULT true,
  notify_on_message BOOLEAN NOT NULL DEFAULT true,
  can_view_messages BOOLEAN NOT NULL DEFAULT false,
  can_view_photos BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.chaperone_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chaperone settings"
  ON public.chaperone_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = chaperone_user_id);

CREATE POLICY "Users can manage own chaperone settings"
  ON public.chaperone_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chaperone settings"
  ON public.chaperone_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chaperone settings"
  ON public.chaperone_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_marriage_intentions_updated_at
  BEFORE UPDATE ON public.marriage_intentions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chaperone_settings_updated_at
  BEFORE UPDATE ON public.chaperone_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
