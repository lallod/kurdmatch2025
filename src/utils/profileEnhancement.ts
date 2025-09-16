import { OPTIONS } from '@/components/DetailEditor/constants';
import { values, interests, hobbies, weekendActivities, techSkills, musicInstruments, favoriteGames, favoritePodcasts, favoriteBooks, favoriteMovies, favoriteMusic, favoriteFoods, growthGoals, hiddenTalents, stressRelievers } from '@/utils/profileGenerator/data/interestsAndHobbies';
import { convertDbToUiProfile, dbToUiFieldMapping } from '@/utils/fieldNameMapping';

/**
 * Helper to get UI field name from database field name
 */
const getUiFieldName = (dbFieldName: string): string => {
  return dbToUiFieldMapping[dbFieldName] || dbFieldName;
};

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

// Single select field mappings - using database field names (snake_case)
const singleSelectMappings = {
  // Values & Personality
  religion: OPTIONS.religion,
  political_views: OPTIONS.politicalViews,
  zodiac_sign: OPTIONS.zodiacSign,
  personality_type: OPTIONS.personalityType,
  
  // Lifestyle & Habits  
  exercise_habits: OPTIONS.exerciseHabits,
  dietary_preferences: OPTIONS.dietaryPreferences,
  smoking: OPTIONS.smoking,
  drinking: OPTIONS.drinking,
  sleep_schedule: OPTIONS.sleepSchedule,
  have_pets: OPTIONS.petsOwned,
  travel_frequency: OPTIONS.travelFrequency,
  work_life_balance: OPTIONS.workLifeBalance,
  
  // Relationship & Family
  relationship_goals: OPTIONS.relationshipGoals,
  want_children: OPTIONS.wantChildren,
  children_status: OPTIONS.childrenStatus,
  family_closeness: OPTIONS.familyCloseness,
  communication_style: OPTIONS.communicationStyle,
  love_language: OPTIONS.loveLanguage,
  
  // Basic Info
  body_type: OPTIONS.bodyType,
  ethnicity: OPTIONS.ethnicity,
  education: OPTIONS.education,
  
  // Additional
  financial_habits: OPTIONS.financialHabits,
  favorite_season: OPTIONS.favoriteSeason
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
  // Work with database field names first
  const enhancedProfile = { ...profileData };
  const fieldSources: FieldSource = { ...existingFieldSources };

  // Process single select fields using database field names
  Object.entries(singleSelectMappings).forEach(([fieldName, options]) => {
    // Check for various empty states
    const isEmpty = !enhancedProfile[fieldName] || 
                   enhancedProfile[fieldName] === '' || 
                   enhancedProfile[fieldName] === 'Not specified' || 
                   enhancedProfile[fieldName] === 'Prefer not to say' ||
                   enhancedProfile[fieldName] === null ||
                   enhancedProfile[fieldName] === undefined;
                   
    if (isEmpty) {
      enhancedProfile[fieldName] = getRandomElement(options);
      fieldSources[fieldName] = 'random';
    } else if (!fieldSources[fieldName]) {
      fieldSources[fieldName] = 'user';
    }
  });

  // Process multi-select fields using database field names
  Object.entries(multiSelectMappings).forEach(([fieldName, config]) => {
    // Check for various empty states for arrays
    const isEmpty = !enhancedProfile[fieldName] || 
                   !Array.isArray(enhancedProfile[fieldName]) || 
                   enhancedProfile[fieldName].length === 0 ||
                   enhancedProfile[fieldName] === null ||
                   enhancedProfile[fieldName] === undefined;
                   
    if (isEmpty) {
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

  // Handle text field suggestions
  if (!enhancedProfile.ideal_date || enhancedProfile.ideal_date.trim() === '') {
    const idealDates = [
      'A cozy dinner followed by a walk under the stars',
      'Coffee shop conversation and exploring local art galleries',
      'Hiking adventure followed by a picnic',
      'Cooking together and watching a good movie',
      'Cultural event or museum visit with meaningful conversation'
    ];
    enhancedProfile.ideal_date = getRandomElement(idealDates);
    fieldSources.ideal_date = 'random';
  } else if (!fieldSources.ideal_date) {
    fieldSources.ideal_date = 'user';
  }

  if (!enhancedProfile.career_ambitions || enhancedProfile.career_ambitions.trim() === '') {
    const careerGoals = [
      'Growing in my field while making a positive impact',
      'Building a career that balances success with personal fulfillment',
      'Leading innovative projects that make a difference',
      'Developing expertise while mentoring others',
      'Creating work that contributes meaningfully to society'
    ];
    enhancedProfile.career_ambitions = getRandomElement(careerGoals);
    fieldSources.career_ambitions = 'random';
  } else if (!fieldSources.career_ambitions) {
    fieldSources.career_ambitions = 'user';
  }

  if (!enhancedProfile.morning_routine || enhancedProfile.morning_routine.trim() === '') {
    const morningRoutines = [
      'Early coffee, light exercise, and planning my day',
      'Meditation, healthy breakfast, and reading',
      'Quick workout followed by energizing music',
      'Journaling, stretching, and a nutritious start',
      'Peaceful moments with tea and reflection'
    ];
    enhancedProfile.morning_routine = getRandomElement(morningRoutines);
    fieldSources.morning_routine = 'random';
  } else if (!fieldSources.morning_routine) {
    fieldSources.morning_routine = 'user';
  }

  if (!enhancedProfile.evening_routine || enhancedProfile.evening_routine.trim() === '') {
    const eveningRoutines = [
      'Unwinding with a book and herbal tea',
      'Reflecting on the day and preparing for tomorrow',
      'Quality time with loved ones and relaxation',
      'Light exercise or yoga to decompress',
      'Creative activities and peaceful moments'
    ];
    enhancedProfile.evening_routine = getRandomElement(eveningRoutines);
    fieldSources.evening_routine = 'random';
  } else if (!fieldSources.evening_routine) {
    fieldSources.evening_routine = 'user';
  }

  if (!enhancedProfile.favorite_quote || enhancedProfile.favorite_quote.trim() === '') {
    const quotes = [
      'Be yourself; everyone else is already taken.',
      'Life is what happens when you\'re busy making other plans.',
      'The journey of a thousand miles begins with one step.',
      'In the middle of difficulty lies opportunity.',
      'Happiness is not by chance, but by choice.'
    ];
    enhancedProfile.favorite_quote = getRandomElement(quotes);
    fieldSources.favorite_quote = 'random';
  } else if (!fieldSources.favorite_quote) {
    fieldSources.favorite_quote = 'user';
  }

  // Convert to UI format with both database and UI field names
  const uiProfile = convertDbToUiProfile(enhancedProfile);
  
  // Also create field sources for UI field names
  const uiFieldSources = { ...fieldSources };
  Object.entries(singleSelectMappings).forEach(([dbField]) => {
    if (fieldSources[dbField]) {
      // Map database field source to UI field name for components
      const uiField = getUiFieldName(dbField);
      if (uiField !== dbField) {
        uiFieldSources[uiField] = fieldSources[dbField];
      }
    }
  });
  
  Object.entries(multiSelectMappings).forEach(([dbField]) => {
    if (fieldSources[dbField]) {
      // Map database field source to UI field name for components
      const uiField = getUiFieldName(dbField);
      if (uiField !== dbField) {
        uiFieldSources[uiField] = fieldSources[dbField];
      }
    }
  });

  console.log('Enhanced profile with field sources:', {
    profileKeys: Object.keys(uiProfile),
    fieldSourceKeys: Object.keys(uiFieldSources),
    sampleData: {
      exerciseHabits: uiProfile.exerciseHabits,
      exercise_habits: uiProfile.exercise_habits,
      exerciseHabitsSource: uiFieldSources.exerciseHabits,
      exercise_habitsSource: uiFieldSources.exercise_habits
    }
  });

  return {
    profileData: uiProfile,
    fieldSources: uiFieldSources
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