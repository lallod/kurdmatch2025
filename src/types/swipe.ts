
export interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  avatar: string;
  distance: number;
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
  
  // Extended comprehensive profile fields
  // Basic Info
  ethnicity?: string;
  
  // Lifestyle
  exerciseHabits?: string;
  havePets?: string;
  drinking?: string;
  smoking?: string;
  sleepSchedule?: string;
  travelFrequency?: string;
  transportationPreference?: string;
  
  // Values & Beliefs
  values?: string[];
  zodiacSign?: string;
  personalityType?: string;
  politicalViews?: string;
  
  // Relationships
  wantChildren?: string;
  childrenStatus?: string;
  familyCloseness?: string;
  loveLanguage?: string[];
  
  // Career
  education?: string;
  company?: string;
  careerAmbitions?: string;
  workEnvironment?: string;
  workLifeBalance?: string;
  
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
  
  // Personal Details
  dreamVacation?: string;
  idealDate?: string;
  communicationStyle?: string;
  
  // Personal Growth & Habits
  growthGoals?: string[];
  morningRoutine?: string;
  eveningRoutine?: string;
  financialHabits?: string;
  stressRelievers?: string[];
  
  // Social & Personality
  friendshipStyle?: string;
  decisionMakingStyle?: string;
  charityInvolvement?: string;
  
  // Preferences
  favoriteMemory?: string;
  favoriteQuote?: string;
  favoriteSeason?: string;
  idealWeather?: string;
  dreamHome?: string;
  
  // Special Traits
  hiddenTalents?: string[];
  petPeeves?: string[];
}

export type SwipeAction = 'pass' | 'like' | 'superlike';

export interface LastAction {
  type: string;
  profileId: number;
}

export interface SwipeGestureState {
  isDragging: boolean;
  dragOffset: { x: number; y: number };
  rotation: number;
  scale: number;
}
