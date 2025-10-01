-- Phase 1: Foundation & Core Engagement
-- This migration adds essential tables for reactions, nested comments, moderation, and blocking

-- 1. Post Reactions (replacing simple likes with multiple reaction types)
CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction_type varchar NOT NULL CHECK (reaction_type IN ('love', 'haha', 'fire', 'applause', 'thoughtful', 'wow', 'sad')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id) -- One reaction per user per post
);

CREATE INDEX idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX idx_post_reactions_user_id ON post_reactions(user_id);

-- Enable RLS
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view post reactions"
  ON post_reactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add reactions"
  ON post_reactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions"
  ON post_reactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON post_reactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 2. Comment Likes
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id uuid NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comment likes"
  ON comment_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like comments"
  ON comment_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
  ON comment_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 3. Add nested reply support to post_comments
ALTER TABLE post_comments 
  ADD COLUMN IF NOT EXISTS parent_comment_id uuid REFERENCES post_comments(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS depth integer NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_post_comments_parent ON post_comments(parent_comment_id);

-- 4. Blocked Users
CREATE TABLE IF NOT EXISTS blocked_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blocked_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

CREATE INDEX idx_blocked_users_blocker ON blocked_users(blocker_id);
CREATE INDEX idx_blocked_users_blocked ON blocked_users(blocked_id);

ALTER TABLE blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their blocks"
  ON blocked_users FOR SELECT
  TO authenticated
  USING (auth.uid() = blocker_id);

CREATE POLICY "Users can block others"
  ON blocked_users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can unblock others"
  ON blocked_users FOR DELETE
  TO authenticated
  USING (auth.uid() = blocker_id);

-- 5. Muted Conversations
CREATE TABLE IF NOT EXISTS muted_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  muted_user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  muted_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, muted_user_id)
);

CREATE INDEX idx_muted_conversations_user ON muted_conversations(user_id);

ALTER TABLE muted_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their muted conversations"
  ON muted_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mute conversations"
  ON muted_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unmute conversations"
  ON muted_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update mute duration"
  ON muted_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Enhance Reports table (add status, admin notes, content type)
ALTER TABLE reports
  ADD COLUMN IF NOT EXISTS status varchar NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
  ADD COLUMN IF NOT EXISTS content_type varchar CHECK (content_type IN ('post', 'comment', 'story', 'profile', 'message')),
  ADD COLUMN IF NOT EXISTS content_id uuid,
  ADD COLUMN IF NOT EXISTS admin_notes text,
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz,
  ADD COLUMN IF NOT EXISTS resolved_by uuid REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_content ON reports(content_type, content_id);

-- 7. Moderation Actions
CREATE TABLE IF NOT EXISTS moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE SET NULL,
  content_id uuid NOT NULL,
  content_type varchar NOT NULL CHECK (content_type IN ('post', 'comment', 'story', 'profile', 'message')),
  action_type varchar NOT NULL CHECK (action_type IN ('warning', 'content_removed', 'user_suspended', 'user_banned', 'no_action')),
  admin_id uuid NOT NULL REFERENCES profiles(id),
  reason text,
  duration_hours integer, -- for suspensions
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_moderation_actions_content ON moderation_actions(content_type, content_id);
CREATE INDEX idx_moderation_actions_admin ON moderation_actions(admin_id);

ALTER TABLE moderation_actions ENABLE ROW LEVEL SECURITY;

-- Only super_admins can view and create moderation actions
CREATE POLICY "Super admins can view moderation actions"
  ON moderation_actions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can create moderation actions"
  ON moderation_actions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- 8. Add reaction counts to posts table
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS love_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS haha_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fire_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS applause_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS thoughtful_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS wow_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sad_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_reactions integer NOT NULL DEFAULT 0;

