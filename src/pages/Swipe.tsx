import React, { useState, useEffect } from 'react';
import SwipeCard from '@/components/swipe/SwipeCard';
import SwipeHeader from '@/components/swipe/SwipeHeader';
import NoMoreProfiles from '@/components/swipe/NoMoreProfiles';
import ProfileFilters from '@/components/filters/ProfileFilters';
import { Profile, SwipeAction } from '@/types/swipe';
import { useProfileFiltering } from '@/hooks/useProfileFiltering';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';

// Mock profiles data - in real app this would come from your database
const mockProfiles: Profile[] = [
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
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
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
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
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

const Swipe = () => {
  const [profiles] = useState<Profile[]>(mockProfiles);
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const {
    filters,
    filteredProfiles,
    updateFilters,
    clearAllFilters,
    totalResults
  } = useProfileFiltering(profiles);

  // Use filtered profiles for swiping
  const currentProfile = filteredProfiles[currentProfileIndex];

  useEffect(() => {
    // Reset to first profile when filters change
    setCurrentProfileIndex(0);
    setCurrentPhotoIndex(0);
  }, [filters]);

  const handleNextPhoto = () => {
    if (currentProfile?.photos && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };

  const handlePrevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };

  const handleSwipeAction = (action: SwipeAction, profileId: number) => {
    const nextIndex = currentProfileIndex + 1;
    
    if (nextIndex < filteredProfiles.length) {
      setCurrentProfileIndex(nextIndex);
      setCurrentPhotoIndex(0);
    }

    // Show appropriate toast
    const actionMessages = {
      like: 'Liked! 💖',
      pass: 'Passed',
      superlike: 'Super Liked! ⭐',
    };

    toast.success(actionMessages[action], {
      position: "bottom-center",
      duration: 2000,
    });
  };

  const handleReport = (profileId: number) => {
    toast.info('Profile reported. Thank you for keeping our community safe.', {
      position: "bottom-center",
      duration: 3000,
    });
  };

  const handleMessage = (profileId: number) => {
    toast.info('Message feature coming soon!', {
      position: "bottom-center",
      duration: 2000,
    });
  };

  if (filteredProfiles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <SwipeHeader />
        
        {/* Filter Toggle */}
        <div className="px-4 py-2 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <span className="text-sm text-gray-600">
              {totalResults} profiles found
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 py-4 bg-white border-b">
            <ProfileFilters
              searchTerm={filters.searchTerm}
              onSearchChange={(term) => updateFilters({ searchTerm: term })}
              ageRange={filters.ageRange}
              onAgeRangeChange={(range) => updateFilters({ ageRange: range })}
              heightRange={filters.heightRange}
              onHeightRangeChange={(range) => updateFilters({ heightRange: range })}
              location={filters.location}
              onLocationChange={(location) => updateFilters({ location })}
              onClearAllFilters={clearAllFilters}
            />
          </div>
        )}

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
              <X className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No profiles match your filters</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or clearing some filters</p>
            <Button onClick={clearAllFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentProfileIndex >= filteredProfiles.length) {
    return <NoMoreProfiles />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <SwipeHeader />
      
      {/* Filter Toggle */}
      <div className="px-4 py-2 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <span className="text-sm text-gray-600">
            {currentProfileIndex + 1} of {totalResults} profiles
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-4 py-4 bg-white border-b">
          <ProfileFilters
            searchTerm={filters.searchTerm}
            onSearchChange={(term) => updateFilters({ searchTerm: term })}
            ageRange={filters.ageRange}
            onAgeRangeChange={(range) => updateFilters({ ageRange: range })}
            heightRange={filters.heightRange}
            onHeightRangeChange={(range) => updateFilters({ heightRange: range })}
            location={filters.location}
            onLocationChange={(location) => updateFilters({ location })}
            onClearAllFilters={clearAllFilters}
          />
        </div>
      )}

      {/* Main Swipe Area */}
      <div className="flex-1 p-4 max-w-md mx-auto">
        <SwipeCard
          profile={currentProfile}
          currentPhotoIndex={currentPhotoIndex}
          isExpanded={isExpanded}
          onNextPhoto={handleNextPhoto}
          onPrevPhoto={handlePrevPhoto}
          onToggleExpanded={() => setIsExpanded(!isExpanded)}
          onReport={handleReport}
          onSwipeAction={handleSwipeAction}
          onMessage={handleMessage}
        />
      </div>
    </div>
  );
};

export default Swipe;
