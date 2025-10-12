-- Create profile_views table to track when users view profiles
CREATE TABLE IF NOT EXISTS public.profile_views (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  viewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_profile_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewed_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_profile ON public.profile_views(viewed_profile_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer ON public.profile_views(viewer_id, viewed_at DESC);

-- Enable Row Level Security
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Users can view who has viewed their profile
CREATE POLICY "Users can view their own profile views"
ON public.profile_views
FOR SELECT
USING (auth.uid() = viewed_profile_id);

-- Users can track their own viewing activity
CREATE POLICY "Users can view their viewing history"
ON public.profile_views
FOR SELECT
USING (auth.uid() = viewer_id);

-- Users can insert profile views when they view others
CREATE POLICY "Users can insert profile views"
ON public.profile_views
FOR INSERT
WITH CHECK (auth.uid() = viewer_id);

-- Users can delete their own viewing records
CREATE POLICY "Users can delete their viewing history"
ON public.profile_views
FOR DELETE
USING (auth.uid() = viewer_id);

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_views;