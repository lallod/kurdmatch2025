import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeHeader from '@/components/swipe/SwipeHeader';
import SwipeCard from '@/components/swipe/SwipeCard';
import NoMoreProfiles from '@/components/swipe/NoMoreProfiles';
import ExpandedProfileModal from '@/components/swipe/ExpandedProfileModal';
import { Profile, SwipeAction, LastAction } from '@/types/swipe';
import { useProfileData } from '@/hooks/useProfileData';
import { getMatchRecommendations } from '@/api/profiles';

// Keep mock profiles as fallback
const mockProfiles: Profile[] = [{
  id: 1,
  name: "Emma Johnson",
  age: 26,
  location: "Diyarbakır, Kurdistan",
  avatar: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=150&q=80",
  distance: 7,
  compatibilityScore: 95,
  kurdistanRegion: "North-Kurdistan",
  area: "North-Kurdistan",
  interests: ["Language", "Culture", "Education"],
  occupation: "Linguist",
  religion: "muslim",
  bodyType: "average",
  languages: ["kurdish", "turkish", "english"],
  height: "163",
  dietaryPreferences: "No restrictions",
  photos: ["https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=400&q=80", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"],
  bio: "Passionate about languages and cultures. Love exploring the rich heritage of Kurdistan while building bridges between communities.",
  relationshipGoals: "Long-term relationship",
  verified: true,
  // Extended fields for demonstration
  exerciseHabits: "Regular gym sessions",
  values: ["Family", "Education", "Cultural Heritage"],
  hobbies: ["Reading", "Traveling", "Cooking"],
  favoriteBooks: ["The Alchemist", "Kurdish Poetry"],
  dreamVacation: "Exploring ancient Mesopotamian sites"
}, {
  id: 2,
  name: "Lucas Davis",
  age: 30,
  location: "Mahabad, Kurdistan",
  avatar: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=150&q=80",
  distance: 15,
  compatibilityScore: 91,
  kurdistanRegion: "East-Kurdistan",
  area: "East-Kurdistan",
  interests: ["Technology", "Sports", "Reading"],
  occupation: "IT Consultant",
  religion: "muslim",
  bodyType: "muscular",
  languages: ["kurdish", "persian", "english"],
  height: "182",
  dietaryPreferences: "No restrictions",
  photos: ["https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"],
  bio: "Tech enthusiast who loves staying active. Looking for someone to share adventures and build a meaningful connection.",
  relationshipGoals: "Serious dating",
  verified: false,
  // Extended fields
  exerciseHabits: "CrossFit and hiking",
  values: ["Innovation", "Adventure", "Fitness"],
  hobbies: ["Programming", "Mountain climbing", "Photography"],
  favoriteMovies: ["Inception", "Kurdish Cinema"],
  dreamVacation: "Silicon Valley tech tours"
}];

const Swipe = () => {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [expandedProfileOpen, setExpandedProfileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  
  const { fetchFullProfile, fullProfileData, loading } = useProfileData();

  // Load real profiles from database
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoadingProfiles(true);
        const realProfiles = await getMatchRecommendations(10);
        
        if (realProfiles && realProfiles.length > 0) {
          // Transform database profiles to Profile interface
          const transformedProfiles: Profile[] = realProfiles.map((dbProfile, index) => ({
            id: parseInt(dbProfile.id),
            name: dbProfile.name || 'Unknown',
            age: dbProfile.age || 25,
            location: dbProfile.location || 'Kurdistan',
            avatar: dbProfile.profile_image || `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&w=150&q=80`,
            distance: Math.floor(Math.random() * 50) + 1,
            compatibilityScore: Math.floor(Math.random() * 30) + 70,
            kurdistanRegion: dbProfile.kurdistan_region || undefined,
            area: dbProfile.kurdistan_region || 'Kurdistan',
            interests: dbProfile.interests || [],
            occupation: dbProfile.occupation || undefined,
            religion: dbProfile.religion || undefined,
            bodyType: dbProfile.body_type || undefined,
            languages: dbProfile.languages || [],
            height: dbProfile.height || undefined,
            photos: dbProfile.photos?.map(p => p.url) || [dbProfile.profile_image].filter(Boolean),
            bio: dbProfile.bio || undefined,
            relationshipGoals: dbProfile.relationship_goals || undefined,
            verified: dbProfile.verified || false,
            
            // Map extended fields
            ethnicity: dbProfile.ethnicity || undefined,
            exerciseHabits: dbProfile.exercise_habits || undefined,
            havePets: dbProfile.have_pets || undefined,
            drinking: dbProfile.drinking || undefined,
            smoking: dbProfile.smoking || undefined,
            dietaryPreferences: dbProfile.dietary_preferences || undefined,
            sleepSchedule: dbProfile.sleep_schedule || undefined,
            travelFrequency: dbProfile.travel_frequency || undefined,
            values: dbProfile.values || undefined,
            zodiacSign: dbProfile.zodiac_sign || undefined,
            personalityType: dbProfile.personality_type || undefined,
            wantChildren: dbProfile.want_children || undefined,
            education: dbProfile.education || undefined,
            company: dbProfile.company || undefined,
            hobbies: dbProfile.hobbies || undefined,
            favoriteBooks: dbProfile.favorite_books || undefined,
            favoriteMovies: dbProfile.favorite_movies || undefined,
            favoriteMusic: dbProfile.favorite_music || undefined,
            dreamVacation: dbProfile.dream_vacation || undefined,
            favoriteQuote: dbProfile.favorite_quote || undefined,
            growthGoals: dbProfile.growth_goals || undefined
          }));
          
          setProfiles(transformedProfiles);
        } else {
          // Fallback to mock profiles if no real profiles
          setProfiles(mockProfiles);
        }
      } catch (error) {
        console.error('Error loading profiles:', error);
        setProfiles(mockProfiles); // Fallback to mock data
        toast.error('Using demo profiles');
      } finally {
        setLoadingProfiles(false);
      }
    };

    loadProfiles();
  }, []);

  const currentProfile = profiles[currentIndex];

  const handleSwipeAction = (action: SwipeAction, profileId: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setLastAction({
      type: action,
      profileId
    });

    switch (action) {
      case 'pass':
        toast("Profile passed", {
          icon: "👋"
        });
        break;
      case 'like':
        toast("Profile liked!", {
          icon: "💜"
        });
        break;
      case 'superlike':
        toast("Super like sent!", {
          icon: "⭐"
        });
        break;
    }

    // Animate card exit and move to next profile
    setTimeout(() => {
      if (currentIndex < profiles.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentPhotoIndex(0);
        setIsExpanded(false);
        setExpandedProfileOpen(false);
      } else {
        toast("No more profiles to show", {
          icon: "🔄"
        });
      }
      setIsAnimating(false);
    }, 500);
  };

  const handleUndo = () => {
    if (lastAction && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setLastAction(null);
      setIsAnimating(false);
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

  const handleProfileTap = async () => {
    if (!isAnimating && currentProfile) {
      // Try to fetch full profile data from database
      const fullProfile = await fetchFullProfile(currentProfile.id);
      setExpandedProfileOpen(true);
    }
  };

  const handleRegularTap = () => {
    if (!isAnimating) {
      setExpandedProfileOpen(true);
    }
  };

  if (loadingProfiles) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return <NoMoreProfiles onStartOver={() => setCurrentIndex(0)} />;
  }

  const profileToShow = fullProfileData || currentProfile;

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 overflow-hidden">
      <SwipeHeader lastAction={lastAction} onUndo={handleUndo} />

      {/* Main Card - optimized spacing for better viewport utilization */}
      <div className="pt-10 pb-14 h-full flex flex-col">
        <div className="flex-1 px-2 sm:px-3 py-1 flex items-center justify-center min-h-0">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-full flex relative">
            {/* Next card preview (behind current card) */}
            {profiles[currentIndex + 1] && !isAnimating && (
              <div className="absolute inset-0 scale-95 opacity-50 -z-10">
                <SwipeCard 
                  profile={profiles[currentIndex + 1]}
                  currentPhotoIndex={0}
                  isExpanded={false}
                  onNextPhoto={() => {}}
                  onPrevPhoto={() => {}}
                  onToggleExpanded={() => {}}
                  onReport={() => {}}
                  onSwipeAction={() => {}}
                  onMessage={() => {}}
                  onTap={() => {}}
                  isAnimating={true}
                />
              </div>
            )}
            
            {/* Current card */}
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
              onTap={handleRegularTap}
              onProfileTap={handleProfileTap}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </div>

      {/* Expanded Profile Modal */}
      <ExpandedProfileModal
        profile={profileToShow}
        isOpen={expandedProfileOpen}
        onClose={() => {
          setExpandedProfileOpen(false);
        }}
        onSwipeAction={handleSwipeAction}
        onMessage={handleMessage}
      />

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-4">
            <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default Swipe;
