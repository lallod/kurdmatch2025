/**
 * Direct profile filler - fills all empty fields with random values
 */

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
