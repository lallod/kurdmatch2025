import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Profile } from '@/types/swipe';
import { useSubscription } from '@/hooks/useSubscription';
import { 
  recordSwipe, 
  getLastSwipe, 
  markSwipeAsRewound, 
  getTodayRewindCount,
  SwipeHistoryEntry 
} from '@/api/swipes';
import { supabase } from '@/integrations/supabase/client';

// Daily rewind limits by subscription tier
const REWIND_LIMITS = {
  free: 0,
  basic: 3,
  premium: 10,
  gold: Infinity, // unlimited
};

interface UseSwipeHistoryReturn {
  canRewind: boolean;
  remainingRewinds: number | null;
  recordSwipeAction: (profileId: string, action: 'like' | 'pass' | 'superlike') => Promise<void>;
  rewind: () => Promise<Profile | null>;
  isRewinding: boolean;
}

export const useSwipeHistory = (): UseSwipeHistoryReturn => {
  const { subscription } = useSubscription();
  const [isRewinding, setIsRewinding] = useState(false);
  const [todayRewindCount, setTodayRewindCount] = useState<number>(0);
  const [lastSwipe, setLastSwipe] = useState<SwipeHistoryEntry | null>(null);

  const rewindLimit = REWIND_LIMITS[subscription.subscription_type];
  const canRewind = rewindLimit > todayRewindCount && lastSwipe !== null;
  const remainingRewinds = rewindLimit === Infinity ? null : rewindLimit - todayRewindCount;

  const recordSwipeAction = useCallback(async (
    profileId: string, 
    action: 'like' | 'pass' | 'superlike'
  ) => {
    const result = await recordSwipe(profileId, action);
    if (result.success) {
      // Fetch the last swipe to keep it in memory
      const swipe = await getLastSwipe();
      setLastSwipe(swipe);
    }
  }, []);

  const rewind = useCallback(async (): Promise<Profile | null> => {
    if (subscription.subscription_type === 'free') {
      toast.error('Rewind is a premium feature', { icon: '⭐' });
      return null;
    }

    if (!canRewind) {
      if (rewindLimit <= todayRewindCount) {
        toast.error(`You've used all ${rewindLimit} rewinds today`, { icon: '⏰' });
      } else {
        toast.error('No swipe to undo', { icon: '🔄' });
      }
      return null;
    }

    setIsRewinding(true);

    try {
      const swipeToRewind = await getLastSwipe();
      
      if (!swipeToRewind) {
        toast.error('No swipe to undo', { icon: '🔄' });
        return null;
      }

      // Mark the swipe as rewound
      const markResult = await markSwipeAsRewound(swipeToRewind.id);
      if (!markResult.success) {
        throw new Error(markResult.error);
      }

      // If it was a like or superlike, remove the like from the database
      if (swipeToRewind.action === 'like' || swipeToRewind.action === 'superlike') {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase
            .from('likes')
            .delete()
            .eq('liker_id', session.user.id)
            .eq('likee_id', swipeToRewind.swiped_profile_id);

          // Also remove any match that was created
          await supabase
            .from('matches')
            .delete()
            .or(`and(user1_id.eq.${session.user.id},user2_id.eq.${swipeToRewind.swiped_profile_id}),and(user1_id.eq.${swipeToRewind.swiped_profile_id},user2_id.eq.${session.user.id})`);
        }
      }

      // Fetch the profile data for the rewound swipe
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          photos (url)
        `)
        .eq('id', swipeToRewind.swiped_profile_id)
        .single();

      if (profileError || !profileData) {
        throw new Error('Failed to fetch profile');
      }

      // Update rewind count
      setTodayRewindCount(prev => prev + 1);
      
      // Clear last swipe
      const newLastSwipe = await getLastSwipe();
      setLastSwipe(newLastSwipe);

      toast.success('Swipe undone!', { icon: '⏪' });

      // Transform to Profile type
      const profile: Profile = {
        id: profileData.id,
        name: profileData.name || '',
        age: profileData.age || 0,
        location: profileData.location || '',
        avatar: profileData.profile_image || profileData.photos?.[0]?.url || '',
        distance: Math.floor(Math.random() * 20) + 1,
        compatibilityScore: 50,
        kurdistanRegion: profileData.kurdistan_region || 'South-Kurdistan',
        area: profileData.kurdistan_region || 'South-Kurdistan',
        interests: profileData.interests || [],
        occupation: profileData.occupation || '',
        religion: profileData.religion || '',
        bodyType: profileData.body_type || 'average',
        languages: profileData.languages || [],
        height: profileData.height || '',
        dietaryPreferences: profileData.dietary_preferences || '',
        photos: profileData.photos?.map((p: { url: string }) => p.url) || [],
        bio: profileData.bio || '',
        relationshipGoals: profileData.relationship_goals || 'Long-term relationship',
        verified: profileData.verified || false,
        video_verified: profileData.video_verified || false,
        gender: profileData.gender || 'female',
        ethnicity: profileData.ethnicity || '',
        education: profileData.education || '',
        company: profileData.company || '',
        careerAmbitions: profileData.career_ambitions || '',
        workEnvironment: profileData.work_environment || '',
        workLifeBalance: profileData.work_life_balance || '',
        exerciseHabits: profileData.exercise_habits || '',
        drinking: profileData.drinking || '',
        smoking: profileData.smoking || '',
        havePets: profileData.have_pets || '',
        sleepSchedule: profileData.sleep_schedule || '',
        transportationPreference: profileData.transportation_preference || '',
        travelFrequency: profileData.travel_frequency || '',
        politicalViews: profileData.political_views || '',
        values: profileData.values || [],
        zodiacSign: profileData.zodiac_sign || '',
        personalityType: profileData.personality_type || '',
        wantChildren: profileData.want_children || '',
        childrenStatus: profileData.children_status || '',
        familyCloseness: profileData.family_closeness || '',
        loveLanguage: profileData.love_language || '',
        communicationStyle: profileData.communication_style || '',
        hobbies: profileData.hobbies || [],
        creativePursuits: profileData.creative_pursuits || [],
        weekendActivities: profileData.weekend_activities || [],
        musicInstruments: profileData.music_instruments || [],
        techSkills: profileData.tech_skills || [],
        favoriteBooks: profileData.favorite_books || [],
        favoriteMovies: profileData.favorite_movies || [],
        favoriteMusic: profileData.favorite_music || [],
        favoriteFoods: profileData.favorite_foods || [],
        favoriteGames: profileData.favorite_games || [],
        favoritePodcasts: profileData.favorite_podcasts || [],
        favoriteQuote: profileData.favorite_quote || '',
        favoriteMemory: profileData.favorite_memory || '',
        favoriteSeason: profileData.favorite_season || '',
        growthGoals: profileData.growth_goals || [],
        morningRoutine: profileData.morning_routine || '',
        eveningRoutine: profileData.evening_routine || '',
        stressRelievers: profileData.stress_relievers || [],
        financialHabits: profileData.financial_habits || '',
        friendshipStyle: profileData.friendship_style || '',
        decisionMakingStyle: profileData.decision_making_style || '',
        charityInvolvement: profileData.charity_involvement || '',
        hiddenTalents: profileData.hidden_talents || [],
        petPeeves: profileData.pet_peeves || [],
        dreamVacation: profileData.dream_vacation || '',
        idealDate: profileData.ideal_date || '',
        dreamHome: profileData.dream_home || '',
        idealWeather: profileData.ideal_weather || '',
      };

      return profile;
    } catch (error) {
      console.error('Error rewinding swipe:', error);
      toast.error('Failed to undo swipe');
      return null;
    } finally {
      setIsRewinding(false);
    }
  }, [subscription.subscription_type, canRewind, rewindLimit, todayRewindCount]);

  // Initialize rewind count on mount
  useState(() => {
    getTodayRewindCount().then(setTodayRewindCount);
    getLastSwipe().then(setLastSwipe);
  });

  return {
    canRewind,
    remainingRewinds,
    recordSwipeAction,
    rewind,
    isRewinding,
  };
};
