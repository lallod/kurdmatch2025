
import { supabase } from '@/integrations/supabase/client';

/**
 * Real User Enhancement System
 * Replaces test profile generation with real user onboarding and profile enhancement
 */

export interface UserOnboardingProgress {
  userId: string;
  completedSteps: string[];
  currentStep: string;
  profileCompletion: number;
  suggestions: string[];
}

export interface CulturalSuggestion {
  category: 'location' | 'language' | 'interest' | 'value';
  suggestions: string[];
  description: string;
}

/**
 * Category-based progress interface
 */
export interface CategoryProgress {
  basicInfo: number;
  lifestyle: number;
  valuesAndBeliefs: number;
  interestsAndHobbies: number;
  careerAndEducation: number;
  relationshipGoals: number;
  overall: number;
}

/**
 * Calculate category-based profile completion
 */
export const calculateCategoryProgress = (profile: any, photoCount: number = 0): CategoryProgress => {
  // Basic Info (8 fields)
  let basicInfoCompleted = 0;
  const basicInfoTotal = 8;
  if (profile.name) basicInfoCompleted++;
  if (profile.age && profile.age >= 18) basicInfoCompleted++;
  if (profile.location) basicInfoCompleted++;
  if (profile.height) basicInfoCompleted++;
  if (profile.body_type) basicInfoCompleted++;
  if (profile.ethnicity) basicInfoCompleted++;
  if (profile.kurdistan_region) basicInfoCompleted++;
  if (photoCount >= 1) basicInfoCompleted++;
  
  // Lifestyle (7 fields)
  let lifestyleCompleted = 0;
  const lifestyleTotal = 7;
  if (profile.exercise_habits) lifestyleCompleted++;
  if (profile.dietary_preferences) lifestyleCompleted++;
  if (profile.smoking) lifestyleCompleted++;
  if (profile.drinking) lifestyleCompleted++;
  if (profile.sleep_schedule) lifestyleCompleted++;
  if (profile.have_pets) lifestyleCompleted++;
  if (profile.travel_frequency) lifestyleCompleted++;
  
  // Values & Beliefs (4 fields)
  let valuesCompleted = 0;
  const valuesTotal = 4;
  if (profile.religion) valuesCompleted++;
  if (profile.political_views) valuesCompleted++;
  if (profile.values && profile.values.length >= 3) valuesCompleted++;
  if (profile.communication_style) valuesCompleted++;
  
  // Interests & Hobbies (4 fields)
  let interestsCompleted = 0;
  const interestsTotal = 4;
  if (profile.interests && profile.interests.length >= 3) interestsCompleted++;
  if (profile.hobbies && profile.hobbies.length >= 2) interestsCompleted++;
  if (profile.creative_pursuits && profile.creative_pursuits.length >= 1) interestsCompleted++;
  if (profile.weekend_activities && profile.weekend_activities.length >= 2) interestsCompleted++;
  
  // Career & Education (5 fields)
  let careerCompleted = 0;
  const careerTotal = 5;
  if (profile.occupation && profile.occupation !== 'Not specified') careerCompleted++;
  if (profile.education && profile.education !== 'Not specified') careerCompleted++;
  if (profile.company) careerCompleted++;
  if (profile.work_life_balance) careerCompleted++;
  if (profile.career_ambitions) careerCompleted++;
  
  // Relationship Goals (5 fields)
  let relationshipCompleted = 0;
  const relationshipTotal = 5;
  if (profile.relationship_goals) relationshipCompleted++;
  if (profile.want_children) relationshipCompleted++;
  if (profile.love_language) relationshipCompleted++;
  if (profile.ideal_date) relationshipCompleted++;
  if (profile.bio && profile.bio.length > 50 && profile.bio !== 'Tell us about yourself...') relationshipCompleted++;

  // Calculate percentages
  const basicInfo = Math.round((basicInfoCompleted / basicInfoTotal) * 100);
  const lifestyle = Math.round((lifestyleCompleted / lifestyleTotal) * 100);
  const valuesAndBeliefs = Math.round((valuesCompleted / valuesTotal) * 100);
  const interestsAndHobbies = Math.round((interestsCompleted / interestsTotal) * 100);
  const careerAndEducation = Math.round((careerCompleted / careerTotal) * 100);
  const relationshipGoals = Math.round((relationshipCompleted / relationshipTotal) * 100);
  
  // Overall completion
  const totalCompleted = basicInfoCompleted + lifestyleCompleted + valuesCompleted + interestsCompleted + careerCompleted + relationshipCompleted;
  const totalPossible = basicInfoTotal + lifestyleTotal + valuesTotal + interestsTotal + careerTotal + relationshipTotal;
  const overall = Math.round((totalCompleted / totalPossible) * 100);

  return {
    basicInfo,
    lifestyle,
    valuesAndBeliefs,
    interestsAndHobbies,
    careerAndEducation,
    relationshipGoals,
    overall
  };
};

