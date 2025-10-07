import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminPhoto {
  id: string;
  profile_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
  profile?: {
    name: string;
    profile_image: string;
  };
}

export const useAdminPhotos = () => {
  const [photos, setPhotos] = useState<AdminPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchPhotos = async (page: number = 1, limit: number = 12, searchTerm: string = '') => {
    try {
      setLoading(true);

      // Get total count
      const { count } = await supabase
        .from('photos')
        .select('*', { count: 'exact', head: true });

      setTotalCount(count || 0);

      // Fetch photos with profile info
      let query = supabase
        .from('photos')
        .select(`
          id,
          profile_id,
          url,
          is_primary,
          created_at,
          profile:profiles(name, profile_image)
        `)
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      const { data, error } = await query;

      if (error) throw error;

      // Transform data
      const transformedPhotos = (data || []).map((photo: any) => ({
        id: photo.id,
        profile_id: photo.profile_id,
        url: photo.url,
        is_primary: photo.is_primary,
        created_at: photo.created_at,
        profile: Array.isArray(photo.profile) ? photo.profile[0] : photo.profile,
      }));

      setPhotos(transformedPhotos);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      setTotalCount(prev => prev - 1);
      return true;
    } catch (error) {
      console.error('Error deleting photo:', error);
      return false;
    }
  };

  const approvePhoto = async (photoId: string) => {
    // This would typically update a moderation status field
    // For now, we'll just mark it as approved in a comment
    console.log('Photo approved:', photoId);
    return true;
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  return {
    photos,
    loading,
    totalCount,
    fetchPhotos,
    deletePhoto,
    approvePhoto,
  };
};
