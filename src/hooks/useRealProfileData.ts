
import { useState, useEffect } from 'react';
import { getCurrentUserProfile, updateProfile } from '@/api/profiles';
import { getUserOnboardingProgress, getRealUserEngagement, CategoryProgress } from '@/utils/realUserEnhancement';
import { assignRandomValues, updateFieldWithSource, EnhancedProfileData, FieldSource } from '@/utils/profileEnhancement';
import { fillEmptyProfileFields } from '@/utils/directProfileFiller';
import { convertDbToUiValues, convertUiToDbValues } from '@/utils/valueMapping';
import { convertDbToUiProfile, convertUiToDbProfile } from '@/utils/fieldNameMapping';
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
  const [enhancedData, setEnhancedData] = useState<EnhancedProfileData | null>(null);
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
      console.log('Loaded profile:', profile?.name || 'No profile found');
      
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

        // Fill empty fields directly with random values FIRST
        console.log('BEFORE filling - Sample fields:', {
          exercise_habits: dbProfile.exercise_habits,
          dietary_preferences: dbProfile.dietary_preferences,
          smoking: dbProfile.smoking,
          drinking: dbProfile.drinking,
          religion: dbProfile.religion,
          zodiac_sign: dbProfile.zodiac_sign
        });
        
        const filledProfile = fillEmptyProfileFields(dbProfile);
        console.log('AFTER direct filling - Sample fields:', {
          exercise_habits: filledProfile.exercise_habits,
          dietary_preferences: filledProfile.dietary_preferences,
          smoking: filledProfile.smoking,
          drinking: filledProfile.drinking,
          religion: filledProfile.religion,
          zodiac_sign: filledProfile.zodiac_sign
        });

        // Convert database values to UI values for proper display
        const uiCompatibleProfile = convertDbToUiValues(filledProfile);
        console.log('AFTER value conversion - Sample fields:', {
          exercise_habits: uiCompatibleProfile.exercise_habits,
          dietary_preferences: uiCompatibleProfile.dietary_preferences,
          smoking: uiCompatibleProfile.smoking,
          drinking: uiCompatibleProfile.drinking,
          religion: uiCompatibleProfile.religion,
          zodiac_sign: uiCompatibleProfile.zodiac_sign,
          education: uiCompatibleProfile.education,
          relationship_goals: uiCompatibleProfile.relationship_goals,
          work_life_balance: uiCompatibleProfile.work_life_balance,
          have_pets: uiCompatibleProfile.have_pets
        });

        // Convert field names from snake_case to camelCase for UI
        const finalProfile = convertDbToUiProfile(uiCompatibleProfile);
        console.log('FINAL profile with camelCase fields:', {
          exerciseHabits: finalProfile.exerciseHabits,
          dietaryPreferences: finalProfile.dietaryPreferences,
          smoking: finalProfile.smoking,
          drinking: finalProfile.drinking,
          religion: finalProfile.religion,
          zodiacSign: finalProfile.zodiacSign
        });

        // Apply additional random values using the original system
        const enhanced = assignRandomValues(finalProfile);
        console.log('Enhanced field sources:', {
          exerciseHabits: enhanced.fieldSources.exerciseHabits,
          exercise_habits: enhanced.fieldSources.exercise_habits
        });
        setEnhancedData(enhanced);

        // Get onboarding progress with category breakdown (using enhanced data)
        const progress = await getUserOnboardingProgress(profile.id, enhanced.profileData);
        setOnboardingProgress(progress);
        setCategoryProgress(progress.categoryProgress);

        // Get engagement metrics
        const userEngagement = await getRealUserEngagement(profile.id);
        setEngagement(userEngagement);
        
        console.log('Profile completion:', progress.profileCompletion);
        console.log('Category progress:', progress.categoryProgress);
        console.log('Profile data loaded successfully for:', profile.name);
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
      if (profileData && enhancedData) {
        // Convert UI updates to database format before saving
        const dbUpdates = convertUiToDbProfile(updates);
        const dbValueUpdates = convertUiToDbValues(dbUpdates);
        
        console.log('Update conversion:', {
          originalUpdates: updates,
          dbUpdates: dbUpdates,
          dbValueUpdates: dbValueUpdates
        });
        
        const updated = await updateProfile(profileData.id, dbValueUpdates as any);
        setProfileData(updated as any);
        
        // Update enhanced data and mark fields as user-set
        let newEnhanced = { ...enhancedData };
        Object.keys(updates).forEach(fieldName => {
          newEnhanced = updateFieldWithSource(
            newEnhanced.profileData,
            newEnhanced.fieldSources,
            fieldName,
            updates[fieldName as keyof DatabaseProfile]
          );
        });
        setEnhancedData(newEnhanced);
        
        toast.success('Profile updated successfully');
        
        // Refresh onboarding progress with enhanced data
        const progress = await getUserOnboardingProgress(profileData.id, newEnhanced.profileData);
        setOnboardingProgress(progress);
        setCategoryProgress(progress.categoryProgress);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  return {
    profileData: enhancedData?.profileData || profileData,
    fieldSources: enhancedData?.fieldSources || {},
    loading,
    onboardingProgress,
    categoryProgress,
    engagement,
    updateProfileData,
    refreshData: loadRealProfileData
  };
};
