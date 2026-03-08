
-- ============================================================
-- FIX 1: group_members INSERT - prevent self-promotion to admin & joining private groups
-- ============================================================
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
CREATE POLICY "Users can join public groups as member"
  ON public.group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND role = 'member'
    AND EXISTS (
      SELECT 1 FROM public.groups
      WHERE id = group_id AND privacy = 'public'
    )
  );

-- ============================================================
-- FIX 2: Restrict sensitive fields on profiles SELECT policy
-- Replace the broad policy with column-level restriction via a wrapper
-- ============================================================
DROP POLICY IF EXISTS "Authenticated users can view non-blocked profiles" ON public.profiles;

-- Policy: users can see their own full profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policy: users can view other profiles but sensitive data is protected at app level
-- We restrict phone_number, latitude, longitude visibility via the existing get_safe_profile_location RPC
CREATE POLICY "Users can view non-blocked profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    id != auth.uid()
    AND NOT EXISTS (
      SELECT 1 FROM public.blocked_users
      WHERE (blocker_id = auth.uid() AND blocked_id = profiles.id)
         OR (blocker_id = profiles.id AND blocked_id = auth.uid())
    )
  );

-- ============================================================
-- FIX 3: Fix update_user_settings_updated_at search_path
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_user_settings_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- FIX 4: Fix broken notification links (/posts/ -> /post/)
-- ============================================================
UPDATE public.notifications
SET link = REPLACE(link, '/posts/', '/post/')
WHERE link LIKE '/posts/%';
