-- PHASE 1, STEP 1.2: Protect Reporter Identities in Reports Table
-- Remove user access to view their own reports to prevent retaliation

-- Check current policies
SELECT policyname, cmd, roles, qual 
FROM pg_policies 
WHERE tablename = 'reports';

-- Drop policy that exposes reporter identity
DROP POLICY IF EXISTS "Users can view their own reports" ON public.reports;

-- Ensure RLS is enabled
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Add security comment
COMMENT ON POLICY "Users can create reports" ON public.reports IS 
'Allows anonymous reporting. Users cannot view reports after submission, protecting reporter identity from retaliation.';