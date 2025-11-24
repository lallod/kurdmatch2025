-- Add media support columns to messages table if not exists
ALTER TABLE public.messages 
  ADD COLUMN IF NOT EXISTS media_type TEXT CHECK (media_type IN ('image', 'voice', 'gif')),
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_duration INTEGER; -- For voice messages

-- Create storage buckets for chat media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('chat-images', 'chat-images', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('voice-messages', 'voice-messages', false, 5242880, ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav'])
ON CONFLICT (id) DO NOTHING;

-- RLS policies for chat-images bucket
CREATE POLICY "Users can upload chat images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'chat-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view chat images in their conversations"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'chat-images'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM messages m
      WHERE m.media_url LIKE '%' || name
      AND (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can delete their own chat images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'chat-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- RLS policies for voice-messages bucket
CREATE POLICY "Users can upload voice messages"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'voice-messages'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view voice messages in their conversations"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'voice-messages'
  AND (
    auth.uid()::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM messages m
      WHERE m.media_url LIKE '%' || name
      AND (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
    )
  )
);

CREATE POLICY "Users can delete their own voice messages"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'voice-messages'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Index for better performance on media queries
CREATE INDEX IF NOT EXISTS idx_messages_media_type ON public.messages(media_type) WHERE media_type IS NOT NULL;