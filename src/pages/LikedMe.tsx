
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, X, Filter, MessageCircle, ArrowLeft, Bot, Sparkles } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ProfileDetails from "@/components/ProfileDetails";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PhotoGallery from "@/components/PhotoGallery";

const LikedMe = () => {
  const { toast } = useToast();
  const [likedProfiles, setLikedProfiles] = useState([
    {
      id: 1,
      name: "Aiden Taylor",
      age: 28,
      avatar: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=150&q=80",
      photos: [
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
      ],
      distance: "2 miles away",
      matchPercentage: 95,
      premium: true,
      bio: "Software engineer by day, amateur chef by night. Love hiking and photography.",
      interests: ["Hiking", "Cooking", "Photography", "Travel"],
      isLikedBack: false,
      details: {
        about: "I'm a software engineer passionate about building products that make a difference. When I'm not coding, you'll find me hiking trails, experimenting with new recipes, or capturing moments through my camera lens. I believe in continuous learning and personal growth. Looking for someone who enjoys meaningful conversations and adventures.",
        height: "6'1\"",
        bodyType: "Athletic",
        ethnicity: "Caucasian",
        education: "Master's in Computer Science",
        occupation: "Software Engineer",
        company: "Tech Innovations Inc.",
        religion: "Agnostic",
        politicalViews: "Moderate",
        drinking: "Social drinker",
        smoking: "Non-smoker",
        relationshipGoals: "Long-term relationship",
        wantChildren: "Someday",
        havePets: "Dog lover",
        languages: ["English", "Spanish", "Python", "JavaScript"],
        interests: ["Hiking", "Cooking", "Photography", "Traveling", "Reading"],
        favoriteBooks: ["Sapiens", "Clean Code", "The Alchemist"],
        favoriteMovies: ["Inception", "The Social Network", "Interstellar"],
        favoriteMusic: ["Alternative Rock", "Jazz", "Electronic"],
        favoriteFoods: ["Italian", "Thai", "Homemade pasta"],
        exerciseHabits: "4-5 times per week",
        zodiacSign: "Leo",
        personalityType: "INTJ",
        sleepSchedule: "Night owl",
        travelFrequency: "Every few months",
        communicationStyle: "Direct and thoughtful",
        loveLanguage: "Quality Time",
        petPeeves: ["Lateness", "People who don't listen", "Poor communication"],
        dreamVacation: "Backpacking through Southeast Asia",
        weekendActivities: ["Hiking local trails", "Farmers markets", "Coding side projects", "Photography"],
        financialHabits: "Saver with occasional splurges",
        idealDate: "A hike followed by dinner at a unique local restaurant",
        childrenStatus: "No children",
        familyCloseness: "Close with immediate family",
        friendshipStyle: "Small circle of close friends",
        workLifeBalance: "Prioritize balance but ambitious",
        careerAmbitions: "Building impactful tech products",
        hobbies: ["Film photography", "Cooking international cuisine", "Rock climbing"],
        values: ["Integrity", "Growth", "Adventure", "Authenticity"],
        dietaryPreferences: "Everything in moderation",
        favoriteQuote: "The best way to predict the future is to create it.",
        morningRoutine: "Coffee, meditation, coding",
        eveningRoutine: "Reading, planning tomorrow",
        favoriteSeason: "Fall",
        idealWeather: "Crisp, sunny days with a light breeze",
        creativePursuits: ["Photography", "Cooking", "DIY tech projects"],
        dreamHome: "Modern cabin near mountains and tech hub",
        transportationPreference: "Electric car for commuting, bike for leisure",
        techSkills: ["Full-stack development", "Machine learning", "Mobile development"],
        musicInstruments: ["Guitar (beginner)"],
        favoriteGames: ["Chess", "Strategy board games", "The Witcher 3"],
        favoritePodcasts: ["How I Built This", "Syntax", "Radiolab"],
        charityInvolvement: "Volunteer coding teacher for underprivileged youth",
        growthGoals: ["Learn a new language", "Improve photography skills", "Build a sustainable side business"],
        hiddenTalents: ["Perfect pizza dough from scratch", "Identifying bird species by calls"],
        favoriteMemory: "Solo backpacking through Norway's fjords",
        stressRelievers: ["Trail running", "Cooking complex dishes", "Photography expeditions"],
        workEnvironment: "Remote with occasional office days",
        decisionMakingStyle: "Data-driven with intuition when needed"
      }
    },
    {
      id: 2,
      name: "Isabella Kim",
      age: 26,
      avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=150&q=80",
      photos: [
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80"
      ],
      distance: "5 miles away",
      matchPercentage: 87,
      premium: false,
      bio: "Art teacher who loves dancing and painting. Always looking for new adventures!",
      interests: ["Art", "Dancing", "Museums", "Coffee"],
      isLikedBack: false,
      details: {
        about: "Art is my passion and profession. I teach elementary school art and love to inspire young minds to express themselves creatively. On weekends, you'll find me at dance studios, art galleries, or cozy coffee shops sketching people. I believe life should be a canvas for experiences and connections.",
        height: "5'4\"",
        bodyType: "Petite",
        ethnicity: "Korean American",
        education: "BFA in Fine Arts, Teaching Credential",
        occupation: "Art Teacher",
        company: "Riverside Elementary School",
        religion: "Buddhist",
        politicalViews: "Progressive",
        drinking: "Occasional",
        smoking: "Never",
        relationshipGoals: "Meaningful connection",
        wantChildren: "Yes, someday",
        havePets: "Cat person",
        languages: ["English", "Korean", "Conversational French"],
        interests: ["Painting", "Dancing", "Museums", "Coffee culture", "Hiking"],
        favoriteBooks: ["The Artist's Way", "Little Fires Everywhere", "Pachinko"],
        favoriteMovies: ["Amelie", "Spirited Away", "Portrait of a Lady on Fire"],
        favoriteMusic: ["Indie Pop", "Classical", "K-pop", "Jazz"],
        favoriteFoods: ["Korean", "Mediterranean", "Desserts"],
        exerciseHabits: "Dance 3x weekly, yoga",
        zodiacSign: "Pisces",
        personalityType: "ENFP",
        sleepSchedule: "Early bird",
        travelFrequency: "School breaks and summers",
        communicationStyle: "Expressive and empathetic",
        loveLanguage: "Words of Affirmation and Physical Touch",
        petPeeves: ["Rudeness to service workers", "Closed-mindedness"],
        dreamVacation: "Art tour through Europe's museums",
        weekendActivities: ["Dance classes", "Painting outdoors", "Museum visits", "Brunch with friends"],
        financialHabits: "Budget-conscious with splurges on art supplies",
        idealDate: "Gallery opening followed by trying a new restaurant",
        childrenStatus: "No children yet",
        familyCloseness: "Very close with parents and younger sister",
        friendshipStyle: "Wide circle of diverse friends",
        workLifeBalance: "Creative in both work and personal life",
        careerAmbitions: "Open my own art education program",
        hobbies: ["Contemporary dance", "Watercolor", "Ceramics", "Urban sketching"],
        values: ["Creativity", "Compassion", "Cultural appreciation", "Growth"],
        dietaryPreferences: "Mostly plant-based",
        favoriteQuote: "Every child is an artist. The problem is how to remain an artist once we grow up.",
        morningRoutine: "Stretching, tea, journaling",
        eveningRoutine: "Reading, skincare ritual",
        favoriteSeason: "Spring",
        idealWeather: "Warm with a gentle breeze",
        creativePursuits: ["Mixed media art", "Modern dance", "Pottery"],
        dreamHome: "Bright loft with studio space",
        transportationPreference: "Public transit and walking",
        techSkills: ["Digital art", "Basic website design"],
        musicInstruments: ["Piano", "Dabbling in ukulele"],
        favoriteGames: ["Pictionary", "Creative storytelling games"],
        favoritePodcasts: ["99% Invisible", "The Moth", "Art For Your Ear"],
        charityInvolvement: "Art therapy program volunteer",
        growthGoals: ["Master oil painting", "Learn ballroom dance", "Visit every major art museum"],
        hiddenTalents: ["Can draw accurate portraits from memory", "Korean cooking"],
        favoriteMemory: "Solo trip to Kyoto during cherry blossom season",
        stressRelievers: ["Improvisational dance", "Painting abstracts", "Long walks"],
        workEnvironment: "Colorful classroom with student art everywhere",
        decisionMakingStyle: "Intuitive with consideration for others"
      }
    },
    {
      id: 3,
      name: "Ethan Johnson",
      age: 31,
      avatar: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=150&q=80",
      photos: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
      ],
      distance: "7 miles away",
      matchPercentage: 82,
      premium: true,
      bio: "Financial analyst, fitness enthusiast, and dog lover. Looking for someone to share adventures with.",
      interests: ["Fitness", "Dogs", "Finance", "Reading"],
      isLikedBack: false,
      details: {
        about: "Numbers and data tell stories that fascinate me. As a financial analyst, I help businesses make sense of their finances, but my analytical mind takes a break when I'm hitting the gym or hiking with my golden retriever, Max. I value financial literacy, physical health, and genuine connections with people and my community.",
        height: "6'0\"",
        bodyType: "Athletic",
        ethnicity: "African American",
        education: "MBA in Finance",
        occupation: "Financial Analyst",
        company: "Global Investments Partners",
        religion: "Christian",
        politicalViews: "Moderate Conservative",
        drinking: "Rarely",
        smoking: "Never",
        relationshipGoals: "Serious relationship leading to marriage",
        wantChildren: "Yes, 2-3 kids",
        havePets: "1 golden retriever named Max",
        languages: ["English", "Basic Spanish"],
        interests: ["Fitness", "Personal finance", "Dogs", "Reading", "Hiking"],
        favoriteBooks: ["Rich Dad Poor Dad", "Atomic Habits", "Principles"],
        favoriteMovies: ["The Pursuit of Happyness", "Moneyball", "John Wick"],
        favoriteMusic: ["Hip-hop", "R&B", "Jazz", "Workout playlists"],
        favoriteFoods: ["Grilled meats", "Protein-packed meals", "Soul food", "Occasional BBQ"],
        exerciseHabits: "5-6 days a week, mix of strength and cardio",
        zodiacSign: "Taurus",
        personalityType: "ESTJ",
        sleepSchedule: "Early to bed, early to rise",
        travelFrequency: "2-3 planned trips yearly",
        communicationStyle: "Clear, direct, sometimes blunt",
        loveLanguage: "Acts of Service",
        petPeeves: ["Financial irresponsibility", "Tardiness", "Lack of ambition"],
        dreamVacation: "Safari in Tanzania",
        weekendActivities: ["Long hikes with Max", "Meal prepping", "Reading financial news", "Community service"],
        financialHabits: "Strategic saver and investor",
        idealDate: "Active outdoor adventure followed by meaningful conversation",
        childrenStatus: "No children yet",
        familyCloseness: "Weekly calls with parents, mentor to younger cousins",
        friendshipStyle: "Quality over quantity, loyal to core group",
        workLifeBalance: "Structured schedule with clear boundaries",
        careerAmbitions: "Chief Financial Officer or own financial advisory firm",
        hobbies: ["Trail running", "Investing", "Dog training", "Volunteering"],
        values: ["Discipline", "Integrity", "Growth", "Community"],
        dietaryPreferences: "High protein, moderate carb",
        favoriteQuote: "It's not about timing the market, but time in the market.",
        morningRoutine: "5AM workout, protein breakfast, financial news",
        eveningRoutine: "Walk with Max, review budget, read",
        favoriteSeason: "Summer",
        idealWeather: "Warm and sunny for outdoor activities",
        creativePursuits: ["Financial modeling for personal projects"],
        dreamHome: "Modern house with home gym and large yard for Max",
        transportationPreference: "Reliable SUV",
        techSkills: ["Excel expert", "Financial modeling", "Investment apps"],
        musicInstruments: ["None currently"],
        favoriteGames: ["Fantasy football", "Chess", "Monopoly (ironically)"],
        favoritePodcasts: ["Planet Money", "The Dave Ramsey Show", "Jocko Podcast"],
        charityInvolvement: "Financial literacy teacher for underprivileged youth",
        growthGoals: ["Get CFA certification", "Run a marathon", "Build wealth to support future family"],
        hiddenTalents: ["Amazing with dogs, can train any breed", "Excellent cook of protein-rich meals"],
        favoriteMemory: "Summiting Mt. Rainier with my father",
        stressRelievers: ["Heavy lifting sessions", "Long walks with Max", "Budgeting (yes, really)"],
        workEnvironment: "Organized, minimal, data-focused",
        decisionMakingStyle: "Data-driven with clear pros/cons analysis"
      }
    },
    {
      id: 4,
      name: "Zoe Martinez",
      age: 24,
      avatar: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=150&q=80",
      photos: [
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
      ],
      distance: "10 miles away",
      matchPercentage: 78,
      premium: false,
      bio: "Tech startup founder, avid reader, and coffee addict. Let's discuss our favorite books over coffee!",
      interests: ["Startups", "Reading", "Coffee", "Technology"],
      isLikedBack: false,
      details: {
        about: "Building the future one line of code at a time. As the founder of a tech startup focused on sustainable solutions, I'm passionate about using technology to solve real-world problems. When I'm not coding or in meetings, you'll find me in a corner of a coffee shop with a book or brainstorming new ideas. Looking for someone who challenges my thinking and shares my curiosity about the world.",
        height: "5'6\"",
        bodyType: "Average",
        ethnicity: "Latina",
        education: "BS in Computer Science",
        occupation: "Tech Startup Founder",
        company: "EcoTech Solutions",
        religion: "Spiritual but not religious",
        politicalViews: "Progressive",
        drinking: "Social drinker",
        smoking: "Never",
        relationshipGoals: "Partner in crime and life",
        wantChildren: "Open but not decided",
        havePets: "Plant parent only for now",
        languages: ["English", "Spanish", "Portuguese", "JavaScript", "Python"],
        interests: ["Tech innovation", "Reading", "Specialty coffee", "Sustainability", "Minimalism"],
        favoriteBooks: ["Dune", "Bad Blood", "Sapiens", "Women Who Run With Wolves"],
        favoriteMovies: ["Ex Machina", "Arrival", "Blade Runner 2049", "Coco"],
        favoriteMusic: ["Indie electronic", "Latin alternative", "Ambient for coding"],
        favoriteFoods: ["Mexican", "Vietnamese", "Specialty coffee"],
        exerciseHabits: "Morning runs, standing desk, weekend hikes",
        zodiacSign: "Aquarius",
        personalityType: "ENTP",
        sleepSchedule: "Night owl with early meetings",
        travelFrequency: "Workations in different cities",
        communicationStyle: "Direct but empathetic",
        loveLanguage: "Intellectual connection and Quality Time",
        petPeeves: ["Close-mindedness", "Tech illiteracy", "Wasteful consumption"],
        dreamVacation: "Month-long working trip to different innovation hubs globally",
        weekendActivities: ["Hackathons", "Reading at new coffee shops", "Farmers markets", "Coding passion projects"],
        financialHabits: "Strategic investing in startups and crypto",
        idealDate: "Coffee tasting followed by a visit to a bookstore or tech event",
        childrenStatus: "No children",
        familyCloseness: "Close with family despite geographic distance",
        friendshipStyle: "Deep connections with fellow entrepreneurs",
        workLifeBalance: "Startup life means blurred lines, but trying to improve",
        careerAmbitions: "Create technology that positively impacts millions",
        hobbies: ["Coffee roasting", "Tech tinkering", "Speed reading", "Urban gardening"],
        values: ["Innovation", "Sustainability", "Knowledge", "Authenticity"],
        dietaryPreferences: "Flexitarian leaning vegetarian",
        favoriteQuote: "The best way to predict the future is to invent it.",
        morningRoutine: "Quick run, cold shower, espresso, emails",
        eveningRoutine: "Reading, planning tomorrow, occasional nightcap coding session",
        favoriteSeason: "Spring for new beginnings",
        idealWeather: "Moderate with light rain for productive coding days",
        creativePursuits: ["UX design", "Technical writing", "App development"],
        dreamHome: "Smart home with sustainable features and home office",
        transportationPreference: "Electric scooter or rideshare",
        techSkills: ["Full-stack development", "UI/UX design", "Data analysis", "Pitch deck creation"],
        musicInstruments: ["Used to play piano", "Want to learn synthesizer"],
        favoriteGames: ["Strategy board games", "Coding challenges", "Chess"],
        favoritePodcasts: ["How I Built This", "Reply All", "StartUp", "The Daily"],
        charityInvolvement: "Mentor for women in STEM programs",
        growthGoals: ["Scale startup to Series B", "Learn hardware development", "Improve public speaking"],
        hiddenTalents: ["Can identify coffee origin by taste", "Speed reading 400 wpm"],
        favoriteMemory: "The moment my first startup received funding",
        stressRelievers: ["Espresso making ritual", "Coding for fun not work", "Urban walks"],
        workEnvironment: "Creative chaos with whiteboards and multiple screens",
        decisionMakingStyle: "Data-informed but willing to take calculated risks"
      }
    }
  ]);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterMinMatch, setFilterMinMatch] = useState(0);
  const [filterDistance, setFilterDistance] = useState(20);
  const [filterPremiumOnly, setFilterPremiumOnly] = useState(false);

  const handleLikeBack = (id) => {
    setLikedProfiles(profiles => 
      profiles.map(profile => 
        profile.id === id 
          ? { ...profile, isLikedBack: true } 
          : profile
      )
    );
    
    toast({
      title: "It's a match!",
      description: "You can now start chatting with this person",
      variant: "default",
    });
  };

  const handleDislike = (id) => {
    setLikedProfiles(profiles => profiles.filter(profile => profile.id !== id));
    setSelectedProfile(null);
    
    toast({
      title: "Profile removed",
      description: "You won't see this profile again",
      variant: "destructive",
    });
  };

  const handleOpenProfile = (profile) => {
    setSelectedProfile(profile);
  };

  const handleCloseProfile = () => {
    setSelectedProfile(null);
  };

  const applyFilters = () => {
    setShowFilters(false);
    
    toast({
      title: "Filters applied",
      description: "Your preferences have been saved",
    });
  };

  const filteredProfiles = likedProfiles.filter(profile => 
    profile.matchPercentage >= filterMinMatch && 
    (!filterPremiumOnly || profile.premium)
  );

  const [showFullProfile, setShowFullProfile] = useState(false);

  const handleViewFullProfile = () => {
    setShowFullProfile(true);
  };

  const handleBackToProfile = () => {
    setShowFullProfile(false);
  };

  return (
    <div className="min-h-screen pt-8 px-4 pb-24">
      {selectedProfile ? (
        showFullProfile ? (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="icon" onClick={handleBackToProfile} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold">{selectedProfile.name}'s Complete Profile</h2>
            </div>
            
            <div className="mb-6">
              <PhotoGallery 
                photos={selectedProfile.photos} 
                name={selectedProfile.name} 
                age={selectedProfile.age} 
              />
              {selectedProfile.premium && (
                <div className="mt-2 flex justify-end">
                  <Badge className="bg-gradient-tinder text-white border-0">
                    Premium
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl font-bold">{selectedProfile.name}</h3>
              <span className="text-xl">{selectedProfile.age}</span>
              <Badge variant="outline" className="ml-2 bg-tinder-rose/5 text-tinder-rose border-tinder-rose/10">
                {selectedProfile.matchPercentage}% Match
              </Badge>
            </div>
            
            <ScrollArea className="h-[calc(100vh-300px)]">
              <ProfileDetails details={selectedProfile.details} />
            </ScrollArea>
            
            <div className="fixed bottom-24 left-0 right-0 flex items-center justify-center gap-4 bg-background/80 backdrop-blur-sm p-4 border-t">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full p-4 h-14 w-14 border-gray-300"
                onClick={() => handleDislike(selectedProfile.id)}
              >
                <X className="h-6 w-6 text-gray-500" />
              </Button>
              
              {!selectedProfile.isLikedBack ? (
                <Button 
                  size="lg" 
                  className="rounded-full p-4 h-14 w-14 bg-gradient-tinder hover:opacity-90 border-none"
                  onClick={() => handleLikeBack(selectedProfile.id)}
                >
                  <Heart className="h-6 w-6 text-white" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="rounded-full p-4 h-14 w-14 bg-primary hover:bg-primary/90"
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="icon" onClick={handleCloseProfile} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold">{selectedProfile.name}'s Profile</h2>
            </div>
            
            <div className="mb-4">
              <PhotoGallery 
                photos={selectedProfile.photos} 
                name={selectedProfile.name} 
                age={selectedProfile.age} 
              />
              {selectedProfile.premium && (
                <div className="mt-2 flex justify-end">
                  <Badge className="bg-gradient-tinder text-white border-0">
                    Premium
                  </Badge>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold">{selectedProfile.name}</h3>
                <span className="text-lg">{selectedProfile.age}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{selectedProfile.distance}</p>
              <Badge variant="outline" className="mb-4 bg-tinder-rose/5 text-tinder-rose border-tinder-rose/10">
                {selectedProfile.matchPercentage}% Match
              </Badge>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium">Bio</h4>
                  <div className="text-xs bg-gradient-to-r from-tinder-rose to-tinder-orange bg-clip-text text-transparent font-medium flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Bot size={12} className="text-tinder-orange" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-white/90 backdrop-blur-sm border border-tinder-rose/10">
                          <p className="text-xs text-muted-foreground">
                            AI automatically creates personalized bios from user profile information
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 p-3 rounded-lg border-l-4 border-tinder-rose">
                  <p className="text-muted-foreground text-sm leading-relaxed italic relative">
                    {selectedProfile.bio}
                    <span className="absolute -bottom-1 -right-1 opacity-50">
                      <Sparkles size={12} className="text-tinder-orange" />
                    </span>
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className="font-medium mb-2">Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProfile.interests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary" className="py-1">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-gradient-to-r from-tinder-rose to-tinder-orange text-white"
                onClick={handleViewFullProfile}
              >
                View Full Profile
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full p-4 h-14 w-14 border-gray-300"
                onClick={() => handleDislike(selectedProfile.id)}
              >
                <X className="h-6 w-6 text-gray-500" />
              </Button>
              
              {!selectedProfile.isLikedBack ? (
                <Button 
                  size="lg" 
                  className="rounded-full p-4 h-14 w-14 bg-gradient-tinder hover:opacity-90 border-none"
                  onClick={() => handleLikeBack(selectedProfile.id)}
                >
                  <Heart className="h-6 w-6 text-white" />
                </Button>
              ) : (
                <Button 
                  size="lg" 
                  className="rounded-full p-4 h-14 w-14 bg-primary hover:bg-primary/90"
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </Button>
              )}
            </div>
          </div>
        )
      ) : showFilters ? (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" onClick={() => setShowFilters(false)}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </Button>
            <h2 className="text-xl font-bold">Filters</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Minimum Match Percentage: {filterMinMatch}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={filterMinMatch}
                onChange={(e) => setFilterMinMatch(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Maximum Distance: {filterDistance} miles
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={filterDistance}
                onChange={(e) => setFilterDistance(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Premium Profiles Only</label>
              <input
                type="checkbox"
                checked={filterPremiumOnly}
                onChange={(e) => setFilterPremiumOnly(e.target.checked)}
                className="ml-2 h-4 w-4"
              />
            </div>
            
            <Button className="w-full mt-4 bg-gradient-tinder" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Liked You</h1>
              <Badge variant="outline" className="bg-tinder-rose/10 text-tinder-rose border-tinder-rose/20">
                {filteredProfiles.length} likes
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowFilters(true)}>
              <Filter className="h-5 w-5" />
            </Button>
          </div>

          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredProfiles.map((profile) => (
                <Card 
                  key={profile.id} 
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleOpenProfile(profile)}
                >
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                    {profile.premium && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-gradient-tinder text-white border-0">
                          Premium
                        </Badge>
                      </div>
                    )}
                    {profile.isLikedBack && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-primary text-white border-0">
                          Match
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <h3 className="font-semibold text-sm truncate">{profile.name}</h3>
                      <span className="text-sm text-muted-foreground">{profile.age}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{profile.distance}</p>
                    <Badge variant="outline" className="text-xs bg-tinder-rose/5 text-tinder-rose border-tinder-rose/10">
                      {profile.matchPercentage}% Match
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No likes yet</p>
              <p className="text-sm text-muted-foreground mt-1">When someone likes your profile, they'll appear here</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LikedMe;