/**
 * Get user onboarding progress with comprehensive category tracking
 */
export const getUserOnboardingProgress = async (userId: string): Promise<UserOnboardingProgress & { categoryProgress: CategoryProgress }> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    // Check photos
    const { count: photoCount } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId);

    console.log('Photo count for user', userId, ':', photoCount || 0);

    // Calculate category-based progress
    const categoryProgress = calculateCategoryProgress(profile, photoCount || 0);
    
    console.log('Calculated category progress:', categoryProgress);
    
    const completedSteps = [];
    const suggestions = [];

    // Comprehensive completion tracking
    if (profile.name) completedSteps.push('name');
    if (profile.bio && profile.bio.length > 50) completedSteps.push('bio');
    if (profile.location) completedSteps.push('location');
    if (profile.occupation && profile.occupation !== 'Not specified') completedSteps.push('occupation');
    if (profile.height) completedSteps.push('height');
    if (profile.languages && profile.languages.length > 0) completedSteps.push('languages');
    if (profile.interests && profile.interests.length >= 3) completedSteps.push('interests');
    if (profile.values && profile.values.length >= 3) completedSteps.push('values');
    if (profile.hobbies && profile.hobbies.length >= 2) completedSteps.push('hobbies');
    if (profile.education && profile.education !== 'Not specified') completedSteps.push('education');
    if (profile.relationship_goals) completedSteps.push('relationship_goals');
    if (profile.exercise_habits) completedSteps.push('exercise_habits');
    if (profile.verified) completedSteps.push('verification');
    if (profile.body_type) completedSteps.push('body_type');
    if (profile.ethnicity) completedSteps.push('ethnicity');
    if (profile.religion) completedSteps.push('religion');
    if (profile.kurdistan_region) completedSteps.push('kurdistan_region');
    if (profile.dietary_preferences) completedSteps.push('dietary_preferences');
    if (profile.smoking) completedSteps.push('smoking');
    if (profile.drinking) completedSteps.push('drinking');
    if (profile.sleep_schedule) completedSteps.push('sleep_schedule');
    if (profile.have_pets) completedSteps.push('have_pets');
    if (profile.travel_frequency) completedSteps.push('travel_frequency');
    if (profile.political_views) completedSteps.push('political_views');
    if (profile.communication_style) completedSteps.push('communication_style');
    if (profile.love_language) completedSteps.push('love_language');
    if (profile.ideal_date) completedSteps.push('ideal_date');
    if (profile.creative_pursuits && profile.creative_pursuits.length >= 1) completedSteps.push('creative_pursuits');
    if (profile.weekend_activities && profile.weekend_activities.length >= 2) completedSteps.push('weekend_activities');
    if (profile.work_life_balance) completedSteps.push('work_life_balance');
    if (profile.career_ambitions) completedSteps.push('career_ambitions');

    if (photoCount && photoCount >= 1) { 
      completedSteps.push('photos');
    } else {
      suggestions.push('Add at least 1 photo to improve your profile visibility');
    }

    // Add category-specific suggestions
    if (categoryProgress.basicInfo < 80) {
      suggestions.push('Complete basic information for better matching');
    }
    if (categoryProgress.interestsAndHobbies < 70) {
      suggestions.push('Add more interests and hobbies to find compatible matches');
    }
    if (categoryProgress.lifestyle < 70) {
      suggestions.push('Share your lifestyle preferences to attract like-minded people');
    }
    if (!completedSteps.includes('verification')) {
      suggestions.push('Complete profile verification for increased trust');
    }
    if ((photoCount || 0) < 3) {
      suggestions.push('Add more photos to showcase your personality');
    }

    // Determine current step based on category progress
    let currentStep = 'profile_complete';
    if (categoryProgress.basicInfo < 100) currentStep = 'basic_info';
    else if (categoryProgress.relationshipGoals < 100) currentStep = 'relationship_goals';
    else if (categoryProgress.interestsAndHobbies < 100) currentStep = 'interests';
    else if (categoryProgress.lifestyle < 100) currentStep = 'lifestyle';
    else if (!completedSteps.includes('verification')) currentStep = 'verification';

    return {
      userId,
      completedSteps,
      currentStep,
      profileCompletion: categoryProgress.overall,
      categoryProgress,
      suggestions
    };
  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    const defaultCategoryProgress: CategoryProgress = {
      basicInfo: 0,
      lifestyle: 0,
      valuesAndBeliefs: 0,
      interestsAndHobbies: 0,
      careerAndEducation: 0,
      relationshipGoals: 0,
      overall: 0
    };
    
    return {
      userId,
      completedSteps: [],
      currentStep: 'basic_info',
      profileCompletion: 0,
      categoryProgress: defaultCategoryProgress,
      suggestions: ['Complete your profile to get started']
    };
  }
};

