
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
  body_type: string | null;
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
  travel_frequency: string | null;
  transportation_preference: string | null;
  
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
  career_ambitions: string | null;
  work_environment: string | null;
  work_life_balance: string | null;
  
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
  
  // Personal Growth & Habits
  growth_goals: string[] | null;
  morning_routine: string | null;
  evening_routine: string | null;
  financial_habits: string | null;
  stress_relievers: string[] | null;
  
  // Social & Personality
  friendship_style: string | null;
  decision_making_style: string | null;
  charity_involvement: string | null;
  
  // Preferences
  favorite_memory: string | null;
  favorite_quote: string | null;
  favorite_season: string | null;
  ideal_weather: string | null;
  dream_home: string | null;
  
  // Special Traits
  hidden_talents: string[] | null;
  pet_peeves: string[] | null;
  
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
              : null,
          // Ensure other array fields are properly handled
          languages: Array.isArray(profile.languages) ? profile.languages : profile.languages ? [profile.languages] : null,
          values: Array.isArray(profile.values) ? profile.values : profile.values ? [profile.values] : null,
          interests: Array.isArray(profile.interests) ? profile.interests : profile.interests ? [profile.interests] : null,
          hobbies: Array.isArray(profile.hobbies) ? profile.hobbies : profile.hobbies ? [profile.hobbies] : null,
          creative_pursuits: Array.isArray(profile.creative_pursuits) ? profile.creative_pursuits : profile.creative_pursuits ? [profile.creative_pursuits] : null,
          weekend_activities: Array.isArray(profile.weekend_activities) ? profile.weekend_activities : profile.weekend_activities ? [profile.weekend_activities] : null,
          music_instruments: Array.isArray(profile.music_instruments) ? profile.music_instruments : profile.music_instruments ? [profile.music_instruments] : null,
          tech_skills: Array.isArray(profile.tech_skills) ? profile.tech_skills : profile.tech_skills ? [profile.tech_skills] : null,
          favorite_books: Array.isArray(profile.favorite_books) ? profile.favorite_books : profile.favorite_books ? [profile.favorite_books] : null,
          favorite_movies: Array.isArray(profile.favorite_movies) ? profile.favorite_movies : profile.favorite_movies ? [profile.favorite_movies] : null,
          favorite_music: Array.isArray(profile.favorite_music) ? profile.favorite_music : profile.favorite_music ? [profile.favorite_music] : null,
          favorite_foods: Array.isArray(profile.favorite_foods) ? profile.favorite_foods : profile.favorite_foods ? [profile.favorite_foods] : null,
          favorite_games: Array.isArray(profile.favorite_games) ? profile.favorite_games : profile.favorite_games ? [profile.favorite_games] : null,
          favorite_podcasts: Array.isArray(profile.favorite_podcasts) ? profile.favorite_podcasts : profile.favorite_podcasts ? [profile.favorite_podcasts] : null,
          growth_goals: Array.isArray(profile.growth_goals) ? profile.growth_goals : profile.growth_goals ? [profile.growth_goals] : null,
          stress_relievers: Array.isArray(profile.stress_relievers) ? profile.stress_relievers : profile.stress_relievers ? [profile.stress_relievers] : null,
          hidden_talents: Array.isArray(profile.hidden_talents) ? profile.hidden_talents : profile.hidden_talents ? [profile.hidden_talents] : null,
          pet_peeves: Array.isArray(profile.pet_peeves) ? profile.pet_peeves : profile.pet_peeves ? [profile.pet_peeves] : null
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