-- 9. Function to update reaction counts
CREATE OR REPLACE FUNCTION update_post_reaction_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET 
      love_count = love_count + CASE WHEN NEW.reaction_type = 'love' THEN 1 ELSE 0 END,
      haha_count = haha_count + CASE WHEN NEW.reaction_type = 'haha' THEN 1 ELSE 0 END,
      fire_count = fire_count + CASE WHEN NEW.reaction_type = 'fire' THEN 1 ELSE 0 END,
      applause_count = applause_count + CASE WHEN NEW.reaction_type = 'applause' THEN 1 ELSE 0 END,
      thoughtful_count = thoughtful_count + CASE WHEN NEW.reaction_type = 'thoughtful' THEN 1 ELSE 0 END,
      wow_count = wow_count + CASE WHEN NEW.reaction_type = 'wow' THEN 1 ELSE 0 END,
      sad_count = sad_count + CASE WHEN NEW.reaction_type = 'sad' THEN 1 ELSE 0 END,
      total_reactions = total_reactions + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET 
      love_count = love_count - CASE WHEN OLD.reaction_type = 'love' THEN 1 ELSE 0 END,
      haha_count = haha_count - CASE WHEN OLD.reaction_type = 'haha' THEN 1 ELSE 0 END,
      fire_count = fire_count - CASE WHEN OLD.reaction_type = 'fire' THEN 1 ELSE 0 END,
      applause_count = applause_count - CASE WHEN OLD.reaction_type = 'applause' THEN 1 ELSE 0 END,
      thoughtful_count = thoughtful_count - CASE WHEN OLD.reaction_type = 'thoughtful' THEN 1 ELSE 0 END,
      wow_count = wow_count - CASE WHEN OLD.reaction_type = 'wow' THEN 1 ELSE 0 END,
      sad_count = sad_count - CASE WHEN OLD.reaction_type = 'sad' THEN 1 ELSE 0 END,
      total_reactions = total_reactions - 1
    WHERE id = OLD.post_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE posts
    SET 
      love_count = love_count + CASE WHEN NEW.reaction_type = 'love' THEN 1 ELSE 0 END - CASE WHEN OLD.reaction_type = 'love' THEN 1 ELSE 0 END,
      haha_count = haha_count + CASE WHEN NEW.reaction_type = 'haha' THEN 1 ELSE 0 END - CASE WHEN OLD.reaction_type = 'haha' THEN 1 ELSE 0 END,
      fire_count = fire_count + CASE WHEN NEW.reaction_type = 'fire' THEN 1 ELSE 0 END - CASE WHEN OLD.reaction_type = 'fire' THEN 1 ELSE 0 END,
      applause_count = applause_count + CASE WHEN NEW.reaction_type = 'applause' THEN 1 ELSE 0 END - CASE WHEN OLD.reaction_type = 'applause' THEN 1 ELSE 0 END,
      thoughtful_count = thoughtful_count + CASE WHEN NEW.reaction_type = 'thoughtful' THEN 1 ELSE 0 END - CASE WHEN OLD.reaction_type = 'thoughtful' THEN 1 ELSE 0 END,
      wow_count = wow_count + CASE WHEN NEW.reaction_type = 'wow' THEN 1 ELSE 0 END - CASE WHEN OLD.reaction_type = 'wow' THEN 1 ELSE 0 END,
      sad_count = sad_count + CASE WHEN NEW.reaction_type = 'sad' THEN 1 ELSE 0 END - CASE WHEN OLD.reaction_type = 'sad' THEN 1 ELSE 0 END
    WHERE id = NEW.post_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_post_reactions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON post_reactions
  FOR EACH ROW EXECUTE FUNCTION update_post_reaction_counts();

-- 10. Function to update comment like counts
CREATE OR REPLACE FUNCTION update_comment_like_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE post_comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE post_comments
    SET likes_count = likes_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER update_comment_likes_trigger
  AFTER INSERT OR DELETE ON comment_likes
  FOR EACH ROW EXECUTE FUNCTION update_comment_like_counts();