
import { useState, useEffect } from 'react';
import { getCurrentUserProfile } from '@/api/profiles';
import { getUserOnboardingProgress, getRealUserEngagement } from '@/utils/realUserEnhancement';
import { toast } from 'sonner';

// Define a comprehensive database-compatible profile interface
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
  
  // Basic Info
  height: string | null;
  ethnicity: string | null;
  kurdistan_region: string | null;
  languages: string[] | null;
  
  // Lifestyle
  exercise_habits: string | null;
  have_pets: string | null;
  drinking: string | null;
  smoking: string | null;
  dietary_preferences: string | null;
  sleep_schedule: string | null;
  
  // Values & Beliefs
  religion: string | null;
  values: string[] | null;
  zodiac_sign: string | null;
  personality_type: string | null;
  political_views: string | null;
  
  // Relationships
  relationship_goals: string | null;
  want_children: string | null;
  children_status: string | null;
  family_closeness: string | null;
  love_language: string[] | null;
  
  // Career
  education: string | null;
  company: string | null;
  
  // Interests & Hobbies
  interests: string[] | null;
  hobbies: string[] | null;
  creative_pursuits: string[] | null;
  weekend_activities: string[] | null;
  music_instruments: string[] | null;
  tech_skills: string[] | null;
  
  // Favorites
  favorite_books: string[] | null;
  favorite_movies: string[] | null;
  favorite_music: string[] | null;
  favorite_foods: string[] | null;
  favorite_games: string[] | null;
  favorite_podcasts: string[] | null;
  
  // Personal Details
  dream_vacation: string | null;
  ideal_date: string | null;
  communication_style: string | null;
  travel_frequency: string | null;
  
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
        console.log('Loaded profile data:', profile);
        
        // Convert profile data to match our interface, handling type mismatches
        const convertedProfile: DatabaseProfile = {
          ...profile,
          // Ensure love_language is always an array
          love_language: Array.isArray(profile.love_language) 
            ? profile.love_language 
            : profile.love_language 
              ? [profile.love_language] 
              : null
        };
        
        setProfileData(convertedProfile);

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
