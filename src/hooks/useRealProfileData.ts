
import { useState, useEffect } from 'react';
import { getCurrentUserProfile, updateProfile } from '@/api/profiles';
import { getUserOnboardingProgress, getRealUserEngagement, CategoryProgress } from '@/utils/realUserEnhancement';
import { convertDbToUiProfile } from '@/utils/fieldNameMapping';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';

export const useRealProfileData = () => {
  const { t } = useTranslations();
  const [profileData, setProfileData] = useState<any>(null);
  const [fieldSources, setFieldSources] = useState<Record<string, string>>({});
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
      const profile = await getCurrentUserProfile();
      
      if (profile) {
        // Store raw DB profile directly - no random filling
        setProfileData(profile);

        // Mark all existing fields as 'user' source
        const sources: Record<string, string> = {};
        Object.keys(profile).forEach(key => {
          if (profile[key] !== null && profile[key] !== undefined && profile[key] !== '') {
            sources[key] = 'user';
          }
        });
        setFieldSources(sources);

        // Get onboarding progress using raw DB data
        const progress = await getUserOnboardingProgress(profile.id, profile);
        setOnboardingProgress(progress);
        setCategoryProgress(progress.categoryProgress);

        // Get engagement metrics
        const userEngagement = await getRealUserEngagement(profile.id);
        setEngagement(userEngagement);
      }
    } catch (error) {
      console.error('Error loading real profile data:', error);
      toast.error(t('toast.profile.load_failed', 'Failed to load profile data'));
    } finally {
      setLoading(false);
    }
  };

  const updateProfileData = async (updates: Record<string, any>) => {
    try {
      if (profileData) {
        // Save to DB
        await updateProfile(profileData.id, updates as any);
        
        // Optimistic local merge - merge snake_case updates into raw profile
        const mergedProfile = { ...profileData, ...updates };
        setProfileData(mergedProfile);

        // Mark updated fields as 'user'
        const updatedSources = { ...fieldSources };
        Object.keys(updates).forEach(key => {
          updatedSources[key] = 'user';
        });
        setFieldSources(updatedSources);

        // Recalculate onboarding progress
        const progress = await getUserOnboardingProgress(profileData.id, mergedProfile);
        setOnboardingProgress(progress);
        setCategoryProgress(progress.categoryProgress);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('toast.profile.update_failed', 'Failed to update profile'));
    }
  };

  return {
    profileData,
    fieldSources,
    loading,
    onboardingProgress,
    categoryProgress,
    engagement,
    updateProfileData,
    refreshData: loadRealProfileData
  };
};
