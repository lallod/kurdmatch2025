import React, { useEffect, useState } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import PhotoGallery from '@/components/PhotoGallery';
import ProfileDetails from '@/components/ProfileDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, ArrowRight, Heart, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import MatchPopup from '@/components/MatchPopup';
import { getMatchRecommendations } from '@/api/profiles';
import { likeProfile } from '@/api/likes';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const Index = () => {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState([]);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<{id: number, name: string, profileImage: string} | null>(null);
  const [showNextProfileNotification, setShowNextProfileNotification] = useState(false);
  const [passedProfile, setPassedProfile] = useState<{id: string, name: string} | null>(null);
  const isMobile = useIsMobile();

  const profileData = profiles[currentProfileIndex];

  useEffect(() => {
    const loadProfiles = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const profilesData = await getMatchRecommendations(10);
        setProfiles(profilesData || []);
      } catch (error) {
        console.error('Failed to load profiles:', error);
        toast.error('Failed to load profiles');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, [user]);

  // Real match checking using backend
  const checkForMatch = async (profileId: string) => {
    try {
      const result = await likeProfile(profileId);
      
      if (result.match) {
        const profile = profiles.find(p => p.id === profileId);
        if (profile) {
          setMatchedProfile({
            id: parseInt(profile.id),
            name: profile.name,
            profileImage: profile.profile_image || profile.photos?.[0]?.url
          });
          setShowMatchPopup(true);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking for match:', error);
      return false;
    }
  };

  // Filter already viewed profiles to avoid showing them again
  const getNextUnviewedProfile = () => {
    // In a real app, you'd have a more sophisticated algorithm
    // Here we just wrap around the existing profiles array
    const nextIndex = (currentProfileIndex + 1) % profiles.length;
    return nextIndex;
  };

  const handleDislike = () => {
    if (!profileData) return;
    
    // Store the passed profile data
    const currentProfile = {
      id: profileData.id,
      name: profileData.name
    };
    setPassedProfile(currentProfile);
    
    // Show the notification
    setShowNextProfileNotification(true);
    
    // Go to next profile
    const nextIndex = getNextUnviewedProfile();
    setCurrentProfileIndex(nextIndex);
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNextProfileNotification(false);
    }, 3000);
  };

  const handleLike = async () => {
    if (!profileData) return;
    
    const wasMatch = await checkForMatch(profileData.id);
    
    if (!wasMatch) {
      toast.success("Profile liked!", {
        description: "Great choice! We'll let you know if it's a match.",
      });
    }
    
    // Go to next profile
    const nextIndex = getNextUnviewedProfile();
    setCurrentProfileIndex(nextIndex);
  };

  // Touch handlers for swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    // Limit the drag distance
    if (Math.abs(diff) < 150) {
      setOffsetX(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    // If swipe distance is significant, consider it a swipe
    if (offsetX > 80) {
      // Swiped right (like)
      handleLike();
    } else if (offsetX < -80) {
      // Swiped left (dislike)
      handleDislike();
    }
    
    // Reset offset
    setOffsetX(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
        <div className="animate-bounce flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
            <Heart size={40} className="text-purple-600 animate-pulse" />
          </div>
          <div className="text-white text-xl font-semibold">Loading profiles...</div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-pink-900">
        <div className="text-center text-white">
          <Heart size={64} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No more profiles</h2>
          <p className="text-purple-200">Check back later for new matches!</p>
        </div>
      </div>
    );
  }

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className={`transition-transform duration-300 ${offsetX !== 0 ? 'scale-[0.98]' : ''}`}
        style={{
          transform: `translateX(${offsetX}px) rotate(${offsetX * 0.05}deg)`,
        }}
      >
        <div className="relative overflow-hidden">
          <ProfileHeader
            name={profileData.name}
            age={profileData.age}
            location={profileData.location}
            occupation={profileData.occupation}
            lastActive={profileData.last_active}
            verified={profileData.verified}
            profileImage={profileData.profile_image || profileData.photos?.[0]?.url}
          />
          
          {/* Swiping indicators */}
          {offsetX > 50 && (
            <div className="absolute top-1/2 left-8 transform -translate-y-1/2 rounded-full bg-green-500/90 p-3 animate-pulse z-20">
              <Heart size={40} className="text-white" />
            </div>
          )}
          
          {offsetX < -50 && (
            <div className="absolute top-1/2 right-8 transform -translate-y-1/2 rounded-full bg-red-500/90 p-3 animate-pulse z-20">
              <X size={40} className="text-white" />
            </div>
          )}
        </div>
        
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
        
        <div className="rounded-xl overflow-hidden max-w-4xl mx-auto my-6 sm:my-8 px-4">
          <PhotoGallery 
            photos={profileData.photos?.map(p => p.url) || []} 
            name={profileData.name} 
            age={profileData.age} 
          />
        </div>
      </div>
      
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>
      
      <ProfileDetails details={{
        about: profileData.bio || '',
        height: profileData.height || '',
        bodyType: profileData.body_type || '',
        ethnicity: profileData.ethnicity || '',
        education: profileData.education || '',
        occupation: profileData.occupation || '',
        company: profileData.company || '',
        religion: profileData.religion || '',
        politicalViews: profileData.political_views || '',
        drinking: profileData.drinking || '',
        smoking: profileData.smoking || '',
        relationshipGoals: profileData.relationship_goals || '',
        wantChildren: profileData.want_children || '',
        havePets: profileData.have_pets || '',
        languages: profileData.languages || [],
        interests: profileData.interests || [],
        favoriteBooks: profileData.favorite_books || [],
        favoriteMovies: profileData.favorite_movies || [],
        favoriteMusic: profileData.favorite_music || [],
        favoriteFoods: profileData.favorite_foods || [],
        exerciseHabits: profileData.exercise_habits || '',
        zodiacSign: profileData.zodiac_sign || '',
        personalityType: profileData.personality_type || '',
        sleepSchedule: profileData.sleep_schedule || '',
        travelFrequency: profileData.travel_frequency || '',
        communicationStyle: profileData.communication_style || '',
        loveLanguage: profileData.love_language || '',
        hobbies: profileData.hobbies || [],
        values: profileData.values || [],
      }} />
      
      <div className="fixed bottom-24 left-0 right-0 flex justify-center gap-4 px-4 py-2 z-20">
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full bg-white border-gray-300 shadow-lg flex items-center justify-center"
          onClick={handleDislike}
        >
          <X size={30} className="text-red-500" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full bg-white border-gray-300 shadow-lg flex items-center justify-center"
          onClick={() => {
            toast.info(`Message sent to ${profileData.name}`, {
              position: "bottom-center",
              duration: 3000,
            });
          }}
        >
          <MessageCircle size={30} className="text-blue-500" />
        </Button>
        
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full bg-white border-gray-300 shadow-lg flex items-center justify-center"
          onClick={handleLike}
        >
          <Heart size={30} className="text-green-500" />
        </Button>
      </div>

      {/* Match Popup */}
      <MatchPopup 
        isOpen={showMatchPopup}
        onClose={() => setShowMatchPopup(false)}
        matchedProfile={matchedProfile}
      />
      
      {/* Passed Profile Notification */}
      {passedProfile && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/95 text-white flex items-center gap-2 z-30">
          <X size={18} className="text-red-500" />
          <p className="text-sm">You passed on {passedProfile.name}</p>
        </div>
      )}
    </main>
  );
};

export default Index;