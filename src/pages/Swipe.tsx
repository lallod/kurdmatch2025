import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeHeader from '@/components/swipe/SwipeHeader';
import SwipeCard from '@/components/swipe/SwipeCard';
import NoMoreProfiles from '@/components/swipe/NoMoreProfiles';
import ExpandedProfileModal from '@/components/swipe/ExpandedProfileModal';
import { Profile, SwipeAction, LastAction } from '@/types/swipe';

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
  verified: true
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
  verified: false
}, {
  id: 3,
  name: "Mia Garcia",
  age: 27,
  location: "Erbil, Kurdistan",
  avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
  distance: 12,
  compatibilityScore: 88,
  kurdistanRegion: "South-Kurdistan",
  area: "South-Kurdistan",
  interests: ["Cooking", "Reading", "Travel"],
  occupation: "Teacher",
  religion: "muslim",
  bodyType: "average",
  languages: ["kurdish", "english", "arabic"],
  height: "165",
  dietaryPreferences: "No restrictions",
  photos: ["https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&q=80"],
  bio: "Educator with a passion for learning and sharing knowledge. Love cooking traditional Kurdish dishes and exploring new places.",
  relationshipGoals: "Marriage",
  verified: true
}];
const Swipe = () => {
  const navigate = useNavigate();
  const [profiles] = useState<Profile[]>(mockProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [expandedProfileOpen, setExpandedProfileOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentProfile = profiles[currentIndex];

  const handleSwipeAction = (action: SwipeAction, profileId: number) => {
    console.log('Swipe action triggered:', action, profileId);
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
    console.log('Undo action triggered');
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
    console.log('Message action triggered:', profileId);
    navigate(`/messages?user=${profileId}`);
  };

  const handleReport = (profileId: number) => {
    console.log('Report action triggered:', profileId);
    toast("Profile reported. Thank you for keeping our community safe.", {
      icon: "🛡️"
    });
  };

  const nextPhoto = () => {
    console.log('Next photo action triggered');
    if (currentProfile?.photos && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const prevPhoto = () => {
    console.log('Previous photo action triggered');
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleProfileTap = () => {
    console.log('Profile tap action triggered');
    if (!isAnimating) {
      setExpandedProfileOpen(true);
    }
  };

  if (!currentProfile) {
    return <NoMoreProfiles onStartOver={() => {
      console.log('Start over action triggered');
      setCurrentIndex(0);
    }} />;
  }

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
              onToggleExpanded={() => {
                console.log('Toggle expanded action triggered');
                setIsExpanded(!isExpanded);
              }} 
              onReport={handleReport} 
              onSwipeAction={handleSwipeAction} 
              onMessage={handleMessage}
              onTap={handleProfileTap}
              isAnimating={isAnimating}
            />
          </div>
        </div>
      </div>

      {/* Expanded Profile Modal */}
      <ExpandedProfileModal
        profile={currentProfile}
        isOpen={expandedProfileOpen}
        onClose={() => {
          console.log('Modal close action triggered');
          setExpandedProfileOpen(false);
        }}
        onSwipeAction={handleSwipeAction}
        onMessage={handleMessage}
      />

      <BottomNavigation />
    </div>
  );
};

export default Swipe;
