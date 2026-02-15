
-- Add is_generated flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_generated boolean DEFAULT false;

-- Create scheduled_content table
CREATE TABLE public.scheduled_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('post', 'story')),
  content TEXT,
  media_url TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scheduled_content ENABLE ROW LEVEL SECURITY;

-- Only admins (via service role) manage scheduled content
CREATE POLICY "Service role full access to scheduled_content"
ON public.scheduled_content
FOR ALL
USING (true)
WITH CHECK (true);

-- Create index for efficient publishing queries
CREATE INDEX idx_scheduled_content_publish ON public.scheduled_content (scheduled_for, published) WHERE published = false;

-- Create publish function
CREATE OR REPLACE FUNCTION public.publish_scheduled_content()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  published_count integer := 0;
  rec RECORD;
BEGIN
  FOR rec IN
    SELECT * FROM scheduled_content
    WHERE scheduled_for <= NOW() AND published = false
  LOOP
    IF rec.content_type = 'post' THEN
      INSERT INTO posts (user_id, content, media_url, media_type, created_at)
      VALUES (rec.profile_id, COALESCE(rec.content, ''), rec.media_url, 
              CASE WHEN rec.media_url IS NOT NULL THEN 'image' ELSE NULL END,
              rec.scheduled_for);
    ELSIF rec.content_type = 'story' THEN
      INSERT INTO stories (user_id, media_url, media_type, text_overlay, expires_at, category, created_at)
      VALUES (rec.profile_id, COALESCE(rec.media_url, ''), 'image', rec.content, 
              rec.scheduled_for + interval '24 hours', 'daily_life', rec.scheduled_for);
    END IF;

    UPDATE scheduled_content SET published = true WHERE id = rec.id;
    
    -- Update last_active on the ghost profile
    UPDATE profiles SET last_active = rec.scheduled_for WHERE id = rec.profile_id;
    
    published_count := published_count + 1;
  END LOOP;

  RETURN published_count;
END;
$$;
