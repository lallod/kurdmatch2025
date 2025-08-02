import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeHeader from '@/components/swipe/SwipeHeader';
import SwipeCard from '@/components/swipe/SwipeCard';
import NoMoreProfiles from '@/components/swipe/NoMoreProfiles';
import { Profile, SwipeAction, LastAction } from '@/types/swipe';
import { getMatchRecommendations } from '@/api/profiles';
import { likeProfile, unlikeProfile } from '@/api/likes';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const Swipe = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
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
          id: parseInt(profile.id),
          name: profile.name,
          age: profile.age,
          location: profile.location,
          avatar: profile.profile_image || profile.photos?.[0]?.url || '',
          distance: Math.floor(Math.random() * 20) + 1, // Mock distance for now
          compatibilityScore: Math.floor(Math.random() * 30) + 70, // Mock score for now
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

  const handleSwipeAction = async (action: SwipeAction, profileId: number) => {
    setLastAction({
      type: action,
      profileId
    });

    try {
      switch (action) {
        case 'pass':
          await unlikeProfile(profileId.toString());
          toast("Profile passed", {
            icon: "👋"
          });
          break;
        case 'like':
          const result = await likeProfile(profileId.toString());
          if (result.match) {
            toast("It's a match! 🎉", {
              icon: "💜"
            });
          } else {
            toast("Profile liked!", {
              icon: "💜"
            });
          }
          break;
        case 'superlike':
          await likeProfile(profileId.toString());
          toast("Super like sent!", {
            icon: "⭐"
          });
          break;
      }
    } catch (error) {
      console.error('Error handling swipe action:', error);
      toast.error('Something went wrong. Please try again.');
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentPhotoIndex(0);
      setIsExpanded(false);
    } else {
      toast("No more profiles to show", {
        icon: "🔄"
      });
    }
  };

  const handleUndo = () => {
    if (lastAction && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLastAction(null);
      toast("Action undone", {
        icon: "↩️"
      });
    }
  };

  const handleMessage = (profileId: number) => {
    navigate(`/messages?user=${profileId}`);
  };

  const handleReport = (profileId: number) => {
    toast("Profile reported. Thank you for keeping our community safe.", {
      icon: "🛡️"
    });
  };

  const nextPhoto = () => {
    if (currentProfile?.photos && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-purple-900/30" />
        </div>
        <div className="h-full flex items-center justify-center">
          <div className="text-white text-xl font-semibold">Loading profiles...</div>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return <NoMoreProfiles onStartOver={() => setCurrentIndex(0)} />;
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Enhanced Purple Gradient Background with Depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-purple-900/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-transparent" />
      </div>

      <SwipeHeader lastAction={lastAction} onUndo={handleUndo} />

      {/* Main Card Container with Enhanced Styling */}
      <div className="relative h-full pb-16">
        <div className="h-full w-full flex items-center justify-center p-2 md:p-4">
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg h-full relative">
            {/* Card Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl transform scale-105 opacity-75" />
            
            {/* Main Card */}
            <div className="relative h-full animate-scale-in">
              <SwipeCard 
                profile={currentProfile} 
                currentPhotoIndex={currentPhotoIndex} 
                isExpanded={isExpanded} 
                onNextPhoto={nextPhoto} 
                onPrevPhoto={prevPhoto} 
                onToggleExpanded={() => setIsExpanded(!isExpanded)} 
                onReport={handleReport} 
                onSwipeAction={handleSwipeAction} 
                onMessage={handleMessage} 
              />
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Swipe;