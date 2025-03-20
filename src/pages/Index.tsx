import React, { useEffect, useState } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import PhotoGallery from '@/components/PhotoGallery';
import ProfileDetails from '@/components/ProfileDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, ArrowRight, Heart, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const profiles = [
  {
    id: 1,
    name: "Sophia",
    age: 29,
    location: "San Francisco, CA",
    occupation: "UX Designer",
    company: "Design Studio",
    lastActive: "2 hours ago",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    details: {
      about: "Hi there! I'm Sophia, a UX designer with a passion for creating beautiful and functional digital experiences. When I'm not designing, you'll find me hiking in the mountains, trying new restaurants, or curling up with a good book. I believe in living life to the fullest and finding beauty in the small moments. Looking for someone who shares my sense of adventure and appreciation for both the outdoors and quiet evenings at home.",
      height: "170 cm",
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
      values: ["Authenticity", "Kindness", "Growth", "Adventure", "Balance"],
      // New profile information fields
      dietaryPreferences: "Mostly plant-based, occasional seafood",
      favoriteQuote: "Design is not just what it looks like and feels like. Design is how it works.",
      morningRoutine: "Meditation, coffee, and morning walk before work",
      eveningRoutine: "Reading with herbal tea, journaling, and early to bed",
      favoriteSeason: "Fall",
      idealWeather: "Slightly cool with sunshine",
      creativePursuits: ["Watercolor painting", "Digital illustration", "Handmade ceramics"],
      dreamHome: "Mountain cabin with modern interior and large windows",
      transportationPreference: "Bicycle for local, train for travel",
      techSkills: ["UI/UX design", "Figma", "Adobe Creative Suite", "Basic coding"],
      musicInstruments: ["Piano (intermediate)", "Guitar (beginner)"],
      favoriteGames: ["Chess", "Settlers of Catan", "Zelda series"],
      favoritePodcasts: ["Design Matters", "99% Invisible", "The Daily"],
      charityInvolvement: "Volunteer design work for environmental nonprofits",
      growthGoals: ["Improve public speaking", "Learn a new language", "Start a side business"],
      hiddenTalents: ["Perfect pitch", "Can identify most typefaces by name"],
      favoriteMemory: "Watching sunrise from a mountain peak after an overnight hike",
      stressRelievers: ["Yoga", "Forest walks", "Pottery class"],
      workEnvironment: "Creative, collaborative spaces with natural light",
      decisionMakingStyle: "Thoughtful and research-based, but also trust intuition"
    }
  },
  {
    id: 2,
    name: "Emma",
    age: 27,
    location: "New York, NY",
    occupation: "Marketing Manager",
    company: "Tech Startup",
    lastActive: "1 day ago",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1581599129568-e33151627628?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    details: {
      about: "Hey! I'm Emma, a marketing manager at a tech startup with a passion for storytelling and building brands. Outside of work, I love exploring new restaurants, going to live music events, and taking dance classes. I'm an avid reader and always have a book in my bag. Looking for someone who is curious about the world, enjoys trying new things, and values meaningful conversations.",
      height: "168 cm",
      bodyType: "Average",
      ethnicity: "Caucasian",
      education: "Bachelor's in Marketing, NYU",
      occupation: "Marketing Manager",
      company: "Tech Startup",
      religion: "Non-religious",
      politicalViews: "Liberal",
      drinking: "Social drinker",
      smoking: "Never",
      relationshipGoals: "Looking for something serious",
      wantChildren: "Someday",
      havePets: "Dog lover",
      languages: ["English (Native)", "Italian (Conversational)"],
      interests: ["Dancing", "Reading", "Food exploration", "Live music", "Theater", "Podcasts"],
      favoriteBooks: ["Where the Crawdads Sing", "Educated", "Normal People"],
      favoriteMovies: ["La La Land", "Before Sunrise", "Little Women"],
      favoriteMusic: ["Indie Pop", "R&B", "90s Hip Hop"],
      favoriteFoods: ["Italian", "Vietnamese", "Mexican", "Desserts of all kinds"],
      exerciseHabits: "Regular - 3 times per week",
      zodiacSign: "Gemini",
      personalityType: "ENFP",
      sleepSchedule: "Night owl",
      travelFrequency: "A few times per year",
      communicationStyle: "Open and expressive",
      loveLanguage: "Acts of Service, Physical Touch",
      petPeeves: ["People who are always late", "Loud chewing", "Negativity"],
      dreamVacation: "Island hopping in Greece",
      weekendActivities: ["Brunches with friends", "Museum exhibits", "Cocktail bars", "Book clubs"],
      financialHabits: "Balanced between saving and enjoying life",
      idealDate: "A speakeasy followed by a walk through the city at night",
      childrenStatus: "No children",
      familyCloseness: "Close with immediate family",
      friendshipStyle: "Large, diverse group of friends",
      workLifeBalance: "Working on finding better balance",
      careerAmbitions: "Building my own agency someday",
      hobbies: ["Wine tasting", "Poetry writing", "Amateur photography", "Cooking classes"],
      values: ["Honesty", "Creativity", "Connection", "Growth", "Joy"],
      // New profile information fields
      dietaryPreferences: "Omnivore with a sweet tooth",
      favoriteQuote: "The future belongs to those who believe in the beauty of their dreams.",
      morningRoutine: "Hit snooze button twice, strong coffee, quick breakfast",
      eveningRoutine: "Late dinner, Netflix, social media catch-up",
      favoriteSeason: "Summer",
      idealWeather: "Warm enough for sundresses",
      creativePursuits: ["Poetry writing", "Food styling", "Instagram content creation"],
      dreamHome: "Modern loft in the heart of the city with roof access",
      transportationPreference: "Subway and rideshare apps",
      techSkills: ["Digital marketing", "Social media strategy", "Basic graphic design"],
      musicInstruments: ["Sang in choir in high school"],
      favoriteGames: ["Cards Against Humanity", "Mario Kart", "Scrabble"],
      favoritePodcasts: ["How I Built This", "Crime Junkie", "Call Her Daddy"],
      charityInvolvement: "Fundraising committee for local animal shelter",
      growthGoals: ["Learn to code", "Travel to 30 countries before 30", "Mentor younger women"],
      hiddenTalents: ["Remembering song lyrics", "Finding amazing vintage pieces"],
      favoriteMemory: "Impromptu dance party that broke out at a street festival in Barcelona",
      stressRelievers: ["Dancing", "Bubble baths", "Reality TV"],
      workEnvironment: "High-energy, fast-paced, collaborative spaces",
      decisionMakingStyle: "Quick and intuitive, trust my gut feeling"
    }
  },
  {
    id: 3,
    name: "Olivia",
    age: 31,
    location: "Austin, TX",
    occupation: "Software Engineer",
    company: "Tech Giant",
    lastActive: "Just now",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    photos: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    details: {
      about: "Hi there, I'm Olivia! I'm a software engineer by day and a musician by night. I play guitar in a local indie band and love the Austin music scene. When I'm not coding or playing music, I enjoy paddleboarding on Lady Bird Lake, trying out new craft breweries, and taking my dog hiking. Looking for someone who is passionate about their interests and open to adventures big and small.",
      height: "175 cm",
      bodyType: "Athletic",
      ethnicity: "Hispanic",
      education: "BS in Computer Science, UT Austin",
      occupation: "Software Engineer",
      company: "Tech Giant",
      religion: "Agnostic",
      politicalViews: "Progressive",
      drinking: "Occasional",
      smoking: "Never",
      relationshipGoals: "Open to seeing where things go",
      wantChildren: "Not sure yet",
      havePets: "Dog owner (a rescue named Apollo)",
      languages: ["English (Native)", "Spanish (Fluent)", "Python (joking... kind of)"],
      interests: ["Music", "Coding", "Paddleboarding", "Hiking", "Craft beer", "Camping"],
      favoriteBooks: ["Snow Crash", "Brave New World", "Sapiens"],
      favoriteMovies: ["Arrival", "Her", "Everything Everywhere All At Once"],
      favoriteMusic: ["Indie Rock", "Folk", "Electronic", "Local Austin bands"],
      favoriteFoods: ["Tex-Mex", "BBQ", "Sushi", "Street tacos"],
      exerciseHabits: "Active - mix of outdoor activities and gym",
      zodiacSign: "Aries",
      personalityType: "INTJ",
      sleepSchedule: "Flexible - depends on band gigs",
      travelFrequency: "Whenever possible, especially for music festivals",
      communicationStyle: "Thoughtful and straightforward",
      loveLanguage: "Quality Time, Acts of Service",
      petPeeves: ["Closed-mindedness", "People who don't pick up after their dogs", "Tech bros with egos"],
      dreamVacation: "Road trip through national parks with camping gear and my guitar",
      weekendActivities: ["Live music shows", "Farmers markets", "Hiking with my dog", "Working on side projects"],
      financialHabits: "Practical but willing to spend on experiences",
      idealDate: "Live music at a small venue followed by late-night food trucks",
      childrenStatus: "No children",
      familyCloseness: "Close-knit family, though they live in California",
      friendshipStyle: "Mix of tech friends, music friends, and childhood friends",
      workLifeBalance: "Setting clear boundaries to make time for music",
      careerAmbitions: "Creating my own software while continuing to pursue music",
      hobbies: ["Home recording studio", "Learning new instruments", "Woodworking", "Rock climbing"],
      values: ["Authenticity", "Creativity", "Freedom", "Connection", "Growth"],
      // New profile information fields
      dietaryPreferences: "Flexitarian, local and sustainable focus",
      favoriteQuote: "The code is more what you'd call guidelines than actual rules.",
      morningRoutine: "Early run with the dog, cold brew, coding time before meetings",
      eveningRoutine: "Band practice or jam sessions, sunset paddleboarding when possible",
      favoriteSeason: "Spring",
      idealWeather: "Warm days with cool evenings",
      creativePursuits: ["Songwriting", "Audio production", "Open source contributions"],
      dreamHome: "Modern ranch house with recording studio and outdoor space",
      transportationPreference: "Electric car, bike for short trips",
      techSkills: ["Full stack development", "Machine learning", "Audio engineering"],
      musicInstruments: ["Guitar (advanced)", "Bass (intermediate)", "Drums (beginner)"],
      favoriteGames: ["Tabletop RPGs", "Strategy games", "Retro console games"],
      favoritePodcasts: ["Syntax", "Radiolab", "Song Exploder"],
      charityInvolvement: "Teaching coding to underprivileged youth, animal rescue volunteer",
      growthGoals: ["Release an album", "Learn embedded systems", "Become fluent in Portuguese"],
      hiddenTalents: ["Perfect pitch", "Excellent spatial memory", "Can solve Rubik's cube in under a minute"],
      favoriteMemory: "Writing and performing an original song that got local radio play",
      stressRelievers: ["Trail running", "Guitar practice", "Brewery hopping"],
      workEnvironment: "Remote with occasional office days, standing desk setup",
      decisionMakingStyle: "Analytical with data, but creative with solutions"
    }
  }
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [startX, setStartX] = useState(0);
  const [offsetX, setOffsetX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const isMobile = useIsMobile();

  const profileData = profiles[currentProfileIndex];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleDislike = () => {
    // Go to next profile
    const nextIndex = (currentProfileIndex + 1) % profiles.length;
    setCurrentProfileIndex(nextIndex);
    toast.info(`You passed on ${profileData.name}`, {
      description: "Showing you the next profile",
      position: "bottom-center",
      duration: 3000,
    });
  };

  const handleLike = () => {
    // Go to next profile with like notification
    const nextIndex = (currentProfileIndex + 1) % profiles.length;
    setCurrentProfileIndex(nextIndex);
    toast.success(`You liked ${profileData.name}!`, {
      description: "We'll let them know",
      position: "bottom-center",
      duration: 3000,
    });
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
            lastActive={profileData.lastActive}
            verified={profileData.verified}
            profileImage={profileData.profileImage}
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
        
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-tinder-rose/30 to-transparent"></div>
        
        <div className="rounded-xl overflow-hidden max-w-4xl mx-auto my-6 sm:my-8 px-4">
          <PhotoGallery 
            photos={profileData.photos} 
            name={profileData.name} 
            age={profileData.age} 
          />
        </div>
      </div>
      
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-tinder-orange/30 to-transparent"></div>
      
      <ProfileDetails details={profileData.details} />
      
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
    </main>
  );
};

export default Index;
