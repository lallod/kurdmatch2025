
import { useState, useEffect } from 'react';
import { getCurrentUserProfile } from '@/api/profiles';
import { getUserOnboardingProgress, getRealUserEngagement } from '@/utils/realUserEnhancement';
import { ProfileData } from '@/types/profile';
import { toast } from 'sonner';

export const useRealProfileData = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [engagement, setEngagement] = useState<any>(null);

  useEffect(() => {
    loadRealProfileData();
  }, []);

  const loadRealProfileData = async () => {
    try {
      setLoading(true);

      // Get real user profile from database
      const profile = await getCurrentUserProfile();
      
      if (profile) {
        setProfileData(profile);

        // Get onboarding progress
        const progress = await getUserOnboardingProgress(profile.id);
        setOnboardingProgress(progress);

        // Get engagement metrics
        const userEngagement = await getRealUserEngagement(profile.id);
        setEngagement(userEngagement);
      }
    } catch (error) {
      console.error('Error loading real profile data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (updates: Partial<ProfileData>) => {
    try {
      // Update in database would happen here via API
      if (profileData) {
        setProfileData({ ...profileData, ...updates });
        toast.success('Profile updated successfully');
        
        // Refresh onboarding progress
        const progress = await getUserOnboardingProgress(profileData.id);
        setOnboardingProgress(progress);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return {
    profileData,
    loading,
    onboardingProgress,
    engagement,
    updateProfileData,
    refreshData: loadRealProfileData
  };
};
