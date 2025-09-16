/**
 * Direct profile filler - bypasses complex field mapping and fills empty fields directly
 */

import { OPTIONS } from '@/components/DetailEditor/constants';

// Direct field filling with both database and UI field names
export const fillEmptyProfileFields = (profile: any): any => {
  const filledProfile = { ...profile };
  
  console.log('Starting direct profile filling for fields:', Object.keys(profile));
  
  // Helper to get random element
  const getRandomElement = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };
  
  // Helper to get random subset
  const getRandomSubset = <T>(array: T[], count: number): T[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Check if field is empty
  const isEmpty = (value: any): boolean => {
    return !value || 
           value === '' || 
           value === 'Not specified' || 
           value === 'Prefer not to say' ||
           value === null ||
           value === undefined ||
           (Array.isArray(value) && value.length === 0);
  };
  
  // Fill single select fields with both database and UI names
  const singleSelectFields = [
    // Lifestyle
    { db: 'exercise_habits', ui: 'exerciseHabits', options: OPTIONS.exerciseHabits },
    { db: 'dietary_preferences', ui: 'dietaryPreferences', options: OPTIONS.dietaryPreferences },
    { db: 'smoking', ui: 'smoking', options: OPTIONS.smoking },
    { db: 'drinking', ui: 'drinking', options: OPTIONS.drinking },
    { db: 'sleep_schedule', ui: 'sleepSchedule', options: OPTIONS.sleepSchedule },
    { db: 'have_pets', ui: 'havePets', options: OPTIONS.petsOwned },
    { db: 'travel_frequency', ui: 'travelFrequency', options: OPTIONS.travelFrequency },
    { db: 'work_life_balance', ui: 'workLifeBalance', options: OPTIONS.workLifeBalance },
    
    // Values & Personality
    { db: 'religion', ui: 'religion', options: OPTIONS.religion },
    { db: 'political_views', ui: 'politicalViews', options: OPTIONS.politicalViews },
    { db: 'zodiac_sign', ui: 'zodiacSign', options: OPTIONS.zodiacSign },
    { db: 'personality_type', ui: 'personalityType', options: OPTIONS.personalityType },
    { db: 'communication_style', ui: 'communicationStyle', options: OPTIONS.communicationStyle },
    { db: 'love_language', ui: 'loveLanguage', options: OPTIONS.loveLanguage },
    
    // Relationship & Family
    { db: 'relationship_goals', ui: 'relationshipGoals', options: OPTIONS.relationshipGoals },
    { db: 'want_children', ui: 'wantChildren', options: OPTIONS.wantChildren },
    { db: 'children_status', ui: 'childrenStatus', options: OPTIONS.childrenStatus },
    { db: 'family_closeness', ui: 'familyCloseness', options: OPTIONS.familyCloseness },
    
    // Basic Info
    { db: 'body_type', ui: 'bodyType', options: OPTIONS.bodyType },
    { db: 'ethnicity', ui: 'ethnicity', options: OPTIONS.ethnicity },
    { db: 'education', ui: 'education', options: OPTIONS.education },
    
    // Additional
    { db: 'financial_habits', ui: 'financialHabits', options: OPTIONS.financialHabits },
    { db: 'favorite_season', ui: 'favoriteSeason', options: OPTIONS.favoriteSeason }
  ];
  
  let filledCount = 0;
  
  singleSelectFields.forEach(({ db, ui, options }) => {
    const dbEmpty = isEmpty(filledProfile[db]);
    const uiEmpty = isEmpty(filledProfile[ui]);
    
    if (dbEmpty || uiEmpty) {
      const randomValue = getRandomElement(options);
      
      // Set both database and UI field names
      filledProfile[db] = randomValue;
      filledProfile[ui] = randomValue;
      
      console.log(`Filled ${db}/${ui} with: ${randomValue}`);
      filledCount++;
    }
  });
  
  // Fill multi-select fields
  const multiSelectFields = [
    { db: 'values', ui: 'values', options: ['Honesty', 'Loyalty', 'Family', 'Career', 'Adventure', 'Creativity', 'Health', 'Spirituality', 'Freedom', 'Balance'], count: 3 },
    { db: 'interests', ui: 'interests', options: ['Travel', 'Reading', 'Sports', 'Music', 'Art', 'Technology', 'Cooking', 'Photography', 'Fitness', 'Nature'], count: 3 },
    { db: 'hobbies', ui: 'hobbies', options: ['Hiking', 'Photography', 'Cooking', 'Reading', 'Gaming', 'Painting', 'Gardening', 'Dancing', 'Writing', 'Crafts'], count: 2 },
    { db: 'weekend_activities', ui: 'weekendActivities', options: ['Hiking', 'Beach trips', 'Museum visits', 'Concerts', 'Farmers markets', 'Brunch', 'Movie marathons', 'Game nights', 'Road trips', 'Camping'], count: 2 },
    { db: 'creative_pursuits', ui: 'creativePursuits', options: ['Painting', 'Drawing', 'Photography', 'Writing', 'Music', 'Dance', 'Theater', 'Crafting', 'DIY projects', 'Digital art'], count: 2 }
  ];
  
  multiSelectFields.forEach(({ db, ui, options, count }) => {
    const dbEmpty = isEmpty(filledProfile[db]);
    const uiEmpty = isEmpty(filledProfile[ui]);
    
    if (dbEmpty || uiEmpty) {
      const randomValues = getRandomSubset(options, count);
      
      // Set both database and UI field names
      filledProfile[db] = randomValues;
      filledProfile[ui] = randomValues;
      
      console.log(`Filled ${db}/${ui} with: ${randomValues.join(', ')}`);
      filledCount++;
    }
  });
  
  // Fill text fields
  const textFields = [
    {
      db: 'ideal_date', ui: 'idealDate',
      options: [
        'A cozy dinner followed by a walk under the stars',
        'Coffee shop conversation and exploring local art galleries',
        'Hiking adventure followed by a picnic',
        'Cooking together and watching a good movie',
        'Cultural event or museum visit with meaningful conversation'
      ]
    },
    {
      db: 'career_ambitions', ui: 'careerAmbitions',
      options: [
        'Growing in my field while making a positive impact',
        'Building a career that balances success with personal fulfillment',
        'Leading innovative projects that make a difference',
        'Developing expertise while mentoring others',
        'Creating work that contributes meaningfully to society'
      ]
    }
  ];
  
  textFields.forEach(({ db, ui, options }) => {
    const dbEmpty = isEmpty(filledProfile[db]) || (filledProfile[db] && filledProfile[db].trim() === '');
    const uiEmpty = isEmpty(filledProfile[ui]) || (filledProfile[ui] && filledProfile[ui].trim() === '');
    
    if (dbEmpty || uiEmpty) {
      const randomValue = getRandomElement(options);
      
      // Set both database and UI field names
      filledProfile[db] = randomValue;
      filledProfile[ui] = randomValue;
      
      console.log(`Filled ${db}/${ui} with: ${randomValue}`);
      filledCount++;
    }
  });
  
  console.log(`Direct profile filling completed. Filled ${filledCount} empty fields.`);
  
  return filledProfile;
};