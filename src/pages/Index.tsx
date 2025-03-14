
import React, { useEffect, useState } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import PhotoGallery from '@/components/PhotoGallery';
import ProfileDetails from '@/components/ProfileDetails';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'photos' | 'details'>('photos');
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
      travelFrequency: "Several times per year"
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

  if (isMobile) {
    return (
      <main className="min-h-screen bg-black text-white">
        <ProfileHeader
          name={profileData.name}
          age={profileData.age}
          location={profileData.location}
          occupation={profileData.occupation}
          lastActive={profileData.lastActive}
          verified={profileData.verified}
          profileImage={profileData.profileImage}
        />
        
        {activeSection === 'photos' && (
          <PhotoGallery photos={profileData.photos} />
        )}
        
        {activeSection === 'details' && (
          <div className="pt-16 pb-20">
            <ProfileDetails details={profileData.details} />
          </div>
        )}
        
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800 flex z-10">
          <button 
            className={`flex-1 flex flex-col items-center justify-center transition-colors ${activeSection === 'photos' ? 'text-tinder-rose' : 'text-gray-400'}`}
            onClick={() => setActiveSection('photos')}
          >
            <span className="text-sm font-medium">Photos</span>
          </button>
          <button 
            className={`flex-1 flex flex-col items-center justify-center transition-colors ${activeSection === 'details' ? 'text-tinder-rose' : 'text-gray-400'}`}
            onClick={() => setActiveSection('details')}
          >
            <span className="text-sm font-medium">Details</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
      
      <PhotoGallery photos={profileData.photos} />
      
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-tinder-orange/30 to-transparent"></div>
      
      <ProfileDetails details={profileData.details} />
      
      <footer className="w-full py-8 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Dating Profile App</p>
      </footer>
    </main>
  );
};

export default Index;
