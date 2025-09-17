/**
 * AGGRESSIVE Direct profile filler - FORCES all empty fields to be filled
 */

// Define options directly to avoid import issues
const OPTIONS = {
  exerciseHabits: ['Daily', 'Few times a week', 'Weekly', 'Occasionally', 'Rarely'],
  dietaryPreferences: ['No restrictions', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Paleo', 'Gluten-free'],
  smoking: ['Never', 'Socially', 'Regularly', 'Trying to quit'],
  drinking: ['Never', 'Socially', 'Occasionally', 'Regularly'],
  sleepSchedule: ['Early bird', 'Night owl', 'Flexible', 'Regular schedule'],
  petsOwned: ['Dog', 'Cat', 'Both', 'Other pets', 'No pets', 'Want pets'],
  travelFrequency: ['Often', 'Sometimes', 'Rarely', 'Never', 'Love to travel'],
  workLifeBalance: ['Very important', 'Important', 'Balanced', 'Work-focused'],
  religion: ['Christianity', 'Islam', 'Judaism', 'Buddhism', 'Hinduism', 'Agnostic', 'Atheist', 'Spiritual', 'Other'],
  politicalViews: ['Liberal', 'Conservative', 'Moderate', 'Apolitical', 'Progressive'],
  zodiacSign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  personalityType: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
  communicationStyle: ['Direct', 'Diplomatic', 'Humorous', 'Thoughtful', 'Expressive'],
  loveLanguage: ['Words of Affirmation', 'Physical Touch', 'Acts of Service', 'Quality Time', 'Receiving Gifts'],
  relationshipGoals: ['Long-term relationship', 'Marriage', 'Casual dating', 'Something serious', 'Let\'s see what happens'],
  wantChildren: ['Want children', 'Don\'t want children', 'Have children', 'Maybe someday', 'Open to it'],
  childrenStatus: ['No children', 'Have children', 'Want children', 'Maybe someday'],
  familyCloseness: ['Very close', 'Close', 'Somewhat close', 'Not very close'],
  bodyType: ['Slim', 'Athletic', 'Average', 'Curvy', 'Plus-size'],
  ethnicity: ['White/Caucasian', 'Black/African', 'Hispanic/Latino', 'Asian', 'Middle Eastern', 'Mixed', 'Other'],
  education: ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Trade School'],
  financialHabits: ['Saver', 'Spender', 'Investor', 'Budgeter', 'Spontaneous'],
  favoriteSeason: ['Spring', 'Summer', 'Fall', 'Winter']
};

// AGGRESSIVE field filling that FORCES all empty fields to be filled
export const fillEmptyProfileFields = (profile: any): any => {
  const filledProfile = { ...profile };
  
  console.log('🚀 STARTING AGGRESSIVE PROFILE FILLING');
  console.log('📋 Input profile keys:', Object.keys(profile));
  
  // Helper to get random element
  const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Helper to get random subset
  const getRandomSubset = <T>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // VERY AGGRESSIVE empty check - anything falsy, empty string, null, undefined, or empty array
  const isEmpty = (value: any): boolean => {
    const empty = !value || 
           value === '' || 
           value === 'Not specified' || 
           value === 'Prefer not to say' ||
           value === null ||
           value === undefined ||
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'string' && value.trim() === '');
    
    if (empty) {
      console.log(`❌ Field is EMPTY: ${value} (type: ${typeof value})`);
    }
    return empty;
  };
  
  let totalFilledCount = 0;
  
  // FORCE FILL ALL SINGLE SELECT FIELDS - Both database AND UI names
  const fieldMappings = [
    { db: 'exercise_habits', ui: 'exerciseHabits', options: OPTIONS.exerciseHabits, label: 'Exercise Habits' },
    { db: 'dietary_preferences', ui: 'dietaryPreferences', options: OPTIONS.dietaryPreferences, label: 'Dietary Preferences' },
    { db: 'smoking', ui: 'smoking', options: OPTIONS.smoking, label: 'Smoking' },
    { db: 'drinking', ui: 'drinking', options: OPTIONS.drinking, label: 'Drinking' },
    { db: 'sleep_schedule', ui: 'sleepSchedule', options: OPTIONS.sleepSchedule, label: 'Sleep Schedule' },
    { db: 'have_pets', ui: 'havePets', options: OPTIONS.petsOwned, label: 'Pets' },
    { db: 'travel_frequency', ui: 'travelFrequency', options: OPTIONS.travelFrequency, label: 'Travel Frequency' },
    { db: 'work_life_balance', ui: 'workLifeBalance', options: OPTIONS.workLifeBalance, label: 'Work-Life Balance' },
    { db: 'religion', ui: 'religion', options: OPTIONS.religion, label: 'Religion' },
    { db: 'political_views', ui: 'politicalViews', options: OPTIONS.politicalViews, label: 'Political Views' },
    { db: 'zodiac_sign', ui: 'zodiacSign', options: OPTIONS.zodiacSign, label: 'Zodiac Sign' },
    { db: 'personality_type', ui: 'personalityType', options: OPTIONS.personalityType, label: 'Personality Type' },
    { db: 'communication_style', ui: 'communicationStyle', options: OPTIONS.communicationStyle, label: 'Communication Style' },
    { db: 'love_language', ui: 'loveLanguage', options: OPTIONS.loveLanguage, label: 'Love Language' },
    { db: 'relationship_goals', ui: 'relationshipGoals', options: OPTIONS.relationshipGoals, label: 'Relationship Goals' },
    { db: 'want_children', ui: 'wantChildren', options: OPTIONS.wantChildren, label: 'Children' },
    { db: 'children_status', ui: 'childrenStatus', options: OPTIONS.childrenStatus, label: 'Children Status' },
    { db: 'family_closeness', ui: 'familyCloseness', options: OPTIONS.familyCloseness, label: 'Family Closeness' },
    { db: 'body_type', ui: 'bodyType', options: OPTIONS.bodyType, label: 'Body Type' },
    { db: 'ethnicity', ui: 'ethnicity', options: OPTIONS.ethnicity, label: 'Ethnicity' },
    { db: 'education', ui: 'education', options: OPTIONS.education, label: 'Education' },
    { db: 'financial_habits', ui: 'financialHabits', options: OPTIONS.financialHabits, label: 'Financial Habits' },
    { db: 'favorite_season', ui: 'favoriteSeason', options: OPTIONS.favoriteSeason, label: 'Favorite Season' }
  ];
  
  console.log('🔄 Processing single select fields...');
  fieldMappings.forEach(({ db, ui, options, label }) => {
    const dbValue = filledProfile[db];
    const uiValue = filledProfile[ui];
    const dbEmpty = isEmpty(dbValue);
    const uiEmpty = isEmpty(uiValue);
    
    console.log(`🔍 Checking ${label}: db(${db})="${dbValue}" ui(${ui})="${uiValue}" | dbEmpty:${dbEmpty} uiEmpty:${uiEmpty}`);
    
    if (dbEmpty || uiEmpty) {
      const randomValue = getRandomElement(options);
      
      // FORCE SET BOTH field names
      filledProfile[db] = randomValue;
      filledProfile[ui] = randomValue;
      
      console.log(`✅ FILLED ${label}: ${db}/${ui} = "${randomValue}"`);
      totalFilledCount++;
    } else {
      console.log(`✓ ${label} already has values`);
    }
  });
  
  // FORCE FILL MULTI-SELECT FIELDS
  const multiSelectFields = [
    { db: 'values', ui: 'values', options: ['Honesty', 'Loyalty', 'Family', 'Career', 'Adventure', 'Creativity', 'Health', 'Spirituality', 'Freedom', 'Balance'], count: 3, label: 'Values' },
    { db: 'interests', ui: 'interests', options: ['Travel', 'Reading', 'Sports', 'Music', 'Art', 'Technology', 'Cooking', 'Photography', 'Fitness', 'Nature'], count: 3, label: 'Interests' },
    { db: 'hobbies', ui: 'hobbies', options: ['Hiking', 'Photography', 'Cooking', 'Reading', 'Gaming', 'Painting', 'Gardening', 'Dancing', 'Writing', 'Crafts'], count: 2, label: 'Hobbies' },
    { db: 'weekend_activities', ui: 'weekendActivities', options: ['Hiking', 'Beach trips', 'Museum visits', 'Concerts', 'Farmers markets', 'Brunch', 'Movie marathons', 'Game nights', 'Road trips', 'Camping'], count: 2, label: 'Weekend Activities' },
    { db: 'creative_pursuits', ui: 'creativePursuits', options: ['Painting', 'Drawing', 'Photography', 'Writing', 'Music', 'Dance', 'Theater', 'Crafting', 'DIY projects', 'Digital art'], count: 2, label: 'Creative Pursuits' }
  ];
  
  console.log('🔄 Processing multi-select fields...');
  multiSelectFields.forEach(({ db, ui, options, count, label }) => {
    const dbValue = filledProfile[db];
    const uiValue = filledProfile[ui];
    const dbEmpty = isEmpty(dbValue);
    const uiEmpty = isEmpty(uiValue);
    
    console.log(`🔍 Checking ${label}: db(${db})="${JSON.stringify(dbValue)}" ui(${ui})="${JSON.stringify(uiValue)}" | dbEmpty:${dbEmpty} uiEmpty:${uiEmpty}`);
    
    if (dbEmpty || uiEmpty) {
      const randomValues = getRandomSubset(options, count);
      
      // FORCE SET BOTH field names
      filledProfile[db] = randomValues;
      filledProfile[ui] = randomValues;
      
      console.log(`✅ FILLED ${label}: ${db}/${ui} = [${randomValues.join(', ')}]`);
      totalFilledCount++;
    } else {
      console.log(`✓ ${label} already has values`);
    }
  });
  
  // FORCE FILL TEXT FIELDS
  const textFields = [
    {
      db: 'ideal_date', ui: 'idealDate', label: 'Ideal Date',
      options: [
        'A cozy dinner followed by a walk under the stars',
        'Coffee shop conversation and exploring local art galleries',
        'Hiking adventure followed by a picnic',
        'Cooking together and watching a good movie',
        'Cultural event or museum visit with meaningful conversation'
      ]
    },
    {
      db: 'career_ambitions', ui: 'careerAmbitions', label: 'Career Ambitions',
      options: [
        'Growing in my field while making a positive impact',
        'Building a career that balances success with personal fulfillment',
        'Leading innovative projects that make a difference',
        'Developing expertise while mentoring others',
        'Creating work that contributes meaningfully to society'
      ]
    }
  ];
  
  console.log('🔄 Processing text fields...');
  textFields.forEach(({ db, ui, options, label }) => {
    const dbValue = filledProfile[db];
    const uiValue = filledProfile[ui];
    const dbEmpty = isEmpty(dbValue);
    const uiEmpty = isEmpty(uiValue);
    
    console.log(`🔍 Checking ${label}: db(${db})="${dbValue}" ui(${ui})="${uiValue}" | dbEmpty:${dbEmpty} uiEmpty:${uiEmpty}`);
    
    if (dbEmpty || uiEmpty) {
      const randomValue = getRandomElement(options);
      
      // FORCE SET BOTH field names
      filledProfile[db] = randomValue;
      filledProfile[ui] = randomValue;
      
      console.log(`✅ FILLED ${label}: ${db}/${ui} = "${randomValue}"`);
      totalFilledCount++;
    } else {
      console.log(`✓ ${label} already has values`);
    }
  });
  
  console.log(`🎉 AGGRESSIVE PROFILE FILLING COMPLETED! Filled ${totalFilledCount} empty fields.`);
  console.log('🔍 Final profile sample:', {
    exercise_habits: filledProfile.exercise_habits,
    exerciseHabits: filledProfile.exerciseHabits,
    dietary_preferences: filledProfile.dietary_preferences,
    dietaryPreferences: filledProfile.dietaryPreferences,
    religion: filledProfile.religion,
    zodiac_sign: filledProfile.zodiac_sign,
    zodiacSign: filledProfile.zodiacSign
  });
  
  return filledProfile;
};