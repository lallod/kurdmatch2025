
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import ProfileHeader from '@/components/ProfileHeader';
import PhotoGallery from '@/components/PhotoGallery';
import ProfileDetails from '@/components/ProfileDetails';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { Heart } from 'lucide-react';

// This is a simplified version for the viewed profiles
const viewedProfiles = [
  {
    id: 1,
    name: "Noah Williams",
    age: 29,
    location: "Seattle, WA",
    occupation: "Software Developer",
    company: "Tech Innovations",
    lastActive: "10 minutes ago",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&q=80"
    ],
    details: {
      about: "Hey there! I'm Noah, a software developer with a passion for creating innovative solutions. When I'm not coding, you can find me hiking in the mountains or experimenting with new coffee brewing techniques. I believe in continuous learning and growth, both professionally and personally.",
      height: "6'1\"",
      bodyType: "Athletic",
      ethnicity: "Mixed",
      education: "Master's in Computer Science, University of Washington",
      occupation: "Software Developer",
      company: "Tech Innovations",
      religion: "Agnostic",
      politicalViews: "Moderate",
      drinking: "Social drinker",
      smoking: "Never",
      relationshipGoals: "Long-term relationship",
      wantChildren: "Open to children",
      havePets: "Dog lover",
      languages: ["English (Native)", "Spanish (Intermediate)"],
      interests: ["Hiking", "Coffee", "Technology", "Photography", "Travel"],
      favoriteBooks: ["The Pragmatic Programmer", "Sapiens", "The Alchemist"],
      favoriteMovies: ["Inception", "The Social Network", "Interstellar"],
      favoriteMusic: ["Alternative Rock", "Jazz", "Electronic"],
      favoriteFoods: ["Italian", "Japanese", "Mexican"],
      exerciseHabits: "4-5 times per week",
      zodiacSign: "Aries",
      personalityType: "INTJ",
      sleepSchedule: "Early bird",
      travelFrequency: "Every few months",
      communicationStyle: "Direct and thoughtful",
      loveLanguage: "Quality Time, Acts of Service",
      petPeeves: ["Rudeness", "Lateness", "Dishonesty"],
      dreamVacation: "Backpacking through Southeast Asia",
      weekendActivities: ["Hiking", "Photography", "Trying new restaurants"],
      financialHabits: "Saver with occasional splurges",
      idealDate: "A scenic hike followed by dinner at a local restaurant",
      childrenStatus: "No children",
      familyCloseness: "Close with family",
      friendshipStyle: "Small circle of close friends",
      workLifeBalance: "Prioritizes balanced lifestyle",
      careerAmbitions: "Building innovative software solutions",
      hobbies: ["Photography", "Hiking", "Coffee brewing", "Coding side projects"],
      values: ["Honesty", "Growth", "Adventure", "Kindness"],
      dietaryPreferences: "No restrictions, enjoys trying new foods",
      favoriteQuote: "The best way to predict the future is to invent it.",
      morningRoutine: "Early workout, coffee, code",
      eveningRoutine: "Reading, planning for tomorrow",
      favoriteSeason: "Fall",
      idealWeather: "Crisp autumn day",
      creativePursuits: ["Photography", "Open source coding"],
      dreamHome: "Mountain cabin with modern tech",
      transportationPreference: "Hybrid car, walking when possible",
      techSkills: ["Full-stack development", "Machine learning", "Cloud architecture"],
      musicInstruments: ["Guitar (beginner)"],
      favoriteGames: ["Chess", "Strategy games", "Indie video games"],
      favoritePodcasts: ["Tech podcasts", "Science shows", "Storytelling"],
      charityInvolvement: "Teaching coding to kids",
      growthGoals: ["Learn new programming languages", "Improve photography skills"],
      hiddenTalents: ["Makes excellent coffee", "Can solve Rubik's cube"],
      favoriteMemory: "Solo hiking trip through the Pacific Northwest",
      stressRelievers: ["Exercise", "Nature walks", "Meditation"],
      workEnvironment: "Flexible remote with occasional office days",
      decisionMakingStyle: "Data-driven with intuition"
    }
  },
  {
    id: 2,
    name: "Mia Garcia",
    age: 27,
    location: "Los Angeles, CA",
    occupation: "Graphic Designer",
    company: "Creative Studio",
    lastActive: "2 hours ago",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80"
    ],
    details: {
      about: "Hi, I'm Mia! I'm a creative soul with a passion for design and art. When I'm not working on designs, I love exploring art galleries, trying new restaurants, and weekend hikes in the canyons. I'm looking for someone who appreciates creativity and brings their own passion to the table.",
      height: "5'6\"",
      bodyType: "Average",
      ethnicity: "Hispanic",
      education: "BFA in Graphic Design, UCLA",
      occupation: "Graphic Designer",
      company: "Creative Studio",
      religion: "Spiritual but not religious",
      politicalViews: "Liberal",
      drinking: "Social drinker",
      smoking: "Never",
      relationshipGoals: "Looking for something serious",
      wantChildren: "Someday",
      havePets: "Cat owner",
      languages: ["English (Native)", "Spanish (Fluent)"],
      interests: ["Art", "Design", "Hiking", "Food exploration", "Photography"],
      favoriteBooks: ["The Secret Lives of Color", "Just Kids", "Big Magic"],
      favoriteMovies: ["La La Land", "Amelie", "The Grand Budapest Hotel"],
      favoriteMusic: ["Indie Pop", "Alternative", "Latin"],
      favoriteFoods: ["Mexican", "Thai", "Italian", "Sushi"],
      exerciseHabits: "Yoga and hiking regularly",
      zodiacSign: "Libra",
      personalityType: "ENFP",
      sleepSchedule: "Night owl",
      travelFrequency: "A few times per year",
      communicationStyle: "Expressive and empathetic",
      loveLanguage: "Words of Affirmation, Quality Time",
      petPeeves: ["Closed-mindedness", "Bad tippers", "People who don't recycle"],
      dreamVacation: "Art tour through Europe",
      weekendActivities: ["Gallery visits", "Brunch with friends", "Beach days"],
      financialHabits: "Budget-conscious but enjoys experiences",
      idealDate: "Art gallery followed by dinner at a hidden gem restaurant",
      childrenStatus: "No children",
      familyCloseness: "Very close with family",
      friendshipStyle: "Diverse friend group",
      workLifeBalance: "Creative work blends with personal interests",
      careerAmbitions: "Start own design studio",
      hobbies: ["Painting", "Ceramics", "Photography", "Cooking"],
      values: ["Creativity", "Authenticity", "Compassion", "Growth"],
      dietaryPreferences: "Mostly vegetarian",
      favoriteQuote: "Art enables us to find ourselves and lose ourselves at the same time.",
      morningRoutine: "Coffee and sketch session",
      eveningRoutine: "Creative work and relaxing with a book",
      favoriteSeason: "Spring",
      idealWeather: "Sunny with a light breeze",
      creativePursuits: ["Painting", "Ceramics", "Digital art"],
      dreamHome: "Loft with studio space and lots of natural light",
      transportationPreference: "Public transit and walking",
      techSkills: ["Adobe Creative Suite", "UI/UX design basics"],
      musicInstruments: ["Ukulele (beginner)"],
      favoriteGames: ["Pictionary", "Creative storytelling games"],
      favoritePodcasts: ["Design Matters", "Creative pep talks"],
      charityInvolvement: "Art programs for underprivileged youth",
      growthGoals: ["Learn animation", "Improve digital illustration skills"],
      hiddenTalents: ["Can remember color codes by heart", "Great at mimicking accents"],
      favoriteMemory: "Backpacking through Spain's art museums",
      stressRelievers: ["Painting", "Beach walks", "Cooking"],
      workEnvironment: "Creative, collaborative spaces with inspiration boards",
      decisionMakingStyle: "Intuitive with consideration for others"
    }
  },
  {
    id: 3,
    name: "Liam Wilson",
    age: 32,
    location: "Chicago, IL",
    occupation: "Architect",
    company: "Urban Design Group",
    lastActive: "Yesterday",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1567784177951-6fa58317e16b?auto=format&fit=crop&w=500&q=80"
    ],
    details: {
      about: "Hello! I'm Liam, an architect with a passion for sustainable urban design. I find beauty in the balance between form and function. Outside of work, I enjoy exploring the city's architectural gems, playing jazz piano, and staying active with rock climbing. Looking for someone who appreciates thoughtful design and meaningful conversations.",
      height: "6'0\"",
      bodyType: "Athletic",
      ethnicity: "Caucasian",
      education: "Master's in Architecture, University of Chicago",
      occupation: "Architect",
      company: "Urban Design Group",
      religion: "Agnostic",
      politicalViews: "Progressive",
      drinking: "Occasional",
      smoking: "Never",
      relationshipGoals: "Serious relationship",
      wantChildren: "Yes, someday",
      havePets: "None currently",
      languages: ["English (Native)", "French (Intermediate)"],
      interests: ["Architecture", "Sustainability", "Jazz", "Rock climbing", "Urban exploration"],
      favoriteBooks: ["The Death and Life of Great American Cities", "Thinking, Fast and Slow", "The Fountainhead"],
      favoriteMovies: ["Blade Runner 2049", "The Grand Budapest Hotel", "Lost in Translation"],
      favoriteMusic: ["Jazz", "Classical", "Alternative Rock"],
      favoriteFoods: ["Mediterranean", "Japanese", "French"],
      exerciseHabits: "Rock climbing, cycling, and yoga",
      zodiacSign: "Virgo",
      personalityType: "INFJ",
      sleepSchedule: "Early bird",
      travelFrequency: "A few times per year",
      communicationStyle: "Thoughtful and measured",
      loveLanguage: "Acts of Service, Quality Time",
      petPeeves: ["Wasteful consumption", "Poor design", "Lack of punctuality"],
      dreamVacation: "Architectural tour of Japan",
      weekendActivities: ["Visiting architectural sites", "Rock climbing", "Farmers markets"],
      financialHabits: "Balanced saver and investor",
      idealDate: "Museum visit followed by jazz club",
      childrenStatus: "No children",
      familyCloseness: "Close with immediate family",
      friendshipStyle: "Quality over quantity",
      workLifeBalance: "Structured but flexible",
      careerAmbitions: "Leading sustainable design projects",
      hobbies: ["Piano playing", "Sketching", "Photography", "Model building"],
      values: ["Sustainability", "Integrity", "Creativity", "Growth"],
      dietaryPreferences: "Health-conscious omnivore",
      favoriteQuote: "Architecture is the learned game, correct and magnificent, of forms assembled in the light.",
      morningRoutine: "Early run, breakfast, sketching",
      eveningRoutine: "Reading, piano practice",
      favoriteSeason: "Fall",
      idealWeather: "Clear, crisp autumn day",
      creativePursuits: ["Architectural sketching", "Piano composition"],
      dreamHome: "Self-designed eco-friendly urban loft",
      transportationPreference: "Bicycle and public transit",
      techSkills: ["CAD software", "3D modeling", "Sustainable design practices"],
      musicInstruments: ["Piano (advanced)", "Guitar (beginner)"],
      favoriteGames: ["Chess", "Strategic board games"],
      favoritePodcasts: ["99% Invisible", "The Urbanist"],
      charityInvolvement: "Affordable housing initiatives",
      growthGoals: ["Master sustainable design techniques", "Learn more languages"],
      hiddenTalents: ["Perfect pitch", "Can sketch buildings from memory"],
      favoriteMemory: "Sunrise at Fallingwater",
      stressRelievers: ["Piano playing", "Urban walks", "Sketching"],
      workEnvironment: "Collaborative studio with models and blueprints",
      decisionMakingStyle: "Analytical with creative problem-solving"
    }
  },
  {
    id: 4,
    name: "Sophia Brown",
    age: 25,
    location: "New York, NY",
    occupation: "Marketing Strategist",
    company: "Global Brands",
    lastActive: "2 days ago",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?auto=format&fit=crop&w=500&q=80"
    ],
    details: {
      about: "Hey there, I'm Sophia! NYC-based marketing strategist with a love for storytelling and brand building. When I'm not working, I'm exploring the city's endless restaurants, catching Broadway shows, or jogging in Central Park. Looking for someone who enjoys urban adventures and cozy nights in equally.",
      height: "5'5\"",
      bodyType: "Athletic",
      ethnicity: "African American",
      education: "BS in Marketing, NYU",
      occupation: "Marketing Strategist",
      company: "Global Brands",
      religion: "Non-religious",
      politicalViews: "Liberal",
      drinking: "Social drinker",
      smoking: "Never",
      relationshipGoals: "Long-term relationship",
      wantChildren: "Maybe someday",
      havePets: "None currently",
      languages: ["English (Native)", "French (Basic)"],
      interests: ["Food exploration", "Theater", "Fitness", "Travel", "Reading"],
      favoriteBooks: ["Bad Blood", "Becoming", "The Defining Decade"],
      favoriteMovies: ["The Devil Wears Prada", "Black Panther", "The Social Network"],
      favoriteMusic: ["R&B", "Pop", "Hip Hop", "Broadway soundtracks"],
      favoriteFoods: ["Italian", "Thai", "Ethiopian", "New American"],
      exerciseHabits: "Daily runner, weekly yoga",
      zodiacSign: "Gemini",
      personalityType: "ENTJ",
      sleepSchedule: "Early bird",
      travelFrequency: "Several times per year",
      communicationStyle: "Direct and energetic",
      loveLanguage: "Words of Affirmation, Physical Touch",
      petPeeves: ["Poor communication", "Flakiness", "Closed-mindedness"],
      dreamVacation: "Safari in Tanzania",
      weekendActivities: ["Trying new restaurants", "Museum visits", "Broadway shows", "Central Park runs"],
      financialHabits: "Smart spender, active investor",
      idealDate: "Broadway show followed by dinner discussion",
      childrenStatus: "No children",
      familyCloseness: "Very close with family",
      friendshipStyle: "Wide network, close inner circle",
      workLifeBalance: "Ambitious but values personal time",
      careerAmbitions: "CMO position at a mission-driven company",
      hobbies: ["Cooking classes", "Travel planning", "Book club"],
      values: ["Ambition", "Honesty", "Cultural appreciation", "Growth"],
      dietaryPreferences: "Flexitarian, loves trying new cuisines",
      favoriteQuote: "The most difficult thing is the decision to act, the rest is merely tenacity.",
      morningRoutine: "5AM run, podcasts during commute",
      eveningRoutine: "Wind down with a book, planning for tomorrow",
      favoriteSeason: "Spring",
      idealWeather: "Sunny spring day in the city",
      creativePursuits: ["Food photography", "Marketing case studies"],
      dreamHome: "Modern NYC apartment with skyline view",
      transportationPreference: "Public transit and walking",
      techSkills: ["Digital marketing", "Social media strategy", "Analytics"],
      musicInstruments: ["None currently, but wants to learn piano"],
      favoriteGames: ["Strategy games", "Trivia nights"],
      favoritePodcasts: ["How I Built This", "Marketing Over Coffee"],
      charityInvolvement: "Mentoring young professionals from underrepresented backgrounds",
      growthGoals: ["Public speaking mastery", "Learn another language"],
      hiddenTalents: ["Amazing memory for details", "Expert organizer"],
      favoriteMemory: "Solo backpacking through Europe after college",
      stressRelievers: ["Running", "Journaling", "Cooking"],
      workEnvironment: "Fast-paced, collaborative, results-oriented",
      decisionMakingStyle: "Strategic, data-driven, decisive"
    }
  },
  {
    id: 5,
    name: "Lucas Davis",
    age: 30,
    location: "Austin, TX",
    occupation: "Music Producer",
    company: "Soundwave Studios",
    lastActive: "3 days ago",
    verified: true,
    profileImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&q=80",
    photos: [
      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1549068106-b024baf5062d?auto=format&fit=crop&w=500&q=80"
    ],
    details: {
      about: "What's up? I'm Lucas, a music producer living for the creative process. When I'm not in the studio, I'm checking out live music, kayaking on Lady Bird Lake, or hunting down the best tacos in Austin. Looking for someone who has their own passions and appreciates authentic connection. Bonus points if you love music as much as I do!",
      height: "5'10\"",
      bodyType: "Average",
      ethnicity: "Mixed",
      education: "Bachelor's in Music Production, Berklee College of Music",
      occupation: "Music Producer",
      company: "Soundwave Studios",
      religion: "Spiritual but not religious",
      politicalViews: "Moderate",
      drinking: "Social drinker",
      smoking: "Occasionally",
      relationshipGoals: "Open to possibilities",
      wantChildren: "Not sure yet",
      havePets: "Dog owner (rescue mix named Jazz)",
      languages: ["English (Native)", "Portuguese (Conversational)"],
      interests: ["Music production", "Live concerts", "Kayaking", "Culinary exploration", "Vintage instrument collecting"],
      favoriteBooks: ["Just Kids", "High Fidelity", "Sound Man"],
      favoriteMovies: ["Almost Famous", "Whiplash", "Dazed and Confused"],
      favoriteMusic: ["Too many genres to list - appreciates authenticity in all forms"],
      favoriteFoods: ["Tex-Mex", "Ramen", "BBQ", "Food trucks of all kinds"],
      exerciseHabits: "Kayaking, hiking, moderate gym",
      zodiacSign: "Leo",
      personalityType: "ENFP",
      sleepSchedule: "Night owl (studio hours)",
      travelFrequency: "For music festivals and inspiration trips",
      communicationStyle: "Authentic and direct",
      loveLanguage: "Quality Time, Physical Touch",
      petPeeves: ["Pretentiousness", "Music snobs", "People who are rude to service workers"],
      dreamVacation: "Studio time in different musical capitals around the world",
      weekendActivities: ["Live music shows", "Studio sessions", "Lake activities", "Taco quests"],
      financialHabits: "Invests in equipment, experiences over things",
      idealDate: "Live music followed by late-night food trucks and genuine conversation",
      childrenStatus: "No children",
      familyCloseness: "Close despite geographical distance",
      friendshipStyle: "Tight-knit creative community",
      workLifeBalance: "Blurred lines - passion is work is life",
      careerAmbitions: "Produce for innovative artists, score films",
      hobbies: ["Vintage gear collecting", "Kayaking", "Cooking", "Home studio building"],
      values: ["Authenticity", "Creativity", "Connection", "Growth"],
      dietaryPreferences: "Adventurous eater",
      favoriteQuote: "Music is what feelings sound like.",
      morningRoutine: "Late riser, coffee while listening to new music",
      eveningRoutine: "Studio sessions, often until early morning",
      favoriteSeason: "Spring festival season",
      idealWeather: "Warm enough for outdoor shows",
      creativePursuits: ["Music production", "Instrument modification", "Sound design"],
      dreamHome: "Ranch house with professional studio space",
      transportationPreference: "Vintage motorcycle, pickup truck",
      techSkills: ["Pro Tools expert", "Analog equipment specialist", "Audio engineering"],
      musicInstruments: ["Guitar (advanced)", "Bass (advanced)", "Piano (intermediate)", "Drums (basic)"],
      favoriteGames: ["Music trivia", "Vintage arcade games"],
      favoritePodcasts: ["Song Exploder", "Broken Record", "Gear Club"],
      charityInvolvement: "Youth music education programs",
      growthGoals: ["Film scoring", "Learn more instruments", "Open a recording school"],
      hiddenTalents: ["Perfect pitch", "Can identify most guitars by sound alone"],
      favoriteMemory: "First time hearing own production on the radio",
      stressRelievers: ["Jamming", "Lake kayaking", "Cooking with music"],
      workEnvironment: "Creative studio space with vintage and modern equipment",
      decisionMakingStyle: "Intuitive with technical expertise"
    }
  }
];

const ProfilePage = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = React.useState(true);

  // Convert id to number
  const profileId = id ? parseInt(id) : 0;
  
  // Find the profile with the matching id
  const profileData = viewedProfiles.find(profile => profile.id === profileId);

  React.useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // If no profile is found, navigate back to the viewedMe page
  if (!profileData && !isLoading) {
    return <Navigate to="/viewed-me" />;
  }

  if (isLoading || !profileData) {
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

export default ProfilePage;
