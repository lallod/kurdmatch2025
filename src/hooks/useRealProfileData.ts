
import { useState, useEffect } from 'react';
import { getCurrentUserProfile, updateProfile } from '@/api/profiles';
import { getUserOnboardingProgress, getRealUserEngagement, CategoryProgress } from '@/utils/realUserEnhancement';
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
  creative_pursuits: string[] | null;
  weekend_activities: string[] | null;
  dietary_preferences: string | null;
  smoking: string | null;
  drinking: string | null;
  ideal_date: string | null;
  work_life_balance: string | null;
  career_ambitions: string | null;
  created_at: string | null;
}

export const useRealProfileData = () => {
  const [profileData, setProfileData] = useState<DatabaseProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [onboardingProgress, setOnboardingProgress] = useState<any>(null);
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgress | null>(null);
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
        // Convert Profile to DatabaseProfile
        const dbProfile: DatabaseProfile = {
          id: profile.id,
          name: profile.name,
          age: profile.age,
          location: profile.location,
          occupation: profile.occupation || null,
          bio: profile.bio || null,
          verified: profile.verified || null,
          profile_image: profile.profile_image || null,
          last_active: profile.last_active || null,
          kurdistan_region: profile.kurdistan_region || null,
          height: profile.height || null,
          body_type: profile.body_type || null,
          ethnicity: profile.ethnicity || null,
          religion: profile.religion || null,
          political_views: profile.political_views || null,
          values: profile.values || null,
          interests: profile.interests || null,
          hobbies: profile.hobbies || null,
          languages: profile.languages || null,
          education: profile.education || null,
          company: profile.company || null,
          relationship_goals: profile.relationship_goals || null,
          want_children: profile.want_children || null,
          have_pets: profile.have_pets || null,
          exercise_habits: profile.exercise_habits || null,
          zodiac_sign: profile.zodiac_sign || null,
          personality_type: profile.personality_type || null,
          sleep_schedule: profile.sleep_schedule || null,
          travel_frequency: profile.travel_frequency || null,
          communication_style: profile.communication_style || null,
          love_language: profile.love_language || null,
          creative_pursuits: profile.creative_pursuits || null,
          weekend_activities: profile.weekend_activities || null,
          dietary_preferences: profile.dietary_preferences || null,
          smoking: profile.smoking || null,
          drinking: profile.drinking || null,
          ideal_date: profile.ideal_date || null,
          work_life_balance: profile.work_life_balance || null,
          career_ambitions: profile.career_ambitions || null,
          created_at: profile.created_at || null,
        };
        setProfileData(dbProfile);

        // Get onboarding progress with category breakdown
        const progress = await getUserOnboardingProgress(profile.id);
        setOnboardingProgress(progress);
        setCategoryProgress(progress.categoryProgress);

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
        const updated = await updateProfile(profileData.id, updates as any);
        setProfileData(updated as any);
        toast.success('Profile updated successfully');
        
        // Refresh onboarding progress
        const progress = await getUserOnboardingProgress(profileData.id);
        setOnboardingProgress(progress);
        setCategoryProgress(progress.categoryProgress);
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
    categoryProgress,
    engagement,
    updateProfileData,
    refreshData: loadRealProfileData
  };
};
