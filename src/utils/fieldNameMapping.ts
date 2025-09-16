/**
 * Field name mapping utilities to convert between database (snake_case) and UI (camelCase) field names
 */

// Mapping from database field names (snake_case) to UI field names (camelCase)
export const dbToUiFieldMapping: Record<string, string> = {
  // Lifestyle & Habits
  exercise_habits: 'exerciseHabits',
  dietary_preferences: 'dietaryPreferences', 
  sleep_schedule: 'sleepSchedule',
  have_pets: 'havePets',
  travel_frequency: 'travelFrequency',
  work_life_balance: 'workLifeBalance',
  
  // Values & Personality
  political_views: 'politicalViews',
  zodiac_sign: 'zodiacSign',
  personality_type: 'personalityType',
  communication_style: 'communicationStyle',
  love_language: 'loveLanguage',
  
  // Relationship & Family
  relationship_goals: 'relationshipGoals',
  want_children: 'wantChildren',
  children_status: 'childrenStatus',
  family_closeness: 'familyCloseness',
  
  // Basic Info
  body_type: 'bodyType',
  kurdistan_region: 'kurdistanRegion',
  
  // Career & Education
  career_ambitions: 'careerAmbitions',
  
  // Interests & Hobbies
  creative_pursuits: 'creativePursuits',
  weekend_activities: 'weekendActivities',
  
  // Additional
  financial_habits: 'financialHabits',
  favorite_season: 'favoriteSeason'
};

// Reverse mapping from UI field names (camelCase) to database field names (snake_case)
export const uiToDbFieldMapping: Record<string, string> = Object.fromEntries(
  Object.entries(dbToUiFieldMapping).map(([db, ui]) => [ui, db])
);


/**
 * Convert database profile data to UI format
 */
export const convertDbToUiProfile = (dbProfile: any): any => {
  const uiProfile = { ...dbProfile };
  
  Object.entries(dbToUiFieldMapping).forEach(([dbField, uiField]) => {
    if (dbProfile[dbField] !== undefined) {
      uiProfile[uiField] = dbProfile[dbField];
      // Keep the original field for backward compatibility
      // delete uiProfile[dbField];
    }
  });
  
  return uiProfile;
};

/**
 * Convert UI profile data to database format
 */
export const convertUiToDbProfile = (uiProfile: any): any => {
  const dbProfile = { ...uiProfile };
  
  Object.entries(uiToDbFieldMapping).forEach(([uiField, dbField]) => {
    if (uiProfile[uiField] !== undefined) {
      dbProfile[dbField] = uiProfile[uiField];
      // Keep the original field for backward compatibility
      // delete dbProfile[uiField];
    }
  });
  
  return dbProfile;
};
