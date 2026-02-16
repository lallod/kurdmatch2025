-- Create storage bucket for post media
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-media', 'post-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to post-media bucket
CREATE POLICY "Authenticated users can upload post media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'post-media' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to post media
CREATE POLICY "Public read access to post media"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-media');

-- Allow users to delete their own post media
CREATE POLICY "Users can delete own post media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'post-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);