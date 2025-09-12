
// Define types for profile data
export type KurdistanRegion = 'South-Kurdistan' | 'West-Kurdistan' | 'East-Kurdistan' | 'North-Kurdistan';

export interface ProfileData {
  name: string;
  age: number;
  location: string;
  occupation: string; // Required
  lastActive: string;
  verified: boolean;
  profileImage: string; // Required
  distance: number;
  kurdistanRegion: KurdistanRegion; // Required
  bio: string; // Required (min 20 chars)
  height: string; // Required
  bodyType: string; // Required
  ethnicity: string; // Required
  religion: string; // Required
  politicalViews: string;
  values: string[]; // Required (min 3)
  interests: string[]; // Required (min 3)
  hobbies: string[]; // Required (min 2)
  languages: string[]; // Required (min 1)
  education: string; // Required
  company?: string;
  relationshipGoals: string; // Required
  wantChildren: string; // Required
  havePets?: string;
  exerciseHabits: string; // Required
  zodiacSign?: string;
  personalityType?: string;
  sleepSchedule?: string;
  travelFrequency?: string;
  communicationStyle?: string;
  loveLanguage?: string;
  petPeeves?: string[] | string;
  dreamVacation?: string;
  weekendActivities?: string[] | string;
  financialHabits?: string;
  idealDate?: string;
  childrenStatus?: string;
  familyCloseness?: string;
  friendshipStyle?: string;
  workLifeBalance?: string;
  careerAmbitions?: string;
  dietaryPreferences?: string;
  favoriteQuote?: string;
  morningRoutine?: string;
  eveningRoutine?: string;
  favoriteSeason?: string;
  idealWeather?: string;
  creativePursuits?: string[] | string;
  dreamHome?: string;
  transportationPreference?: string;
  techSkills?: string[] | string;
  musicInstruments?: string[] | string;
  favoriteGames?: string[] | string;
  favoritePodcasts?: string[] | string;
  favoriteBooks?: string[] | string;
  favoriteMovies?: string[] | string;
  favoriteMusic?: string[] | string;
  favoriteFoods?: string[] | string;
  charityInvolvement?: string;
  growthGoals?: string[] | string;
  hiddenTalents?: string[] | string;
  favoriteMemory?: string;
  stressRelievers?: string[] | string;
  workEnvironment?: string;
  decisionMakingStyle?: string;
  smoking?: string;
  drinking?: string;
}
