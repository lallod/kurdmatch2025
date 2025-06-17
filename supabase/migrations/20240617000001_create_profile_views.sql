
-- Create profile_views table for tracking when users view profiles
CREATE TABLE IF NOT EXISTS profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  viewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  viewed_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique constraint to prevent duplicate views per day
  UNIQUE(viewer_id, viewed_id, DATE(created_at))
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_id ON profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_id ON profile_views(viewed_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_created_at ON profile_views(created_at);

-- Enable RLS
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile views" ON profile_views
  FOR SELECT USING (viewer_id = auth.uid() OR viewed_id = auth.uid());

CREATE POLICY "Users can insert profile views" ON profile_views
  FOR INSERT WITH CHECK (viewer_id = auth.uid());

CREATE POLICY "Users can update their own profile views" ON profile_views
  FOR UPDATE USING (viewer_id = auth.uid());

CREATE POLICY "Users can delete their own profile views" ON profile_views
  FOR DELETE USING (viewer_id = auth.uid());
