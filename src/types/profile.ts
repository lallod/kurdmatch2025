
// Define types for profile data
export type KurdistanRegion = 'South-Kurdistan' | 'West-Kurdistan' | 'East-Kurdistan' | 'North-Kurdistan';

export interface ProfileData {
  name: string;
  age: number;
  location: string;
  occupation: string;
  lastActive: string;
  verified: boolean;
  profileImage: string;
  distance: number;
  kurdistanRegion: KurdistanRegion;
  bio: string;
  height: string;
  bodyType: string;
  ethnicity: string;
  religion: string;
  politicalViews: string;
  values: string[];
  interests: string[];
  hobbies: string[];
  languages: string[];
}