/**
 * Get Kurdish cultural suggestions for user profile enhancement
 */
export const getKurdishCulturalSuggestions = (): CulturalSuggestion[] => {
  return [
    {
      category: 'location',
      suggestions: [
        'Erbil, Kurdistan Region',
        'Sulaymaniyah, Kurdistan Region',
        'Duhok, Kurdistan Region',
        'Kirkuk, Iraq',
        'Diyarbakır, Turkey',
        'Qamishli, Syria',
        'Mahabad, Iran'
      ],
      description: 'Kurdistan regions and cities where Kurdish communities are prominent'
    },
    {
      category: 'language',
      suggestions: [
        'Kurdish (Kurmanji)',
        'Kurdish (Sorani)',
        'Kurdish (Pehlewani)',
        'Arabic',
        'Turkish',
        'Persian',
        'English'
      ],
      description: 'Languages commonly spoken in Kurdish communities'
    },
    {
      category: 'interest',
      suggestions: [
        'Kurdish music and folk dance',
        'Traditional Kurdish cuisine',
        'Kurdish literature and poetry',
        'Kurdish history and culture',
        'Mountain hiking and nature',
        'Traditional handicrafts',
        'Cultural festivals and celebrations'
      ],
      description: 'Interests related to Kurdish culture and traditions'
    },
    {
      category: 'value',
      suggestions: [
        'Family and community',
        'Cultural heritage preservation',
        'Hospitality and generosity',
        'Respect for elders',
        'Unity and solidarity',
        'Education and knowledge',
        'Peace and coexistence'
      ],
      description: 'Values important in Kurdish culture and society'
    }
  ];
};

/**
 * Enhance user profile with cultural suggestions
 */
export const enhanceProfileWithCulturalData = async (userId: string, culturalPreferences: any) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(culturalPreferences)
      .eq('id', userId);

    if (error) throw error;

    console.log('Profile enhanced with cultural preferences for user:', userId);
    return { success: true };
  } catch (error) {
    console.error('Error enhancing profile:', error);
    throw error;
  }
};

/**
 * Get real user engagement metrics
 */
export const getRealUserEngagement = async (userId: string) => {
  try {
    const [profileViews, likesReceived, matchesCount, messagesCount] = await Promise.all([
      // Profile views would need to be tracked separately
      Promise.resolve(0),
      
      // Likes received
      supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('likee_id', userId),
      
      // Matches
      supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`),
      
      // Messages sent
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('sender_id', userId)
    ]);

    return {
      profileViews: profileViews,
      likesReceived: likesReceived.count || 0,
      matches: matchesCount.count || 0,
      messagesSent: messagesCount.count || 0
    };
  } catch (error) {
    console.error('Error getting user engagement:', error);
    return {
      profileViews: 0,
      likesReceived: 0,
      matches: 0,
      messagesSent: 0
    };
  }
};

/**
 * Validate and suggest profile improvements
 */
export const getProfileImprovementSuggestions = (profile: any): string[] => {
  const suggestions = [];

  if (!profile.bio || profile.bio.length < 50) {
    suggestions.push('Write a longer bio (at least 50 characters) to better showcase your personality');
  }

  if (!profile.interests || profile.interests.length < 3) {
    suggestions.push('Add more interests to improve matching compatibility');
  }

  if (!profile.height || !profile.body_type) {
    suggestions.push('Complete your physical attributes for better matching');
  }

  if (!profile.languages || profile.languages.length === 0) {
    suggestions.push('Add languages you speak to connect with more people');
  }

  if (!profile.education || !profile.occupation) {
    suggestions.push('Add your education and occupation details');
  }

  if (!profile.relationship_goals) {
    suggestions.push('Specify your relationship goals to find compatible matches');
  }

  return suggestions;
};
