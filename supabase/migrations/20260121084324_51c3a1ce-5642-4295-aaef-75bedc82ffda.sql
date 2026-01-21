-- Create storage bucket for verification videos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'verification-videos',
  'verification-videos',
  false,
  52428800, -- 50MB max
  ARRAY['video/webm', 'video/mp4', 'video/quicktime', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for verification videos bucket
CREATE POLICY "Users can upload own verification videos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-videos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view own verification videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-videos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can view all verification videos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-videos'
  AND EXISTS (
    SELECT 1 FROM public.admin_activities 
    WHERE user_id = auth.uid() 
    LIMIT 1
  )
);

-- Fix the permissive INSERT policy on message_safety_flags
DROP POLICY IF EXISTS "System can create flags" ON public.message_safety_flags;

CREATE POLICY "Service role can create flags"
ON public.message_safety_flags FOR INSERT
TO service_role
WITH CHECK (TRUE);

-- Allow authenticated users to create flags for messages they received
CREATE POLICY "Recipients can flag messages they received"
ON public.message_safety_flags FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = recipient_id);
