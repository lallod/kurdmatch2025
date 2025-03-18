
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import ProfileHeader from '@/components/ProfileHeader';
import PhotoGallery from '@/components/PhotoGallery';
import ProfileDetails from '@/components/ProfileDetails';
import { ScrollArea } from '@/components/ui/scroll-area';

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true);

  // User profile data
  const profileData = {
    id: 0,
    name: "Alex",
    age: 28,
    location: "San Francisco, CA",
    occupation: "Product Designer",
    company: "Tech Company",
    lastActive: "Just now",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    details: {
      about: "Hi there! I'm Alex, a product designer with a passion for creating intuitive and beautiful digital experiences. I love tackling complex problems and turning them into simple, elegant solutions. When I'm not designing, you'll find me hiking in the mountains, trying new restaurants, or learning to play guitar. Looking for someone who values creativity, adventure, and thoughtful conversation.",
      height: "175 cm",
      bodyType: "Athletic",
      ethnicity: "Mixed",
      education: "Master's in Design, RISD",
      occupation: "Product Designer",
      company: "Tech Company",
      religion: "Spiritual but not religious",
      politicalViews: "Progressive",
      drinking: "Social drinker",
      smoking: "Never",
      relationshipGoals: "Looking for a meaningful connection",
      wantChildren: "Open to children",
      havePets: "Dog lover",
      languages: ["English (Native)", "Spanish (Conversational)"],
      interests: ["Design", "Hiking", "Photography", "Live music", "Cooking", "Travel"],
      favoriteBooks: ["Dune", "Thinking Fast and Slow", "The Design of Everyday Things"],
      favoriteMovies: ["Interstellar", "The Grand Budapest Hotel", "Before Sunrise"],
      favoriteMusic: ["Indie Rock", "Electronic", "Jazz", "Folk"],
      favoriteFoods: ["Thai", "Mexican", "Italian", "Japanese"],
      exerciseHabits: "Regular - 4-5 times per week",
      zodiacSign: "Aquarius",
      personalityType: "INFJ",
      sleepSchedule: "Night owl but working on it",
      travelFrequency: "As often as possible",
      communicationStyle: "Direct but thoughtful",
      loveLanguage: "Quality Time, Acts of Service",
      petPeeves: ["Lateness", "Close-mindedness", "Bad tippers"],
      dreamVacation: "Backpacking through Japan",
      weekendActivities: ["Brunch with friends", "Hiking trips", "Gallery hopping", "Trying new restaurants"],
      financialHabits: "Balanced between saving and experiences",
      idealDate: "A hike with amazing views followed by a cozy dinner",
      childrenStatus: "No children",
      familyCloseness: "Close with family",
      friendshipStyle: "Quality over quantity",
      workLifeBalance: "Striving for better balance",
      careerAmbitions: "Building products that improve people's lives",
      hobbies: ["Photography", "Guitar", "Cooking", "Rock climbing"],
      values: ["Empathy", "Curiosity", "Creativity", "Growth", "Authenticity"],
      dietaryPreferences: "Flexitarian, mostly plant-based",
      favoriteQuote: "Design is not just what it looks like and feels like. Design is how it works.",
      morningRoutine: "Coffee, meditation, and a quick workout",
      eveningRoutine: "Reading and sketching ideas",
      favoriteSeason: "Fall",
      idealWeather: "Crisp autumn day with sunshine",
      creativePursuits: ["UI design", "Photography", "Guitar playing"],
      dreamHome: "Modern cabin in the mountains with a design studio",
      transportationPreference: "Electric vehicle and biking",
      techSkills: ["UI/UX design", "Figma", "Frontend development basics"],
      musicInstruments: ["Guitar (intermediate)", "Piano (beginner)"],
      favoriteGames: ["Chess", "Strategic board games", "Breath of the Wild"],
      favoritePodcasts: ["Design Matters", "99% Invisible", "How I Built This"],
      charityInvolvement: "Mentor for design students, environmental causes",
      growthGoals: ["Become a better public speaker", "Learn woodworking", "Get better at languages"],
      hiddenTalents: ["Can draw portraits", "Good at improvising recipes"],
      favoriteMemory: "Solo backpacking trip through Southeast Asia",
      stressRelievers: ["Trail running", "Cooking elaborate meals", "Photography"],
      workEnvironment: "Creative, collaborative spaces with natural light",
      decisionMakingStyle: "Deliberate but not overthinking"
    }
  };

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

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
      
      <ScrollArea className="max-h-[60vh] md:max-h-[65vh] overflow-hidden">
        <div className="rounded-xl overflow-hidden max-w-4xl mx-auto my-6 sm:my-8 px-4">
          <PhotoGallery 
            photos={profileData.photos} 
            name={profileData.name} 
            age={profileData.age} 
          />
        </div>
      </ScrollArea>
      
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-tinder-orange/30 to-transparent"></div>
      
      <ProfileDetails details={profileData.details} />
      
      <footer className="w-full py-6 md:py-8 px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Dating Profile App</p>
      </footer>
    </main>
  );
};

export default UserProfile;
