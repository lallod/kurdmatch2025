
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/swipe';
import { toast } from 'sonner';

interface DatabaseProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string | null;
  bio: string | null;
  verified: boolean | null;
  profile_image: string | null;
  kurdistan_region: string | null;
  height: string | null;
  body_type: string | null;
  religion: string | null;
  interests: string[] | null;
  languages: string[] | null;
  relationship_goals: string | null;
  photos: { url: string; is_primary: boolean }[] | null;
}

export const useProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [fullProfileData, setFullProfileData] = useState<Profile | null>(null);

  const fetchFullProfile = async (profileId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          photos(url, is_primary)
        `)
        .eq('id', profileId.toString())
        .single();

      if (error) throw error;

      if (data) {
        // Transform database profile to match our Profile interface
        const transformedProfile: Profile = {
          id: parseInt(data.id),
          name: data.name || 'Unknown',
          age: data.age || 0,
          location: data.location || 'Unknown',
          avatar: data.profile_image || '',
          distance: Math.floor(Math.random() * 50) + 1, // Mock distance for now
          compatibilityScore: Math.floor(Math.random() * 30) + 70, // Mock score
          kurdistanRegion: data.kurdistan_region || undefined,
          area: data.kurdistan_region || 'Unknown',
          interests: data.interests || [],
          occupation: data.occupation || undefined,
          religion: data.religion || undefined,
          bodyType: data.body_type || undefined,
          languages: data.languages || [],
          height: data.height || undefined,
          photos: data.photos?.map(p => p.url) || [data.profile_image || ''],
          bio: data.bio || undefined,
          relationshipGoals: data.relationship_goals || undefined,
          verified: data.verified || false
        };

        setFullProfileData(transformedProfile);
        return transformedProfile;
      }
    } catch (error) {
      console.error('Error fetching full profile:', error);
      toast.error('Failed to load profile details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchFullProfile,
    fullProfileData,
    loading
  };
};
