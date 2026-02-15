
-- Drop dependent policy first
DROP POLICY IF EXISTS "Members can view group member lists" ON public.group_members;

-- Now drop and recreate function
DROP FUNCTION IF EXISTS public.is_group_member(uuid, uuid);

CREATE FUNCTION public.is_group_member(p_group_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.group_members
    WHERE group_id = p_group_id AND user_id = p_user_id
  );
$$;

-- Recreate policy using the function
CREATE POLICY "Users can view group members"
ON public.group_members FOR SELECT
TO authenticated
USING (
  public.is_group_member(group_id, auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.groups
    WHERE groups.id = group_id AND groups.privacy = 'public'
  )
);
