-- =============================================
-- 1. SECURE user_subscriptions: prevent users from self-upgrading
-- =============================================

-- Drop existing permissive INSERT/UPDATE policies on user_subscriptions
DROP POLICY IF EXISTS "Users can insert own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can manage their own subscription" ON public.user_subscriptions;

-- Keep SELECT so users can read their own subscription
CREATE POLICY "Users can read own subscription"
  ON public.user_subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all subscriptions"
  ON public.user_subscriptions
  FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- Create a SECURITY DEFINER function to initialize free subscriptions safely
CREATE OR REPLACE FUNCTION public.initialize_user_subscription(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_subscriptions (user_id, subscription_type, expires_at)
  VALUES (p_user_id, 'free', now() + interval '100 years')
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- =============================================
-- 2. SECURE user_coins: prevent users from setting arbitrary balances
-- =============================================

DROP POLICY IF EXISTS "Users can insert own coins" ON public.user_coins;
DROP POLICY IF EXISTS "Users can update own coins" ON public.user_coins;
DROP POLICY IF EXISTS "Users can manage own coins" ON public.user_coins;
DROP POLICY IF EXISTS "Users can manage their coins" ON public.user_coins;

CREATE POLICY "Users can read own coins"
  ON public.user_coins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all coins"
  ON public.user_coins
  FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

-- Create SECURITY DEFINER function to initialize coins
CREATE OR REPLACE FUNCTION public.initialize_user_coins(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_coins (user_id, balance, total_earned, total_spent)
  VALUES (p_user_id, 100, 100, 0)
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- Create SECURITY DEFINER function to spend coins (validated)
CREATE OR REPLACE FUNCTION public.spend_user_coins(p_user_id uuid, p_amount integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance integer;
BEGIN
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  SELECT balance INTO current_balance FROM user_coins WHERE user_id = p_user_id FOR UPDATE;

  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE user_coins
  SET balance = balance - p_amount,
      total_spent = total_spent + p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;

  RETURN true;
END;
$$;

-- =============================================
-- 3. RESTRICT sensitive data: create safe location function
-- =============================================

CREATE OR REPLACE FUNCTION public.get_safe_profile_location(target_user_id uuid)
RETURNS TABLE(latitude double precision, longitude double precision, phone_number text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() = target_user_id OR is_super_admin(auth.uid()) THEN
    RETURN QUERY
    SELECT p.latitude, p.longitude, p.phone_number
    FROM profiles p
    WHERE p.id = target_user_id;
  ELSE
    RETURN QUERY SELECT NULL::double precision, NULL::double precision, NULL::text;
  END IF;
END;
$$;

-- =============================================
-- 4. FIX story_views: restrict to authenticated only
-- =============================================

DROP POLICY IF EXISTS "Anyone can view story views" ON public.story_views;

CREATE POLICY "Authenticated users can view relevant story views"
  ON public.story_views
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = viewer_id
    OR EXISTS (
      SELECT 1 FROM stories s WHERE s.id = story_id AND s.user_id = auth.uid()
    )
  );

-- =============================================
-- 5. FIX scheduled_content: restrict to super admins
-- =============================================

DROP POLICY IF EXISTS "Service role full access to scheduled_content" ON public.scheduled_content;

CREATE POLICY "Only super admins can manage scheduled content"
  ON public.scheduled_content
  FOR ALL
  TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));