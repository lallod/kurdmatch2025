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
  interests: ["Language", "Culture", "Education", "Reading", "Travel", "Cooking"],
  occupation: "Linguist",
  religion: "muslim",
  bodyType: "average",
  languages: ["kurdish", "turkish", "english", "arabic"],
  height: "163",
  dietaryPreferences: "No restrictions",
  photos: ["https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=400&q=80", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"],
  bio: "Passionate about languages and cultures. Love exploring the rich heritage of Kurdistan while building bridges between communities. I believe in the power of education and cultural exchange to bring people together.",
  relationshipGoals: "Long-term relationship",
  verified: true,
  // Personal Information
  gender: "female",
  ethnicity: "Kurdish",
  // Career & Education
  education: "Master's in Linguistics",
  company: "Kurdistan University",
  careerAmbitions: "Become a leading expert in Kurdish linguistics",
  workEnvironment: "Academic/Research",
  workLifeBalance: "Balanced approach to work and personal life",
  // Lifestyle
  exerciseHabits: "Regular yoga and hiking",
  drinking: "Occasionally with friends",
  smoking: "Never",
  havePets: "Love cats",
  sleepSchedule: "Early bird - sleep by 10pm",
  transportationPreference: "Walking and public transport",
  travelFrequency: "Monthly adventures",
  // Beliefs & Values
  politicalViews: "Progressive",
  values: ["Family", "Education", "Cultural preservation", "Equality"],
  zodiacSign: "Virgo",
  personalityType: "INFJ",
  // Relationships & Family
  wantChildren: "Yes, in the future",
  childrenStatus: "No children yet",
  familyCloseness: "Very close to family",
  loveLanguage: "Words of affirmation",
  communicationStyle: "Direct but kind",
  // Interests & Hobbies
  hobbies: ["Reading", "Writing", "Photography", "Cooking traditional dishes"],
  creativePursuits: ["Writing poetry", "Photography", "Traditional crafts"],
  weekendActivities: ["Museum visits", "Hiking", "Family gatherings"],
  musicInstruments: ["Piano"],
  techSkills: ["Research software", "Language databases"],
  // Favorites
  favoriteBooks: ["One Hundred Years of Solitude", "Kurdish poetry collections"],
  favoriteMovies: ["Cinema Paradiso", "Kurdish independent films"],
  favoriteMusic: ["Traditional Kurdish music", "Classical"],
  favoriteFoods: ["Dolma", "Kebab", "Kurdish rice dishes"],
  favoriteGames: ["Chess", "Word puzzles"],
  favoritePodcasts: ["Language learning", "Cultural discussions"],
  favoriteQuote: "Language is the roadmap of a culture",
  favoriteMemory: "First time visiting Erbil with family",
  favoriteSeason: "Spring",
  // Personal Growth
  growthGoals: ["Learn new languages", "Preserve Kurdish culture", "Travel more"],
  morningRoutine: "Meditation, coffee, and reading news",
  eveningRoutine: "Cooking, reading, and family calls",
  stressRelievers: ["Nature walks", "Reading", "Music"],
  financialHabits: "Careful saver and budgeter",
  friendshipStyle: "Loyal and supportive",
  decisionMakingStyle: "Thoughtful and research-based",
  charityInvolvement: "Education programs for children",
  hiddenTalents: ["Traditional dancing", "Calligraphy"],
  petPeeves: ["Disrespect for culture", "Loud eating"],
  dreamVacation: "Cultural tour of Kurdish regions",
  idealDate: "Museum visit followed by traditional dinner",
  dreamHome: "Traditional Kurdish home with modern amenities",
  idealWeather: "Cool spring morning with gentle breeze"
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
  interests: ["Technology", "Sports", "Reading", "Innovation", "Fitness"],
  occupation: "IT Consultant",
  religion: "muslim",
  bodyType: "muscular",
  languages: ["kurdish", "persian", "english"],
  height: "182",
  dietaryPreferences: "High protein diet",
  photos: ["https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80", "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"],
  bio: "Tech enthusiast who loves staying active and building innovative solutions. Looking for someone to share adventures and build a meaningful connection while exploring both traditional and modern aspects of life.",
  relationshipGoals: "Serious dating",
  verified: false,
  // Personal Information
  gender: "male",
  ethnicity: "Kurdish",
  // Career & Education
  education: "Bachelor's in Computer Science",
  company: "Tech Solutions Kurdistan",
  careerAmbitions: "Start my own tech company",
  workEnvironment: "Remote-friendly startup",
  workLifeBalance: "Work hard, play hard",
  // Lifestyle
  exerciseHabits: "Daily gym and weekend sports",
  drinking: "Socially on weekends",
  smoking: "Never",
  havePets: "Would love a dog",
  sleepSchedule: "Night owl - productive after 9pm",
  transportationPreference: "Motorcycle and car",
  travelFrequency: "Quarterly business trips",
  // Beliefs & Values
  politicalViews: "Moderate",
  values: ["Innovation", "Hard work", "Family", "Progress"],
  zodiacSign: "Leo",
  personalityType: "ENTJ",
  // Relationships & Family
  wantChildren: "Yes, definitely",
  childrenStatus: "No children",
  familyCloseness: "Close but independent",
  loveLanguage: "Acts of service",
  communicationStyle: "Direct and solution-focused"
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
  interests: ["Cooking", "Reading", "Travel", "Education", "Art"],
  occupation: "Teacher",
  religion: "muslim",
  bodyType: "average",
  languages: ["kurdish", "english", "arabic"],
  height: "165",
  dietaryPreferences: "Mediterranean diet",
  photos: ["https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=400&q=80"],
  bio: "Educator with a passion for learning and sharing knowledge. Love cooking traditional Kurdish dishes and exploring new places. Believe in making a positive impact through education and cultural appreciation.",
  relationshipGoals: "Marriage",
  verified: true,
  // Personal Information
  gender: "female",
  ethnicity: "Kurdish",
  // Career & Education
  education: "Master's in Education",
  company: "International School of Kurdistan",
  careerAmbitions: "Open a cultural education center",
  workEnvironment: "Collaborative school environment",
  workLifeBalance: "Family comes first",
  // Lifestyle
  exerciseHabits: "Dancing and walking",
  drinking: "Never",
  smoking: "Never",
  havePets: "Love birds",
  sleepSchedule: "Early to bed, early to rise",
  transportationPreference: "Car and walking",
  travelFrequency: "Summer vacations",
  // Beliefs & Values
  politicalViews: "Traditional values",
  values: ["Family", "Education", "Community", "Tradition"],
  zodiacSign: "Cancer",
  personalityType: "ESFJ"
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

      {/* Main Card - zero padding for full screen usage */}
      <div className="pt-12 pb-16 h-full flex flex-col">
        <div className="flex-1 h-full w-full flex items-center justify-center min-h-0">
          <div className="w-full h-full flex">
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
