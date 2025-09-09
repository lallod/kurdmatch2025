import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SwipeCard from '@/components/swipe/SwipeCard';
import SwipeActions from '@/components/swipe/SwipeActions';
import { Profile, SwipeAction, LastAction } from '@/types/swipe';
import { getMatchRecommendations } from '@/api/profiles';
import { likeProfile, unlikeProfile } from '@/api/likes';
import { useAuth } from '@/hooks/useAuth';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
        <div className="text-white text-xl font-semibold">Loading profiles...</div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
          <p className="text-purple-200">Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900">
      <div className="h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <SwipeCard 
            profile={currentProfile}
            onSwipeLeft={() => handleSwipeAction('pass', currentProfile.id)}
            onSwipeRight={() => handleSwipeAction('like', currentProfile.id)}
          />
        </div>
        
        <SwipeActions
          onSwipeAction={handleSwipeAction}
          onMessage={handleMessage}
          profileId={currentProfile.id}
        />
      </div>
    </div>
  );
};

export default Swipe;