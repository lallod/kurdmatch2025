import React, { useEffect, useState } from 'react';
import ProfileHeader from '@/components/ProfileHeader';
import PhotoGallery from '@/components/PhotoGallery';
import ProfileDetails from '@/components/ProfileDetails';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart, ArrowDown, Lock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Link } from 'react-router-dom';
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
      "https://images.unsplash.com/photo-1581599129568-e33151627628?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    details: {
      about: "Hey! I'm Emma, a marketing manager at a tech startup with a passion for storytelling and building brands. Outside of work, I love exploring new restaurants, going to live music events, and taking dance classes. I'm an avid reader and always have a book in my bag. Looking for someone who is curious about the world, enjoys trying new things, and values meaningful conversations.",
      height: "5'6\"",
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
      values: ["Honesty", "Creativity", "Connection", "Growth", "Joy"]
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
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1490195117352-aa267f47f2d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    ],
    details: {
      about: "Hi there, I'm Olivia! I'm a software engineer by day and a musician by night. I play guitar in a local indie band and love the Austin music scene. When I'm not coding or playing music, I enjoy paddleboarding on Lady Bird Lake, trying out new craft breweries, and taking my dog hiking. Looking for someone who is passionate about their interests and open to adventures big and small.",
      height: "5'9\"",
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
      values: ["Authenticity", "Creativity", "Freedom", "Connection", "Growth"]
    }
  }
];

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
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
    toast.success(`You disliked ${profileData.name}'s profile`, {
      description: "Showing you the next profile",
      position: "bottom-center",
      duration: 3000,
    });
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
      <div className="fixed top-4 right-4 z-50">
        <Link to="/admin">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white flex items-center gap-2"
          >
            <Lock size={16} />
            Admin
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
        onDislike={handleDislike}
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

export default Index;
