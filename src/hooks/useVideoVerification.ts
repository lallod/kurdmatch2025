import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/integrations/supabase/auth';
import { toast } from 'sonner';

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
      toast.error('You must be logged in');
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
          toast.error('Video storage not configured. Please contact support.');
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
      toast.success('Verification submitted! We\'ll review it within 24 hours.');
      return data;

    } catch (error: any) {
      console.error('Error submitting verification:', error);
      toast.error(error.message || 'Failed to submit verification');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const getVerificationStatus = useCallback(() => {
    if (!verification) return { status: 'none', message: 'Not verified' };
    
    switch (verification.status) {
      case 'pending':
        return { 
          status: 'pending', 
          message: 'Verification in review',
          color: 'yellow'
        };
      case 'approved':
        return { 
          status: 'approved', 
          message: 'Video verified ✓',
          color: 'green'
        };
      case 'rejected':
        return { 
          status: 'rejected', 
          message: verification.rejection_reason || 'Verification rejected',
          color: 'red'
        };
      case 'expired':
        return { 
          status: 'expired', 
          message: 'Verification expired - please reverify',
          color: 'orange'
        };
      default:
        return { status: 'none', message: 'Not verified' };
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
