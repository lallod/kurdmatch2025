import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

interface VideoVerification {
  id: string;
  user_id: string;
  video_url: string;
  thumbnail_url: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  confidence_score: number | null;
  rejection_reason: string | null;
  verified_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export const useVideoVerification = () => {
  const { t } = useTranslations();
  const { user } = useSupabaseAuth();
  const [verification, setVerification] = useState<VideoVerification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fetchVerification = useCallback(async () => {
    if (!user) return null;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('video_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setVerification(data as VideoVerification | null);
      return data;
    } catch (error) {
      console.error('Error fetching verification:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const submitVerification = useCallback(async (videoFile: File, thumbnailFile?: File) => {
    if (!user) {
      toast.error(t('toast.video.must_login', 'You must be logged in'));
      return null;
    }

    try {
      setIsUploading(true);

      // Upload video to storage
      const videoExt = videoFile.name.split('.').pop();
      const videoPath = `${user.id}/verification-${Date.now()}.${videoExt}`;
      
      const { data: videoUpload, error: videoError } = await supabase.storage
        .from('verification-videos')
        .upload(videoPath, videoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (videoError) {
        // If bucket doesn't exist, create it
        if (videoError.message?.includes('not found')) {
          toast.error(t('toast.video.storage_not_configured', 'Video storage not configured'));
          return null;
        }
        throw videoError;
      }

      const { data: { publicUrl: videoUrl } } = supabase.storage
        .from('verification-videos')
        .getPublicUrl(videoPath);

      // Upload thumbnail if provided
      let thumbnailUrl = null;
      if (thumbnailFile) {
        const thumbPath = `${user.id}/thumb-${Date.now()}.jpg`;
        const { error: thumbError } = await supabase.storage
          .from('verification-videos')
          .upload(thumbPath, thumbnailFile);

        if (!thumbError) {
          const { data: { publicUrl } } = supabase.storage
            .from('verification-videos')
            .getPublicUrl(thumbPath);
          thumbnailUrl = publicUrl;
        }
      }

      // Create verification record
      const { data, error } = await supabase
        .from('video_verifications')
        .insert({
          user_id: user.id,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setVerification(data as VideoVerification);
      toast.success(t('toast.video.submitted', 'Verification submitted!'));
      return data;

    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast.error(error.message || t('toast.video.submit_failed', 'Failed to submit verification'));
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const getVerificationStatus = useCallback(() => {
    if (!verification) return { status: 'none', message: t('toast.video.not_verified', 'Not verified') };
    
    switch (verification.status) {
      case 'pending':
        return { 
          status: 'pending', 
          message: t('toast.video.in_review', 'Verification in review'),
          color: 'yellow'
        };
      case 'approved':
        return { 
          status: 'approved', 
          message: t('toast.video.verified', 'Video verified ✓'),
          color: 'green'
        };
      case 'rejected':
        return { 
          status: 'rejected', 
          message: verification.rejection_reason || t('toast.video.rejected', 'Verification rejected'),
          color: 'red'
        };
      case 'expired':
        return { 
          status: 'expired', 
          message: t('toast.video.expired', 'Verification expired - please reverify'),
          color: 'orange'
        };
      default:
        return { status: 'none', message: t('toast.video.not_verified', 'Not verified') };
    }
  }, [verification]);

  return {
    verification,
    isLoading,
    isUploading,
    fetchVerification,
    submitVerification,
    getVerificationStatus
  };
};
