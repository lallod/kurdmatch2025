
export interface Profile {
  id: string;
  name: string;
  age: number;
  location: string;
  avatar: string;
  distance: number;
  distance_km?: number; // GPS-based distance in kilometers (from nearby_users RPC)
  compatibilityScore: number;
  kurdistanRegion?: string;
  area: string;
  interests?: string[];
  occupation?: string;
  religion?: string;
  bodyType?: string;
  languages?: string[];
  dietaryPreferences?: string;
  height?: string;
  photos?: string[];
  bio?: string;
  relationshipGoals?: string;
  verified?: boolean;
  
  // Personal Information
  gender?: string;
  ethnicity?: string;
  
  // Career & Education
  education?: string;
  company?: string;
  careerAmbitions?: string;
  workEnvironment?: string;
  workLifeBalance?: string;
  
  // Lifestyle
  exerciseHabits?: string;
  drinking?: string;
  smoking?: string;
  havePets?: string;
  sleepSchedule?: string;
  transportationPreference?: string;
  travelFrequency?: string;
  
  // Beliefs & Values
  politicalViews?: string;
  values?: string[];
  zodiacSign?: string;
  personalityType?: string;
  
  // Relationships & Family
  wantChildren?: string;
  childrenStatus?: string;
  familyCloseness?: string;
  loveLanguage?: string;
  communicationStyle?: string;
  
  // Interests & Hobbies
  hobbies?: string[];
  creativePursuits?: string[];
  weekendActivities?: string[];
  musicInstruments?: string[];
  techSkills?: string[];
  
  // Favorites
  favoriteBooks?: string[];
  favoriteMovies?: string[];
  favoriteMusic?: string[];
  favoriteFoods?: string[];
  favoriteGames?: string[];
  favoritePodcasts?: string[];
  favoriteQuote?: string;
  favoriteMemory?: string;
  favoriteSeason?: string;
  
  // Personal Growth & Habits
  growthGoals?: string[];
  morningRoutine?: string;
  eveningRoutine?: string;
  stressRelievers?: string[];
  financialHabits?: string;
  
  // Social & Personal Style
  friendshipStyle?: string;
  decisionMakingStyle?: string;
  charityInvolvement?: string;
  
  // Special Traits & Preferences
  hiddenTalents?: string[];
  petPeeves?: string[];
  dreamVacation?: string;
  idealDate?: string;
  dreamHome?: string;
  idealWeather?: string;
}

export type SwipeAction = 'pass' | 'like' | 'superlike';

export interface LastAction {
  type: string;
  profileId: string;
}
