import { OPTIONS } from '@/components/DetailEditor/constants';
import { values, interests, hobbies, weekendActivities, techSkills, musicInstruments, favoriteGames, favoritePodcasts, favoriteBooks, favoriteMovies, favoriteMusic, favoriteFoods, growthGoals, hiddenTalents, stressRelievers } from '@/utils/profileGenerator/data/interestsAndHobbies';

// Helper to get random element from array
const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper to get random subset from array
const getRandomSubset = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Field source tracking
export interface FieldSource {
  [key: string]: 'user' | 'random' | 'initial';
}

// Enhanced profile with source tracking
export interface EnhancedProfileData {
  profileData: any;
  fieldSources: FieldSource;
}

// Single select field mappings
const singleSelectMappings = {
  religion: OPTIONS.religion,
  political_views: OPTIONS.politicalViews,
  zodiac_sign: OPTIONS.zodiacSign,
  personality_type: OPTIONS.personalityType,
  relationship_goals: OPTIONS.relationshipGoals,
  want_children: OPTIONS.wantChildren,
  exercise_habits: OPTIONS.exerciseHabits,
  sleep_schedule: OPTIONS.sleepSchedule,
  drinking: OPTIONS.drinking,
  smoking: OPTIONS.smoking,
  education: OPTIONS.education,
  communication_style: OPTIONS.communicationStyle,
  love_language: OPTIONS.loveLanguage,
  travel_frequency: OPTIONS.travelFrequency,
  dietary_preferences: OPTIONS.dietaryPreferences,
  have_pets: OPTIONS.petsOwned,
  work_life_balance: OPTIONS.workLifeBalance,
  body_type: OPTIONS.bodyType,
  ethnicity: OPTIONS.ethnicity
};

// Multi-select field mappings with target counts
const multiSelectMappings = {
  values: { options: values, count: 3 },
  interests: { options: interests, count: 3 },
  hobbies: { options: hobbies, count: 2 },
  languages: { options: OPTIONS.languages, count: 2 },
  creative_pursuits: { options: OPTIONS.creativeHobbies, count: 2 },
  weekend_activities: { options: weekendActivities, count: 2 },
  tech_skills: { options: techSkills, count: 2 },
  music_instruments: { options: musicInstruments, count: 1 },
  favorite_games: { options: favoriteGames, count: 2 },
  favorite_podcasts: { options: favoritePodcasts, count: 2 },
  favorite_books: { options: favoriteBooks, count: 2 },
  favorite_movies: { options: favoriteMovies, count: 2 },
  favorite_music: { options: favoriteMusic, count: 2 },
  favorite_foods: { options: favoriteFoods, count: 2 },
  growth_goals: { options: growthGoals, count: 2 },
  hidden_talents: { options: hiddenTalents, count: 1 },
  stress_relievers: { options: stressRelievers, count: 2 }
};

/**
 * Assigns random values to empty profile fields
 */
export const assignRandomValues = (profileData: any, existingFieldSources?: FieldSource): EnhancedProfileData => {
  const enhancedProfile = { ...profileData };
  const fieldSources: FieldSource = { ...existingFieldSources };

  // Process single select fields
  Object.entries(singleSelectMappings).forEach(([fieldName, options]) => {
    if (!enhancedProfile[fieldName] || enhancedProfile[fieldName] === '' || enhancedProfile[fieldName] === 'Not specified' || enhancedProfile[fieldName] === 'Prefer not to say') {
      enhancedProfile[fieldName] = getRandomElement(options);
      fieldSources[fieldName] = 'random';
    } else if (!fieldSources[fieldName]) {
      fieldSources[fieldName] = 'user';
    }
  });

  // Process multi-select fields
  Object.entries(multiSelectMappings).forEach(([fieldName, config]) => {
    if (!enhancedProfile[fieldName] || !Array.isArray(enhancedProfile[fieldName]) || enhancedProfile[fieldName].length === 0) {
      enhancedProfile[fieldName] = getRandomSubset(config.options, config.count);
      fieldSources[fieldName] = 'random';
    } else if (!fieldSources[fieldName]) {
      fieldSources[fieldName] = 'user';
    }
  });

  // Handle special cases for required text fields
  if (!enhancedProfile.bio || enhancedProfile.bio === 'Tell us about yourself...' || enhancedProfile.bio.trim() === '') {
    const bioPhrases = [
      "Love connecting with people who share similar values.",
      "Looking for meaningful conversations and genuine connections.",
      "Enjoy exploring new places and trying different cuisines.",
      "Value honesty and authenticity in relationships.",
      "Passionate about life and always learning something new."
    ];
    enhancedProfile.bio = getRandomElement(bioPhrases);
    fieldSources.bio = 'random';
  } else if (!fieldSources.bio) {
    fieldSources.bio = 'user';
  }

  if (!enhancedProfile.occupation || enhancedProfile.occupation === 'Not specified') {
    const occupations = [
      'Software Engineer', 'Teacher', 'Business Owner', 'Artist', 'Healthcare Worker',
      'Marketing Professional', 'Student', 'Consultant', 'Engineer', 'Designer'
    ];
    enhancedProfile.occupation = getRandomElement(occupations);
    fieldSources.occupation = 'random';
  } else if (!fieldSources.occupation) {
    fieldSources.occupation = 'user';
  }

  return {
    profileData: enhancedProfile,
    fieldSources
  };
};

/**
 * Updates a field and marks it as user-set
 */
export const updateFieldWithSource = (
  profileData: any,
  fieldSources: FieldSource,
  fieldName: string,
  value: any
): EnhancedProfileData => {
  return {
    profileData: { ...profileData, [fieldName]: value },
    fieldSources: { ...fieldSources, [fieldName]: 'user' }
  };
};

/**
 * Checks if a field has a random value assigned
 */
export const isFieldRandom = (fieldSources: FieldSource, fieldName: string): boolean => {
  return fieldSources[fieldName] === 'random';
};

/**
 * Gets a visual indicator for field source
 */
export const getFieldSourceIndicator = (fieldSources: FieldSource, fieldName: string) => {
  const source = fieldSources[fieldName];
  
  switch (source) {
    case 'random':
      return {
        badge: 'Suggested',
        className: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
        description: 'This is a suggestion. You can change it anytime.'
      };
    case 'user':
      return {
        badge: null,
        className: '',
        description: 'Your choice'
      };
    default:
      return {
        badge: null,
        className: '',
        description: ''
      };
  }
};