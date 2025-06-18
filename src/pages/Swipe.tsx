import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import BottomNavigation from '@/components/BottomNavigation';
import SwipeHeader from '@/components/swipe/SwipeHeader';
import SwipeCard from '@/components/swipe/SwipeCard';
import NoMoreProfiles from '@/components/swipe/NoMoreProfiles';
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

  const currentProfile = profiles[currentIndex];

  const handleSwipeAction = (action: SwipeAction, profileId: number) => {
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

  if (!currentProfile) {
    return <NoMoreProfiles onStartOver={() => setCurrentIndex(0)} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 overflow-hidden">
      <SwipeHeader lastAction={lastAction} onUndo={handleUndo} />

      {/* Main Card - positioned between fixed header and bottom nav */}
      <div className="pt-16 pb-20 h-full flex flex-col">
        <div className="flex-1 px-3 sm:px-4 py-2 flex items-center justify-center">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg h-full flex">
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

      <BottomNavigation />
    </div>
  );
};

export default Swipe;
