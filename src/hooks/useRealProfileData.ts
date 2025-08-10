
import { useState, useEffect } from 'react';
import { getCurrentUserProfile, updateProfile } from '@/api/profiles';
import { getUserOnboardingProgress, getRealUserEngagement } from '@/utils/realUserEnhancement';
import { toast } from 'sonner';

// Define a database-compatible profile interface
interface DatabaseProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string | null;
  bio: string | null;
  verified: boolean | null;
  profile_image: string | null;
  last_active: string | null;
  kurdistan_region: string | null;
  height: string | null;
  body_type: string | null;
  ethnicity: string | null;
  religion: string | null;
  political_views: string | null;
  values: string[] | null;
  interests: string[] | null;
  hobbies: string[] | null;
  languages: string[] | null;
  education: string | null;
  company: string | null;
  relationship_goals: string | null;
  want_children: string | null;
  have_pets: string | null;
  exercise_habits: string | null;
  zodiac_sign: string | null;
  personality_type: string | null;
  sleep_schedule: string | null;
  travel_frequency: string | null;
  communication_style: string | null;
  love_language: string | null;
  created_at: string | null;
}

export const useRealProfileData = () => {
  const [profileData, setProfileData] = useState<DatabaseProfile | null>(null);
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

  const updateProfileData = async (updates: Partial<DatabaseProfile>) => {
    try {
      if (profileData) {
        const updated = await updateProfile(updates as any);
        setProfileData(updated as any);
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
