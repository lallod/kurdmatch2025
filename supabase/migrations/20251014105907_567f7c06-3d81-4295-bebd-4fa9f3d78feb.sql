-- PHASE 1, STEP 1.4: Fix Infinite Recursion in group_members (Revised)
-- Create security definer functions without status check

-- Function to check if user is a group member
CREATE OR REPLACE FUNCTION public.is_group_member(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = group_uuid
      AND user_id = user_uuid
  )
$$;

-- Function to check if user is group admin
CREATE OR REPLACE FUNCTION public.is_group_admin(group_uuid uuid, user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.group_members
    WHERE group_id = group_uuid
      AND user_id = user_uuid
      AND role = 'admin'
  )
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Group admins can manage members" ON public.group_members;
DROP POLICY IF EXISTS "Users can view group memberships" ON public.group_members;
DROP POLICY IF EXISTS "Users can join groups" ON public.group_members;
DROP POLICY IF EXISTS "Users can leave groups" ON public.group_members;

-- Create new policies using security definer functions

CREATE POLICY "Users can view their own memberships"
ON public.group_members
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Members can view group member lists"
ON public.group_members
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM groups g
    WHERE g.id = group_members.group_id
    AND (g.privacy = 'public' OR is_group_member(g.id, auth.uid()))
  )
);

CREATE POLICY "Users can join groups"
ON public.group_members
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
ON public.group_members
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Group admins can manage members"
ON public.group_members
FOR ALL
TO authenticated
USING (is_group_admin(group_id, auth.uid()))
WITH CHECK (is_group_admin(group_id, auth.uid()));