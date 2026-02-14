import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SwipeCard from '@/components/swipe/SwipeCard';
import SwipeActions from '@/components/swipe/SwipeActions';
import BottomNavigation from '@/components/BottomNavigation';
import { SwipeFilterSidebar } from '@/components/swipe/SwipeFilters';
import { Profile, SwipeAction, LastAction } from '@/types/swipe';
import { getMatchRecommendations } from '@/api/profiles';
import { likeProfile, unlikeProfile } from '@/api/likes';
import { useSupabaseAuth as useAuth } from '@/integrations/supabase/auth';
import { SWIPE_CONFIG } from '@/config/swipe';
import Logo from '@/components/landing/Logo';
import { SlidersHorizontal, Bell, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompatibility } from '@/hooks/useCompatibility';
import { SmartNotificationCenter } from '@/components/notifications/SmartNotificationCenter';
import { ProfileBoostCard } from '@/components/boost/ProfileBoostCard';
import { useSwipeHistory } from '@/hooks/useSwipeHistory';

const Swipe = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getCompatibilityForProfiles } = useCompatibility();
  const { recordSwipeAction, rewind, isRewinding, remainingRewinds } = useSwipeHistory();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [boostOpen, setBoostOpen] = useState(false);
  const [filters, setFilters] = useState<{
    ageMin?: number;
    ageMax?: number;
    location?: string;
    religion?: string;
  }>({});

  const currentProfile = profiles[currentIndex];

  const loadProfiles = async (appliedFilters?: typeof filters) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const profilesData = await getMatchRecommendations(50, appliedFilters);

      if (!profilesData || profilesData.length === 0) {
        setProfiles([]);
        return;
      }

      // Get compatibility scores for all profiles
      const profileIds = profilesData.map(p => p.id);
      const compatibilityScores = await getCompatibilityForProfiles(profileIds);

      // Transform database profiles to match Profile interface
      const transformedProfiles = profilesData?.map(profile => ({
        id: profile.id,
        name: profile.name,
        age: profile.age,
        location: profile.location,
        avatar: profile.profile_image || profile.photos?.[0]?.url || '',
        distance: Math.floor(Math.random() * 20) + 1,
        compatibilityScore: compatibilityScores.get(profile.id) || 50,
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
          video_verified: profile.video_verified || false,
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

  useEffect(() => {
    loadProfiles(filters);
  }, [user]);

  const handleApplyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentIndex(0);
    loadProfiles(newFilters);
  };

  const handleSwipeAction = async (action: SwipeAction, profileId: string) => {
    setLastAction({ type: action, profileId });
    
    try {
      // Record the swipe in history first
      await recordSwipeAction(profileId, action);
      
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

  const handleRewind = async () => {
    if (isRewinding) return;
    
    const rewoundProfile = await rewind();
    
    if (rewoundProfile) {
      // Insert the rewound profile at the current position
      setProfiles(prev => {
        const newProfiles = [...prev];
        newProfiles.splice(currentIndex, 0, rewoundProfile);
        return newProfiles;
      });
    }
  };

  const handleMessage = (profileId: string) => {
    navigate(`/messages?user=${profileId}`);
  };

  const handleProfileClick = (profile: Profile) => {
    navigate('/profile', { state: { profileId: profile.id } });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-surface-secondary">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-surface-secondary">
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
    <div className="h-screen bg-gradient-to-b from-background to-surface-secondary flex flex-col overflow-hidden">
      {/* Header with Logo and Actions */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 z-20">
        <Logo size="small" withText={true} />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setBoostOpen(true)}
            className="text-white hover:bg-white/10 border border-white/20 rounded-full w-10 h-10 sm:w-11 sm:h-11"
          >
            <Zap className="w-5 h-5 text-yellow-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen(true)}
            className="text-white hover:bg-white/10 border border-white/20 rounded-full w-10 h-10 sm:w-11 sm:h-11 relative"
          >
            <Bell className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setFilterOpen(true)}
            className="text-white hover:bg-white/10 border border-white/20 rounded-full w-10 h-10 sm:w-11 sm:h-11"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Filter Sidebar */}
      <SwipeFilterSidebar 
        onApplyFilters={handleApplyFilters} 
        currentFilters={filters}
        open={filterOpen}
        onOpenChange={setFilterOpen}
      />

      {/* Notifications Panel */}
      <SmartNotificationCenter 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />

      {/* Boost Modal */}
      {boostOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBoostOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <ProfileBoostCard onClose={() => setBoostOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center pb-20 sm:pb-24">
        {/* Card Stack Container */}
        <div className={`relative flex items-center justify-center w-full h-[92%] sm:h-[90%] ${SWIPE_CONFIG.stack.container.padding} ${SWIPE_CONFIG.stack.container.spacing}`}>
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
              onProfileClick={() => handleProfileClick(currentProfile)}
              isBackground={false}
            />
          </div>
        </div>
      </div>
        
      {/* Action Buttons Section - Fixed above navigation */}
      <div className="fixed bottom-14 sm:bottom-16 left-0 right-0 bg-gradient-to-t from-background/60 via-background/30 to-transparent backdrop-blur-md z-40 pb-1 sm:pb-2">
        <SwipeActions
          onRewind={handleRewind}
          onPass={() => handleSwipeAction('pass', currentProfile.id)}
          onLike={() => handleSwipeAction('like', currentProfile.id)}
          onSuperLike={() => handleSwipeAction('superlike', currentProfile.id)}
          onBoost={() => toast("Boost is a premium feature", { icon: "⚡" })}
          isRewinding={isRewinding}
          remainingRewinds={remainingRewinds}
        />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Swipe;