
import React, { useEffect, useState } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import PhotoGallery from '@/components/PhotoGallery';
import ProfileDetails from '@/components/ProfileDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, ArrowDown, Lock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Profile data
  const profileData = {
    name: "Sophia",
    age: 29,
    location: "San Francisco, CA",
    occupation: "UX Designer",
    company: "Design Studio",
    lastActive: "2 hours ago",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1598897516650-e4dc73d8e417?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    details: {
      about: "Hi there! I'm Sophia, a UX designer with a passion for creating beautiful and functional digital experiences. When I'm not designing, you'll find me hiking in the mountains, trying new restaurants, or curling up with a good book. I believe in living life to the fullest and finding beauty in the small moments. Looking for someone who shares my sense of adventure and appreciation for both the outdoors and quiet evenings at home.",
      height: "5'7\"",
      bodyType: "Athletic",
      ethnicity: "Mixed",
      education: "Master's in Design, Stanford University",
      occupation: "UX Designer",
      company: "Design Studio",
      religion: "Spiritual but not religious",
      politicalViews: "Moderate",
      drinking: "Social drinker",
      smoking: "Never",
      relationshipGoals: "Looking for a serious relationship",
      wantChildren: "Open to children",
      havePets: "Cat owner",
      languages: ["English (Native)", "French (Conversational)", "Spanish (Basic)"],
      interests: ["Hiking", "Photography", "Cooking", "Yoga", "Travel", "Art", "Reading", "Board games"],
      favoriteBooks: ["The Alchemist", "Thinking, Fast and Slow", "Dune"],
      favoriteMovies: ["Lost in Translation", "The Grand Budapest Hotel", "Parasite"],
      favoriteMusic: ["Indie Folk", "Jazz", "Classic Rock", "Electronic"],
      favoriteFoods: ["Japanese", "Mediterranean", "Thai", "Italian"],
      exerciseHabits: "Regular - 4-5 times per week",
      zodiacSign: "Libra",
      personalityType: "ENFJ",
      sleepSchedule: "Early bird",
      travelFrequency: "Several times per year",
      communicationStyle: "Direct and thoughtful",
      loveLanguage: "Quality Time, Words of Affirmation",
      petPeeves: ["Tardiness", "Poor communication", "Rudeness to service workers"],
      dreamVacation: "Backpacking through Southeast Asia",
      weekendActivities: ["Farmers markets", "Hiking trails", "Art exhibitions", "Cozy coffee shops"],
      financialHabits: "Saver with occasional splurges",
      idealDate: "A hike followed by dinner at a local restaurant",
      childrenStatus: "No children",
      familyCloseness: "Very close with family",
      friendshipStyle: "Small circle of close friends",
      workLifeBalance: "Values boundaries between work and personal life",
      careerAmbitions: "Working towards creative director position",
      hobbies: ["Film photography", "Ceramics", "Rock climbing", "Cooking new cuisines"],
      values: ["Authenticity", "Kindness", "Growth", "Adventure", "Balance"]
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-tinder-rose to-tinder-orange">
        <div className="animate-bounce flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4">
            <Heart size={40} className="text-tinder-rose animate-pulse-heart" />
          </div>
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className={`fixed top-4 right-4 z-50 ${isMobile ? 'top-2 right-2' : ''}`}>
        <Link to="/admin">
          <Button 
            variant="outline" 
            size={isMobile ? "icon" : "sm"} 
            className={`
              bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white
              ${!isMobile && 'flex items-center gap-2'}
            `}
          >
            <Lock size={16} />
            {!isMobile && "Admin"}
          </Button>
        </Link>
      </div>
      
      <ProfileHeader
        name={profileData.name}
        age={profileData.age}
        location={profileData.location}
        occupation={profileData.occupation}
        lastActive={profileData.lastActive}
        verified={profileData.verified}
        profileImage={profileData.profileImage}
      />
      
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-tinder-rose/30 to-transparent"></div>
      
      <ScrollArea className={`${isMobile ? 'max-h-[45vh]' : 'max-h-[60vh]'} overflow-hidden`}>
        <div className="rounded-xl overflow-hidden max-w-4xl mx-auto my-8 px-4">
          <PhotoGallery 
            photos={profileData.photos} 
            name={profileData.name} 
            age={profileData.age} 
          />
        </div>
      </ScrollArea>
      
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-tinder-orange/30 to-transparent"></div>
      
      <ProfileDetails details={profileData.details} />
      
      <footer className="w-full py-8 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Dating Profile App</p>
      </footer>
    </main>
  );
};

export default Index;
