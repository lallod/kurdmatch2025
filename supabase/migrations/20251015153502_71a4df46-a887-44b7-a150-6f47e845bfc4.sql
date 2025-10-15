-- Add super admin access policies for user-generated content tables

-- Likes table
CREATE POLICY "Super admins can view all likes"
ON public.likes
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete likes"
ON public.likes
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Matches table
CREATE POLICY "Super admins can view all matches"
ON public.matches
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete matches"
ON public.matches
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Comment likes table
CREATE POLICY "Super admins can view all comment likes"
ON public.comment_likes
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete comment likes"
ON public.comment_likes
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Groups table
CREATE POLICY "Super admins can view all groups"
ON public.groups
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert groups"
ON public.groups
FOR INSERT
WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update all groups"
ON public.groups
FOR UPDATE
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete all groups"
ON public.groups
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Group members table
CREATE POLICY "Super admins can view all group members"
ON public.group_members
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete group members"
ON public.group_members
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Group posts table
CREATE POLICY "Super admins can view all group posts"
ON public.group_posts
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete group posts"
ON public.group_posts
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Events table
CREATE POLICY "Super admins can view all events"
ON public.events
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update all events"
ON public.events
FOR UPDATE
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete all events"
ON public.events
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Event attendees table
CREATE POLICY "Super admins can view all event attendees"
ON public.event_attendees
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete event attendees"
ON public.event_attendees
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Followers table
CREATE POLICY "Super admins can view all followers"
ON public.followers
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete follower relationships"
ON public.followers
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Blocked users table
CREATE POLICY "Super admins can view all blocked users"
ON public.blocked_users
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete blocked relationships"
ON public.blocked_users
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Notifications table
CREATE POLICY "Super admins can view all notifications"
ON public.notifications
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete notifications"
ON public.notifications
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Conversation metadata table
CREATE POLICY "Super admins can view all conversation metadata"
ON public.conversation_metadata
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update conversation metadata"
ON public.conversation_metadata
FOR UPDATE
USING (is_super_admin(auth.uid()));

-- Muted conversations table
CREATE POLICY "Super admins can view all muted conversations"
ON public.muted_conversations
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete muted conversations"
ON public.muted_conversations
FOR DELETE
USING (is_super_admin(auth.uid()));

-- Message rate limits table
CREATE POLICY "Super admins can view all message rate limits"
ON public.message_rate_limits
FOR SELECT
USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update message rate limits"
ON public.message_rate_limits
FOR UPDATE
USING (is_super_admin(auth.uid()));

-- Daily usage table
CREATE POLICY "Super admins can view all daily usage"
ON public.daily_usage
FOR SELECT
USING (is_super_admin(auth.uid()));

-- AI conversation insights table
CREATE POLICY "Super admins can view all ai insights"
ON public.ai_conversation_insights
FOR SELECT
USING (is_super_admin(auth.uid()));

-- Hashtags table
CREATE POLICY "Super admins can manage hashtags"
ON public.hashtags
FOR ALL
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- Interests table  
CREATE POLICY "Super admins can manage interests"
ON public.interests
FOR ALL
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));