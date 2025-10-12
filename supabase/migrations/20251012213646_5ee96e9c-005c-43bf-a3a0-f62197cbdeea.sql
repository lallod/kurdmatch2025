-- Phase 1: Add Hashtags and Groups Schema

-- 1. Add hashtags column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS hashtags TEXT[] DEFAULT '{}';

-- 2. Create hashtags tracking table
CREATE TABLE IF NOT EXISTS hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient hashtag searching
CREATE INDEX IF NOT EXISTS idx_hashtags_name ON hashtags(name);
CREATE INDEX IF NOT EXISTS idx_hashtags_usage_count ON hashtags(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_posts_hashtags ON posts USING GIN(hashtags);

-- Enable RLS on hashtags
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read hashtags
CREATE POLICY "Anyone can view hashtags"
ON hashtags FOR SELECT
USING (true);

-- System can manage hashtags
CREATE POLICY "System can manage hashtags"
ON hashtags FOR ALL
USING (true)
WITH CHECK (true);

-- 3. Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  icon TEXT,
  category TEXT NOT NULL,
  privacy TEXT NOT NULL DEFAULT 'public' CHECK (privacy IN ('public', 'private')),
  member_count INTEGER NOT NULL DEFAULT 0,
  post_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for groups
CREATE INDEX IF NOT EXISTS idx_groups_category ON groups(category);
CREATE INDEX IF NOT EXISTS idx_groups_privacy ON groups(privacy);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups(created_by);

-- Enable RLS on groups
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Public groups visible to all
CREATE POLICY "Anyone can view public groups"
ON groups FOR SELECT
USING (privacy = 'public');

-- Users can create groups
CREATE POLICY "Authenticated users can create groups"
ON groups FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Group creators can update their groups
CREATE POLICY "Group creators can update their groups"
ON groups FOR UPDATE
USING (auth.uid() = created_by);

-- Group creators can delete their groups
CREATE POLICY "Group creators can delete their groups"
ON groups FOR DELETE
USING (auth.uid() = created_by);

-- 4. Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create indexes for group_members
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

-- Enable RLS on group_members
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Members can view group membership
CREATE POLICY "Users can view group memberships"
ON group_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM groups g
    WHERE g.id = group_members.group_id
    AND (g.privacy = 'public' OR g.id IN (
      SELECT group_id FROM group_members WHERE user_id = auth.uid()
    ))
  )
);

-- Users can join groups
CREATE POLICY "Users can join groups"
ON group_members FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can leave groups
CREATE POLICY "Users can leave groups"
ON group_members FOR DELETE
USING (auth.uid() = user_id);

-- Admins can manage members
CREATE POLICY "Group admins can manage members"
ON group_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = group_members.group_id
    AND gm.user_id = auth.uid()
    AND gm.role = 'admin'
  )
);

-- 5. Create group_posts junction table
CREATE TABLE IF NOT EXISTS group_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, group_id)
);

-- Create indexes for group_posts
CREATE INDEX IF NOT EXISTS idx_group_posts_post_id ON group_posts(post_id);
CREATE INDEX IF NOT EXISTS idx_group_posts_group_id ON group_posts(group_id);

-- Enable RLS on group_posts
ALTER TABLE group_posts ENABLE ROW LEVEL SECURITY;

-- View group posts based on group privacy
CREATE POLICY "Users can view group posts"
ON group_posts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM groups g
    WHERE g.id = group_posts.group_id
    AND (
      g.privacy = 'public' 
      OR EXISTS (
        SELECT 1 FROM group_members gm
        WHERE gm.group_id = g.id AND gm.user_id = auth.uid()
      )
    )
  )
);

-- Group members can add posts to groups
CREATE POLICY "Group members can add posts to groups"
ON group_posts FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM group_members gm
    WHERE gm.group_id = group_posts.group_id
    AND gm.user_id = auth.uid()
  )
  AND EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = group_posts.post_id
    AND p.user_id = auth.uid()
  )
);

-- Post authors can remove their posts from groups
CREATE POLICY "Post authors can remove posts from groups"
ON group_posts FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM posts p
    WHERE p.id = group_posts.post_id
    AND p.user_id = auth.uid()
  )
);

-- 6. Add trigger to update group member count
CREATE OR REPLACE FUNCTION update_group_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups SET member_count = member_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups SET member_count = member_count - 1 WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_group_member_count
AFTER INSERT OR DELETE ON group_members
FOR EACH ROW EXECUTE FUNCTION update_group_member_count();

-- 7. Add trigger to update group post count
CREATE OR REPLACE FUNCTION update_group_post_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups SET post_count = post_count + 1 WHERE id = NEW.group_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups SET post_count = post_count - 1 WHERE id = OLD.group_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_group_post_count
AFTER INSERT OR DELETE ON group_posts
FOR EACH ROW EXECUTE FUNCTION update_group_post_count();

-- 8. Add trigger to auto-add group creator as admin
CREATE OR REPLACE FUNCTION add_group_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_add_group_creator_as_admin
AFTER INSERT ON groups
FOR EACH ROW EXECUTE FUNCTION add_group_creator_as_admin();

-- 9. Create some default Kurdish-themed groups
INSERT INTO groups (name, description, cover_image, icon, category, privacy, created_by)
SELECT 
  'Kurdish Professionals',
  'Connect with Kurdish professionals from around the world. Share career advice, networking opportunities, and professional development.',
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
  '💼',
  'professional',
  'public',
  id
FROM profiles LIMIT 1
ON CONFLICT (name) DO NOTHING;

INSERT INTO groups (name, description, cover_image, icon, category, privacy, created_by)
SELECT 
  'Kurdish Cuisine & Recipes',
  'Share traditional Kurdish recipes, cooking tips, and food culture. From dolma to kubba, celebrate our culinary heritage!',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  '🍽️',
  'lifestyle',
  'public',
  id
FROM profiles LIMIT 1
ON CONFLICT (name) DO NOTHING;

INSERT INTO groups (name, description, cover_image, icon, category, privacy, created_by)
SELECT 
  'Kurdish Music & Arts',
  'Discuss Kurdish music, poetry, art, and cultural expressions. Share your favorite artists and discover new talents.',
  'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800',
  '🎵',
  'culture',
  'public',
  id
FROM profiles LIMIT 1
ON CONFLICT (name) DO NOTHING;

INSERT INTO groups (name, description, cover_image, icon, category, privacy, created_by)
SELECT 
  'Single Parents Support',
  'A supportive community for Kurdish single parents. Share experiences, advice, and encouragement.',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800',
  '👨‍👧‍👦',
  'lifestyle',
  'public',
  id
FROM profiles LIMIT 1
ON CONFLICT (name) DO NOTHING;

INSERT INTO groups (name, description, cover_image, icon, category, privacy, created_by)
SELECT 
  'Travel & Adventure',
  'Share your travel experiences in Kurdistan and beyond. Tips, photos, and recommendations for fellow travelers.',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
  '✈️',
  'travel',
  'public',
  id
FROM profiles LIMIT 1
ON CONFLICT (name) DO NOTHING;