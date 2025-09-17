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
    'Sometimes': 'occasionally',
    'Regular exercise': 'few-times-week',
    'Never': 'rarely',
    'Occasional exercise': 'occasionally',
    'Daily fitness routine': 'daily',
    'Sports enthusiast': 'daily'
  },
  
  // Dietary Preferences  
  dietary_preferences: {
    'No restrictions': 'omnivore',
    'Omnivore': 'omnivore',
    'Vegetarian': 'vegetarian',
    'Vegan': 'vegan',
    'Pescatarian': 'pescatarian',
    'Keto': 'keto',
    'Paleo': 'paleo',
    'Gluten-free': 'gluten-free',
    'Halal': 'halal',
    'Other': 'other'
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
    'Light drinker': 'occasionally',
    'Former drinker': 'never'
  },
  
  // Sleep Schedule
  sleep_schedule: {
    'Early bird': 'early-bird',
    'Night owl': 'night-owl',
    'Flexible': 'flexible',
    'Depends on the day': 'depends',
    'Variable': 'flexible',
    'Balanced sleeper': 'flexible',
    'Inconsistent schedule': 'depends'
  },
  
// Add missing pets mapping values  
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
    'No pets': 'no-but-love',
    'Love pets but don\'t have any': 'no-but-love',
    'Allergic to pets': 'no-allergic',
    'Have pets': 'yes-other'
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
    'Prefer not to say': 'prefer-not-say',
    'Islam': 'muslim',
    'Yazidism': 'other',
    'Spiritual': 'spiritual',
    'Yarsanism': 'other'
  },
  
  // Political Views
  political_views: {
    'Liberal': 'liberal',
    'Moderate': 'moderate',
    'Conservative': 'conservative',
    'Progressive': 'progressive',
    'Libertarian': 'libertarian',
    'Apolitical': 'apolitical',
    'Prefer not to say': 'prefer-not-say',
    'Kurdish Nationalist': 'progressive'
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
    'Empathetic': 'empathetic',
    'Direct and honest': 'direct',
    'Thoughtful and reflective': 'diplomatic',
    'Reserved but caring': 'reserved'
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
    'Depends on the situation': 'situational',
    'Depends on season': 'situational'
  },
  
  // Education
  education: {
    'High School': 'high-school',
    'Some College': 'some-college',
    'Associate\'s Degree': 'associates',
    'Bachelor\'s Degree': 'bachelors',
    'Master\'s Degree': 'masters',
    'PhD': 'phd',
    'Trade School': 'trade-school',
    'Professional Degree': 'professional'
  },
  
  // Relationship Goals
  relationship_goals: {
    'Long-term relationship': 'long-term',
    'Marriage': 'marriage', 
    'Casual dating': 'casual',
    'Something serious': 'serious',
    'Let\'s see what happens': 'see-what-happens',
    'Looking for something serious': 'serious',
    'Friendship first': 'friendship-first',
    'Taking things slow': 'taking-slow'
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
  
  console.log('Converting DB to UI values...');
  
  Object.keys(dbToUiValueMapping).forEach(field => {
    if (profileData[field] && dbToUiValueMapping[field][profileData[field]]) {
      const oldValue = profileData[field];
      converted[field] = dbToUiValueMapping[field][profileData[field]];
      console.log(`✅ Converted ${field}: "${oldValue}" → "${converted[field]}"`);
    } else if (profileData[field]) {
      console.log(`⚠️  No mapping found for ${field}: "${profileData[field]}"`);
    }
  });
  
  console.log('✅ Final converted profile sample:', {
    education: converted.education,
    dietary_preferences: converted.dietary_preferences,
    have_pets: converted.have_pets,
    smoking: converted.smoking,
    drinking: converted.drinking
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