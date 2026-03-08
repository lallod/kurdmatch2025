
-- Create connected_social_accounts table to replace localStorage
CREATE TABLE IF NOT EXISTS public.connected_social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  platform_user_id TEXT,
  username TEXT NOT NULL,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, platform, username)
);

ALTER TABLE public.connected_social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own social accounts"
  ON public.connected_social_accounts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create account_status table to replace localStorage
CREATE TABLE IF NOT EXISTS public.account_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active',
  reason TEXT,
  requested_at TIMESTAMPTZ,
  scheduled_deletion_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.account_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own account status"
  ON public.account_status
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
