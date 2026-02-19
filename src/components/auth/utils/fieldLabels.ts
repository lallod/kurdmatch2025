// Map field IDs to user-friendly display names
// Accepts an optional translation function for i18n support
type TranslateFn = (key: string, fallback: string) => string;

const identity: TranslateFn = (_key, fallback) => fallback;

export const getFieldLabel = (fieldId: string, t: TranslateFn = identity): string => {
  const labelMap: Record<string, [string, string]> = {
    // Account fields
    email: ['field.email', 'Email'],
    password: ['field.password', 'Password'],
    full_name: ['field.full_name', 'Full Name'],
    
    // Basic Info
    age: ['field.age', 'Age'],
    date_of_birth: ['field.date_of_birth', 'Date of Birth'],
    gender: ['field.gender', 'Gender'],
    location: ['field.location', 'Location'],
    height: ['field.height', 'Height'],
    
    // Cultural Identity
    ethnicity: ['field.ethnicity', 'Ethnicity'],
    religion: ['field.religion', 'Religion'],
    political_views: ['field.political_views', 'Political Views'],
    personality_type: ['field.personality_type', 'Personality Type'],
    languages: ['field.languages', 'Languages'],
    kurdistan_region: ['field.kurdistan_region', 'Kurdistan Region'],
    tribe: ['field.tribe', 'Tribe'],
    
    // Interests & Values
    interests: ['field.interests', 'Interests'],
    hobbies: ['field.hobbies', 'Hobbies'],
    values: ['field.values', 'Values'],
    
    // Lifestyle
    family_plans: ['field.family_plans', 'Family Plans'],
    has_children: ['field.has_children', 'Has Children'],
    smoking: ['field.smoking', 'Smoking'],
    drinking: ['field.drinking', 'Drinking'],
    exercise: ['field.exercise', 'Exercise'],
    diet: ['field.diet', 'Diet'],
    pets: ['field.pets', 'Pets'],
    living_situation: ['field.living_situation', 'Living Situation'],
    relationship_goals: ['field.relationship_goals', 'Relationship Goals'],
    dealbreakers: ['field.dealbreakers', 'Dealbreakers'],
    ideal_partner: ['field.ideal_partner', 'Ideal Partner'],
    
    // Career & Education
    occupation: ['field.occupation', 'What do you do for work?'],
    education: ['field.education', 'Education'],
    work_life_balance: ['field.work_life_balance', 'Work-Life Balance'],
    career_goals: ['field.career_goals', 'Career Goals'],
    
    // Optional/Other
    bio: ['field.bio', 'Bio'],
    dreamVacation: ['field.dream_vacation', 'Dream Vacation'],
    favoriteFood: ['field.favorite_food', 'Favorite Food'],
    movieGenre: ['field.movie_genre', 'Favorite Movie Genre'],
    musicGenre: ['field.music_genre', 'Music Genre'],
    perfectDate: ['field.perfect_date', 'Perfect Date'],
    photos: ['field.photos', 'Photos'],
  };

  const entry = labelMap[fieldId];
  if (entry) return t(entry[0], entry[1]);
  return fieldId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Get specific validation requirement message for a field
export const getFieldRequirement = (question: any, t: TranslateFn = identity): string => {
  if (!question) return t('validation.field_required', 'This field is required');
  
  const { fieldType, required, id } = question;
  
  // Special cases
  if (id === 'age') return t('validation.must_be_18', 'Must be 18 or older');
  if (id === 'password') return t('validation.min_6_chars', 'At least 6 characters');
  if (id === 'email') return t('validation.valid_email', 'Valid email address required');
  if (id === 'interests') return t('validation.select_3_interests', 'Select at least 3 interests');
  if (id === 'hobbies') return t('validation.select_2_hobbies', 'Select at least 2 hobbies');
  if (id === 'values') return t('validation.select_3_values', 'Select at least 3 values');
  if (id === 'languages') return t('validation.select_1_language', 'Select at least 1 language');
  
  // Multi-select fields
  if (fieldType === 'multi-select' || fieldType === 'multi_select') {
    return t('validation.select_at_least_one', 'Please select at least one option');
  }
  
  // Checkbox
  if (fieldType === 'checkbox') {
    return t('validation.check_field', 'Please check this field');
  }
  
  // Default
  if (required) {
    return t('validation.field_required', 'This field is required');
  }
  
  return '';
};
