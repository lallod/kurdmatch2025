-- Fix PRIVILEGE_ESCALATION: account_status
-- Drop the overly permissive ALL policy
DROP POLICY IF EXISTS "Users can manage own account status" ON public.account_status;

-- Users can READ their own account status
CREATE POLICY "Users can read own account status"
  ON public.account_status FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can INSERT their own initial record (status defaults to 'active')
CREATE POLICY "Users can create own account status"
  ON public.account_status FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'active');

-- Users can request deactivation or deletion only
CREATE POLICY "Users can request deactivation or deletion"
  ON public.account_status FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND status IN ('deactivated', 'deletion_requested')
  );