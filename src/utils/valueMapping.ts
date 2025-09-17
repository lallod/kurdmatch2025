/**
 * Value mapping utilities to convert between database values (human-readable) 
 * and UI component values (keys)
 */

// Mapping from database values (human-readable) to UI component values (keys)
export const dbToUiValueMapping: Record<string, Record<string, string>> = {
  // Exercise Habits
  exercise_habits: {
    'Daily exercise': 'daily',
    'Few times a week': 'few-times-week',
    'Weekly': 'weekly',
    'Occasionally': 'occasionally',
    'Rarely': 'rarely',
    'Sometimes': 'occasionally', // Handle existing data variation
    'Regular exercise': 'few-times-week',
    'Never': 'rarely'
  },
  
  // Dietary Preferences
  dietary_preferences: {
    'Omnivore': 'omnivore',
    'Vegetarian': 'vegetarian',
    'Vegan': 'vegan',
    'Pescatarian': 'pescatarian',
    'Keto': 'keto',
    'Halal': 'halal',
    'Other': 'other',
    'No specific diet': 'omnivore'
  },
  
  // Smoking
  smoking: {
    'Non-smoker': 'never',
    'Never': 'never',
    'Social smoker': 'socially',
    'Socially': 'socially',
    'Regular smoker': 'regularly',
    'Regularly': 'regularly',
    'Trying to quit': 'trying-to-quit',
    'Occasional smoker': 'socially'
  },
  
  // Drinking
  drinking: {
    'Non-drinker': 'never',
    'Never': 'never',
    'Social drinker': 'socially',
    'Socially': 'socially',
    'Regular drinker': 'regularly',
    'Regularly': 'regularly',
    'Occasionally': 'occasionally',
    'Light drinker': 'occasionally'
  },
  
  // Sleep Schedule
  sleep_schedule: {
    'Early bird': 'early-bird',
    'Night owl': 'night-owl',
    'Flexible': 'flexible',
    'Depends on the day': 'depends',
    'Variable': 'flexible'
  },
  
  // Pets
  have_pets: {
    'Yes, dogs': 'yes-dogs',
    'Yes, cats': 'yes-cats',
    'Yes, other pets': 'yes-other',
    'No, but I love them': 'no-but-love',
    'No, I\'m allergic': 'no-allergic',
    'No, not interested': 'no-not-interested',
    'Dog owner': 'yes-dogs',
    'Cat owner': 'yes-cats',
    'Pet lover': 'no-but-love',
    'No pets': 'no-but-love'
  },
  
  // Religion
  religion: {
    'Muslim': 'muslim',
    'Christian': 'christian',
    'Jewish': 'jewish',
    'Buddhist': 'buddhist',
    'Hindu': 'hindu',
    'Spiritual but not religious': 'spiritual',
    'Agnostic': 'agnostic',
    'Atheist': 'atheist',
    'Other': 'other',
    'Prefer not to say': 'prefer-not-say'
  },
  
  // Political Views
  political_views: {
    'Liberal': 'liberal',
    'Moderate': 'moderate',
    'Conservative': 'conservative',
    'Progressive': 'progressive',
    'Libertarian': 'libertarian',
    'Apolitical': 'apolitical',
    'Prefer not to say': 'prefer-not-say'
  },
  
  // Zodiac Sign
  zodiac_sign: {
    'Aries': 'aries',
    'Taurus': 'taurus',
    'Gemini': 'gemini',
    'Cancer': 'cancer',
    'Leo': 'leo',
    'Virgo': 'virgo',
    'Libra': 'libra',
    'Scorpio': 'scorpio',
    'Sagittarius': 'sagittarius',
    'Capricorn': 'capricorn',
    'Aquarius': 'aquarius',
    'Pisces': 'pisces'
  },
  
  // Love Language
  love_language: {
    'Words of Affirmation': 'words-of-affirmation',
    'Quality Time': 'quality-time',
    'Physical Touch': 'physical-touch',
    'Acts of Service': 'acts-of-service',
    'Receiving Gifts': 'receiving-gifts'
  },
  
  // Communication Style
  communication_style: {
    'Direct': 'direct',
    'Diplomatic': 'diplomatic',
    'Expressive': 'expressive',
    'Reserved': 'reserved',
    'Analytical': 'analytical',
    'Empathetic': 'empathetic'
  },
  
  // Children
  want_children: {
    'Want children': 'want',
    'Don\'t want children': 'dont-want',
    'Open to children': 'open',
    'Already have children': 'have',
    'Undecided': 'undecided'
  },
  
  // Work Life Balance
  work_life_balance: {
    'Work comes first': 'work-first',
    'Life comes first': 'life-first',
    'Balanced approach': 'balanced',
    'Depends on the situation': 'situational'
  }
};

// Reverse mapping from UI component values to database values
export const uiToDbValueMapping: Record<string, Record<string, string>> = {};

// Build reverse mappings
Object.keys(dbToUiValueMapping).forEach(field => {
  uiToDbValueMapping[field] = {};
  Object.entries(dbToUiValueMapping[field]).forEach(([dbValue, uiValue]) => {
    uiToDbValueMapping[field][uiValue] = dbValue;
  });
});

/**
 * Convert database profile values to UI component values
 */
export const convertDbToUiValues = (profileData: any): any => {
  const converted = { ...profileData };
  
  Object.keys(dbToUiValueMapping).forEach(field => {
    if (profileData[field] && dbToUiValueMapping[field][profileData[field]]) {
      converted[field] = dbToUiValueMapping[field][profileData[field]];
      console.log(`Converted ${field}: "${profileData[field]}" → "${converted[field]}"`);
    }
  });
  
  return converted;
};

/**
 * Convert UI component values to database values
 */
export const convertUiToDbValues = (profileData: any): any => {
  const converted = { ...profileData };
  
  Object.keys(uiToDbValueMapping).forEach(field => {
    if (profileData[field] && uiToDbValueMapping[field][profileData[field]]) {
      converted[field] = uiToDbValueMapping[field][profileData[field]];
      console.log(`Converting for save ${field}: "${profileData[field]}" → "${converted[field]}"`);
    }
  });
  
  return converted;
};

/**
 * Get UI value for a database field value
 */
export const getUiValue = (field: string, dbValue: string): string => {
  return dbToUiValueMapping[field]?.[dbValue] || dbValue;
};

/**
 * Get database value for a UI field value
 */
export const getDbValue = (field: string, uiValue: string): string => {
  return uiToDbValueMapping[field]?.[uiValue] || uiValue;
};