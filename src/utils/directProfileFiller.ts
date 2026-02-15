/**
 * Direct profile filler - fills all empty fields with random values
 */

// OPTIONS must exactly match the fieldOptions in ProfileLifestyle, ProfileBasics, ProfileCommunication, ProfileCreative, ProfileTravel, ProfilePersonality
const OPTIONS = {
  exerciseHabits: ['Never', 'Rarely', 'Occasional', 'Regular', 'Daily'],
  dietaryPreferences: ['No restrictions', 'Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Pescatarian', 'Gluten-free', 'Other'],
  smoking: ['Never', 'Rarely', 'Socially', 'Regularly', 'Trying to quit'],
  drinking: ['Never', 'Rarely', 'Socially', 'Regularly'],
  sleepSchedule: ['Night owl', 'Irregular schedule', 'Regular schedule', 'Early bird'],
  petsOwned: ['Dog', 'Cat', 'Both', 'Other pets', 'No pets', 'Want pets'],
  travelFrequency: ['Rarely', 'Once a year', 'A few times a year', 'Monthly', 'Constantly traveling'],
  workLifeBalance: ['Work-focused', 'Balanced', 'Life-focused', 'Flexible', 'Struggling'],
  religion: ['Islam', 'Christianity', 'Judaism', 'Yazidism', 'Zoroastrianism', 'Other', 'Not religious'],
  politicalViews: ['Liberal', 'Conservative', 'Moderate', 'Progressive', 'Libertarian', 'Apolitical', 'Other'],
  zodiacSign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  personalityType: ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP', 'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'],
  communicationStyle: ['Direct', 'Diplomatic', 'Expressive', 'Reserved', 'Humorous', 'Analytical'],
  loveLanguage: ['Words of Affirmation', 'Physical Touch', 'Acts of Service', 'Quality Time', 'Receiving Gifts'],
  relationshipGoals: ['Long-term relationship', 'Marriage', 'Casual dating', 'Something serious', 'Let\'s see what happens'],
  wantChildren: ['Want children', 'Don\'t want children', 'Have children', 'Maybe someday', 'Open to it'],
  childrenStatus: ['No children', 'Have children', 'Want children', 'Maybe someday'],
  familyCloseness: ['Very close', 'Close', 'Somewhat close', 'Not very close'],
  bodyType: ['Slim', 'Athletic', 'Average', 'Curvy', 'Plus-size'],
  ethnicity: ['Kurdish', 'Middle Eastern', 'European', 'Asian', 'African', 'Latin American', 'Mixed', 'Other'],
  education: ['High School', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Trade School'],
  financialHabits: ['Spender', 'Balanced', 'Saver with occasional splurges', 'Saver', 'Financial planner'],
  favoriteSeason: ['Spring', 'Summer', 'Autumn', 'Winter']
};

export const fillEmptyProfileFields = (profile: any): any => {
  const filledProfile = { ...profile };

  const getRandomElement = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)];
  const getRandomSubset = <T>(array: T[], count: number): T[] => [...array].sort(() => 0.5 - Math.random()).slice(0, count);

  const isEmpty = (value: any): boolean =>
    !value ||
    value === '' ||
    value === 'Not specified' ||
    value === 'Prefer not to say' ||
    value === null ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'string' && value.trim() === '');

  const fieldMappings = [
    { db: 'exercise_habits', ui: 'exerciseHabits', options: OPTIONS.exerciseHabits },
    { db: 'dietary_preferences', ui: 'dietaryPreferences', options: OPTIONS.dietaryPreferences },
    { db: 'smoking', ui: 'smoking', options: OPTIONS.smoking },
    { db: 'drinking', ui: 'drinking', options: OPTIONS.drinking },
    { db: 'sleep_schedule', ui: 'sleepSchedule', options: OPTIONS.sleepSchedule },
    { db: 'have_pets', ui: 'havePets', options: OPTIONS.petsOwned },
    { db: 'travel_frequency', ui: 'travelFrequency', options: OPTIONS.travelFrequency },
    { db: 'work_life_balance', ui: 'workLifeBalance', options: OPTIONS.workLifeBalance },
    { db: 'religion', ui: 'religion', options: OPTIONS.religion },
    { db: 'political_views', ui: 'politicalViews', options: OPTIONS.politicalViews },
    { db: 'zodiac_sign', ui: 'zodiacSign', options: OPTIONS.zodiacSign },
    { db: 'personality_type', ui: 'personalityType', options: OPTIONS.personalityType },
    { db: 'communication_style', ui: 'communicationStyle', options: OPTIONS.communicationStyle },
    { db: 'love_language', ui: 'loveLanguage', options: OPTIONS.loveLanguage },
    { db: 'relationship_goals', ui: 'relationshipGoals', options: OPTIONS.relationshipGoals },
    { db: 'want_children', ui: 'wantChildren', options: OPTIONS.wantChildren },
    { db: 'children_status', ui: 'childrenStatus', options: OPTIONS.childrenStatus },
    { db: 'family_closeness', ui: 'familyCloseness', options: OPTIONS.familyCloseness },
    { db: 'body_type', ui: 'bodyType', options: OPTIONS.bodyType },
    { db: 'ethnicity', ui: 'ethnicity', options: OPTIONS.ethnicity },
    { db: 'education', ui: 'education', options: OPTIONS.education },
    { db: 'financial_habits', ui: 'financialHabits', options: OPTIONS.financialHabits },
    { db: 'favorite_season', ui: 'favoriteSeason', options: OPTIONS.favoriteSeason }
  ];

  fieldMappings.forEach(({ db, ui, options }) => {
    if (isEmpty(filledProfile[db]) || isEmpty(filledProfile[ui])) {
      const randomValue = getRandomElement(options);
      filledProfile[db] = randomValue;
      filledProfile[ui] = randomValue;
    }
  });

  const multiSelectFields = [
    { db: 'values', ui: 'values', options: ['Honesty', 'Loyalty', 'Family', 'Career', 'Adventure', 'Creativity', 'Health', 'Spirituality', 'Freedom', 'Balance'], count: 3 },
    { db: 'interests', ui: 'interests', options: ['Travel', 'Reading', 'Sports', 'Music', 'Art', 'Technology', 'Cooking', 'Photography', 'Fitness', 'Nature'], count: 3 },
    { db: 'hobbies', ui: 'hobbies', options: ['Hiking', 'Photography', 'Cooking', 'Reading', 'Gaming', 'Painting', 'Gardening', 'Dancing', 'Writing', 'Crafts'], count: 2 },
    { db: 'weekend_activities', ui: 'weekendActivities', options: ['Hiking', 'Beach trips', 'Museum visits', 'Concerts', 'Farmers markets', 'Brunch', 'Movie marathons', 'Game nights', 'Road trips', 'Camping'], count: 2 },
    { db: 'creative_pursuits', ui: 'creativePursuits', options: ['Painting', 'Drawing', 'Photography', 'Writing', 'Music', 'Dance', 'Theater', 'Crafting', 'DIY projects', 'Digital art'], count: 2 }
  ];

  multiSelectFields.forEach(({ db, ui, options, count }) => {
    if (isEmpty(filledProfile[db]) || isEmpty(filledProfile[ui])) {
      const randomValues = getRandomSubset(options, count);
      filledProfile[db] = randomValues;
      filledProfile[ui] = randomValues;
    }
  });

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
    if (isEmpty(filledProfile[db]) || isEmpty(filledProfile[ui])) {
      const randomValue = getRandomElement(options);
      filledProfile[db] = randomValue;
      filledProfile[ui] = randomValue;
    }
  });

  return filledProfile;
};
