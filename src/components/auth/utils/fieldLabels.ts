// Map field IDs to user-friendly display names
export const getFieldLabel = (fieldId: string): string => {
  const labelMap: Record<string, string> = {
    // Account fields
    email: 'Email',
    password: 'Password',
    full_name: 'Full Name',
    
    // Basic Info
    age: 'Age',
    date_of_birth: 'Date of Birth',
    gender: 'Gender',
    location: 'Location',
    height: 'Height',
    
    // Cultural Identity
    ethnicity: 'Ethnicity',
    religion: 'Religion',
    political_views: 'Political Views',
    personality_type: 'Personality Type',
    languages: 'Languages',
    kurdistan_region: 'Kurdistan Region',
    tribe: 'Tribe',
    
    // Interests & Values
    interests: 'Interests',
    hobbies: 'Hobbies',
    values: 'Values',
    
    // Lifestyle
    family_plans: 'Family Plans',
    has_children: 'Has Children',
    smoking: 'Smoking',
    drinking: 'Drinking',
    exercise: 'Exercise',
    diet: 'Diet',
    pets: 'Pets',
    living_situation: 'Living Situation',
    relationship_goals: 'Relationship Goals',
    dealbreakers: 'Dealbreakers',
    ideal_partner: 'Ideal Partner',
    
    // Career & Education
    occupation: 'Occupation',
    education: 'Education',
    work_life_balance: 'Work-Life Balance',
    career_goals: 'Career Goals',
    
    // Optional/Other
    bio: 'Bio',
    dreamVacation: 'Dream Vacation',
    favoriteFood: 'Favorite Food',
    movieGenre: 'Favorite Movie Genre',
    musicGenre: 'Music Genre',
    perfectDate: 'Perfect Date',
    photos: 'Photos',
  };

  return labelMap[fieldId] || fieldId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// Get specific validation requirement message for a field
export const getFieldRequirement = (question: any): string => {
  if (!question) return 'This field is required';
  
  const { fieldType, required, id } = question;
  
  // Special cases
  if (id === 'age') return 'Must be 18 or older';
  if (id === 'password') return 'At least 6 characters';
  if (id === 'email') return 'Valid email address required';
  if (id === 'interests') return 'Select at least 3 interests';
  if (id === 'hobbies') return 'Select at least 2 hobbies';
  if (id === 'values') return 'Select at least 3 values';
  
  // Multi-select fields
  if (fieldType === 'multi-select' || fieldType === 'multi_select') {
    return 'Please select at least one option';
  }
  
  // Checkbox
  if (fieldType === 'checkbox') {
    return 'Please check this field';
  }
  
  // Default
  if (required) {
    return 'This field is required';
  }
  
  return '';
};
