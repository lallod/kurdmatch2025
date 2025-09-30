-- Create storage bucket for story media
INSERT INTO storage.buckets (id, name, public)
VALUES ('story-media', 'story-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for story media
CREATE POLICY "Anyone can view story media"
ON storage.objects FOR SELECT
USING (bucket_id = 'story-media');

CREATE POLICY "Users can upload their own story media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'story-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own story media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'story-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own story media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'story-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);