import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SwipeCard from '@/components/swipe/SwipeCard';
import SwipeActions from '@/components/swipe/SwipeActions';
import BottomNavigation from '@/components/BottomNavigation';
import { Profile, SwipeAction, LastAction } from '@/types/swipe';
import { getMatchRecommendations } from '@/api/profiles';
import { likeProfile, unlikeProfile } from '@/api/likes';
import { useSupabaseAuth as useAuth } from '@/integrations/supabase/auth';
import { SWIPE_CONFIG } from '@/config/swipe';

const Swipe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentProfile = profiles[currentIndex];

  useEffect(() => {
    const loadProfiles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const profilesData = await getMatchRecommendations(50);

        // Transform database profiles to match Profile interface
        const transformedProfiles = profilesData?.map(profile => ({
          id: profile.id,
          name: profile.name,
          age: profile.age,
          location: profile.location,
          avatar: profile.profile_image || profile.photos?.[0]?.url || '',
          distance: Math.floor(Math.random() * 20) + 1,
          compatibilityScore: Math.floor(Math.random() * 30) + 70,
          kurdistanRegion: profile.kurdistan_region || 'South-Kurdistan',
          area: profile.kurdistan_region || 'South-Kurdistan',
          interests: profile.interests || [],
          occupation: profile.occupation || '',
          religion: profile.religion || '',
          bodyType: profile.body_type || 'average',
          languages: profile.languages || [],
          height: profile.height || '',
          dietaryPreferences: profile.dietary_preferences || '',
          photos: profile.photos?.map(p => p.url) || [],
          bio: profile.bio || '',
          relationshipGoals: profile.relationship_goals || 'Long-term relationship',
          verified: profile.verified || false,
          gender: profile.gender || 'female',
          ethnicity: profile.ethnicity || '',
          education: profile.education || '',
          company: profile.company || '',
          careerAmbitions: profile.career_ambitions || '',
          workEnvironment: profile.work_environment || '',
          workLifeBalance: profile.work_life_balance || '',
          exerciseHabits: profile.exercise_habits || '',
          drinking: profile.drinking || '',
          smoking: profile.smoking || '',
          havePets: profile.have_pets || '',
          sleepSchedule: profile.sleep_schedule || '',
          transportationPreference: profile.transportation_preference || '',
          travelFrequency: profile.travel_frequency || '',
          politicalViews: profile.political_views || '',
          values: profile.values || [],
          zodiacSign: profile.zodiac_sign || '',
          personalityType: profile.personality_type || '',
          wantChildren: profile.want_children || '',
          childrenStatus: profile.children_status || '',
          familyCloseness: profile.family_closeness || '',
          loveLanguage: profile.love_language || '',
          communicationStyle: profile.communication_style || '',
          hobbies: profile.hobbies || [],
          creativePursuits: profile.creative_pursuits || [],
          weekendActivities: profile.weekend_activities || [],
          musicInstruments: profile.music_instruments || [],
          techSkills: profile.tech_skills || [],
          favoriteBooks: profile.favorite_books || [],
          favoriteMovies: profile.favorite_movies || [],
          favoriteMusic: profile.favorite_music || [],
          favoriteFoods: profile.favorite_foods || [],
          favoriteGames: profile.favorite_games || [],
          favoritePodcasts: profile.favorite_podcasts || [],
          favoriteQuote: profile.favorite_quote || '',
          favoriteMemory: profile.favorite_memory || '',
          favoriteSeason: profile.favorite_season || '',
          growthGoals: profile.growth_goals || [],
          morningRoutine: profile.morning_routine || '',
          eveningRoutine: profile.evening_routine || '',
          stressRelievers: profile.stress_relievers || [],
          financialHabits: profile.financial_habits || '',
          friendshipStyle: profile.friendship_style || '',
          decisionMakingStyle: profile.decision_making_style || '',
          charityInvolvement: profile.charity_involvement || '',
          hiddenTalents: profile.hidden_talents || [],
          petPeeves: profile.pet_peeves || [],
          dreamVacation: profile.dream_vacation || '',
          idealDate: profile.ideal_date || '',
          dreamHome: profile.dream_home || '',
          idealWeather: profile.ideal_weather || ''
        })) || [];

        setProfiles(transformedProfiles);
      } catch (error) {
        console.error('Failed to load profiles:', error);
        toast.error('Failed to load profiles');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [user]);

  const handleSwipeAction = async (action: SwipeAction, profileId: string) => {
    setLastAction({ type: action, profileId });
    
    try {
      switch (action) {
        case 'pass':
          await unlikeProfile(profileId);
          toast("Profile passed", { icon: "👋" });
          break;
        case 'like':
          const result = await likeProfile(profileId);
          if (result.match) {
            toast("It's a match! 🎉", { icon: "💜" });
          } else {
            toast("Profile liked!", { icon: "💜" });
          }
          break;
        case 'superlike':
          await likeProfile(profileId);
          toast("Super like sent!", { icon: "⭐" });
          break;
      }
    } catch (error) {
      console.error('Error handling swipe action:', error);
      toast.error('Something went wrong. Please try again.');
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast("No more profiles to show", { icon: "🔄" });
    }
  };

  const handleMessage = (profileId: string) => {
    navigate(`/messages?user=${profileId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <div className="text-center">
          <div className={`${SWIPE_CONFIG.header.icon.size} bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto ${SWIPE_CONFIG.header.icon.margin} animate-pulse`}>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div className="text-white text-lg sm:text-xl font-semibold">Loading profiles...</div>
          <div className="text-purple-200 mt-1 sm:mt-2 text-sm sm:text-base">Finding your perfect matches</div>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <div className="text-center text-white">
          <div className={`${SWIPE_CONFIG.header.icon.size} bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto ${SWIPE_CONFIG.header.icon.margin}`}>
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <h2 className={`${SWIPE_CONFIG.header.title.size} font-bold mb-2 bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent`}>
            No more profiles
          </h2>
          <p className="text-purple-200 text-sm sm:text-base">Check back later for new matches!</p>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex flex-col">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className={`${SWIPE_CONFIG.header.maxWidth} mx-auto ${SWIPE_CONFIG.header.padding} ${SWIPE_CONFIG.header.height}`}>
          <div className={`text-center ${SWIPE_CONFIG.header.title.spacing}`}>
            <div className={`${SWIPE_CONFIG.header.icon.size} bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto ${SWIPE_CONFIG.header.icon.margin}`}>
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
            <h1 className={`${SWIPE_CONFIG.header.title.size} font-bold bg-gradient-to-r from-purple-300 via-pink-400 to-purple-400 bg-clip-text text-transparent`}>
              Discover Love
            </h1>
            <p className="text-purple-200 text-sm sm:text-base">Swipe to find your perfect match</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center overflow-hidden pb-24">
        {/* Card Stack Container */}
        <div className={`relative flex items-center justify-center w-full h-full ${SWIPE_CONFIG.stack.container.padding} ${SWIPE_CONFIG.stack.container.spacing}`}>
          {/* Background Cards (stacked behind) */}
          {profiles.slice(currentIndex + 1, currentIndex + 3).map((profile, index) => (
            <div
              key={profile.id}
              className="absolute"
              style={{
                transform: `scale(${SWIPE_CONFIG.stack.background.scale[index]}) translateY(${SWIPE_CONFIG.stack.background.offset[index]}px)`,
                zIndex: 10 - index,
                opacity: SWIPE_CONFIG.stack.background.opacity[index]
              }}
            >
              <SwipeCard 
                profile={profile}
                onSwipeLeft={() => {}}
                onSwipeRight={() => {}}
                onMessage={() => {}}
                onSuperLike={() => {}}
                isBackground={true}
              />
            </div>
          ))}
          
          {/* Main Active Card */}
          <div className="relative z-20">
            <SwipeCard 
              profile={currentProfile}
              onSwipeLeft={() => handleSwipeAction('pass', currentProfile.id)}
              onSwipeRight={() => handleSwipeAction('like', currentProfile.id)}
              onMessage={() => handleMessage(currentProfile.id)}
              onSuperLike={() => handleSwipeAction('superlike', currentProfile.id)}
              isBackground={false}
            />
          </div>
        </div>
        
        {/* Action Buttons at Bottom */}
        <div className={`fixed ${SWIPE_CONFIG.actions.container.bottom} left-0 right-0 z-30`}>
          <SwipeActions
            onRewind={() => toast("Rewind is a premium feature", { icon: "⭐" })}
            onPass={() => handleSwipeAction('pass', currentProfile.id)}
            onLike={() => handleSwipeAction('like', currentProfile.id)}
            onSuperLike={() => handleSwipeAction('superlike', currentProfile.id)}
            onBoost={() => toast("Boost is a premium feature", { icon: "⚡" })}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Swipe;