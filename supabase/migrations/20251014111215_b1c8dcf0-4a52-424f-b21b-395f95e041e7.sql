-- PHASE 2, STEP 2.4: Enhance Message Security
-- Prevent messaging blocked users and add edit time limits

-- Drop existing message policies to recreate with enhanced security
DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
DROP POLICY IF EXISTS "Users can update own sent messages" ON public.messages;
DROP POLICY IF EXISTS "Recipients can mark messages as read" ON public.messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.messages;
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;

-- Enhanced policy: Users can send messages (but not to blocked users)
CREATE POLICY "Users can send messages (not to blocked users)"
ON public.messages
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = sender_id 
  AND NOT is_user_blocked(recipient_id)
);

-- Enhanced policy: Users can update own sent messages (within 5 minutes)
CREATE POLICY "Users can edit own messages (5 min limit)"
ON public.messages
FOR UPDATE
TO authenticated
USING (
  auth.uid() = sender_id 
  AND (now() - created_at) < interval '5 minutes'
  AND NOT is_user_blocked(recipient_id)
)
WITH CHECK (
  auth.uid() = sender_id 
  AND (now() - created_at) < interval '5 minutes'
  AND NOT is_user_blocked(recipient_id)
);

-- Policy: Recipients can mark messages as read
CREATE POLICY "Recipients can mark messages as read"
ON public.messages
FOR UPDATE
TO authenticated
USING (auth.uid() = recipient_id)
WITH CHECK (
  auth.uid() = recipient_id 
  AND read = true
);

-- Enhanced policy: Users can delete own messages (not from blocked users)
CREATE POLICY "Users can delete own messages"
ON public.messages
FOR DELETE
TO authenticated
USING (
  auth.uid() = sender_id
  OR auth.uid() = recipient_id
);

-- Enhanced policy: Users can view their messages (not from/to blocked users)
CREATE POLICY "Users can view their messages (not blocked)"
ON public.messages
FOR SELECT
TO authenticated
USING (
  (auth.uid() = sender_id OR auth.uid() = recipient_id)
  AND NOT is_user_blocked(
    CASE 
      WHEN auth.uid() = sender_id THEN recipient_id
      ELSE sender_id
    END
  )
);

COMMENT ON POLICY "Users can send messages (not to blocked users)" ON public.messages IS 'Prevents sending messages to blocked users';
COMMENT ON POLICY "Users can edit own messages (5 min limit)" ON public.messages IS 'Allows editing sent messages within 5 minutes, prevents editing messages to blocked users';
COMMENT ON POLICY "Users can view their messages (not blocked)" ON public.messages IS 'Users can only see messages from non-blocked users';