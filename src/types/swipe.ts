
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
