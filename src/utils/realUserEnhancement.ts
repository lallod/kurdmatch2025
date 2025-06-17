
import { supabase } from '@/integrations/supabase/client';
import { ProfileData } from '@/types/profile';

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
 * Get user onboarding progress
 */
export const getUserOnboardingProgress = async (userId: string): Promise<UserOnboardingProgress> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile) {
      throw new Error('Profile not found');
    }

    const completedSteps = [];
    const suggestions = [];
    let profileCompletion = 0;
    const totalSteps = 15;

    // Check completed profile elements
    if (profile.name) { completedSteps.push('name'); profileCompletion++; }
    if (profile.bio && profile.bio.length > 50) { completedSteps.push('bio'); profileCompletion++; }
    if (profile.location) { completedSteps.push('location'); profileCompletion++; }
    if (profile.occupation) { completedSteps.push('occupation'); profileCompletion++; }
    if (profile.height) { completedSteps.push('height'); profileCompletion++; }
    if (profile.languages && profile.languages.length > 0) { completedSteps.push('languages'); profileCompletion++; }
    if (profile.interests && profile.interests.length >= 3) { completedSteps.push('interests'); profileCompletion++; }
    if (profile.values && profile.values.length >= 3) { completedSteps.push('values'); profileCompletion++; }
    if (profile.hobbies && profile.hobbies.length >= 2) { completedSteps.push('hobbies'); profileCompletion++; }
    if (profile.education) { completedSteps.push('education'); profileCompletion++; }
    if (profile.relationship_goals) { completedSteps.push('relationship_goals'); profileCompletion++; }
    if (profile.exercise_habits) { completedSteps.push('exercise_habits'); profileCompletion++; }
    if (profile.verified) { completedSteps.push('verification'); profileCompletion++; }

    // Check photos
    const { count: photoCount } = await supabase
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('profile_id', userId);

    if (photoCount && photoCount >= 3) { 
      completedSteps.push('photos'); 
      profileCompletion++; 
    } else {
      suggestions.push('Add at least 3 photos to improve your profile visibility');
    }

    // Add suggestions based on missing elements
    if (!completedSteps.includes('bio')) {
      suggestions.push('Write a compelling bio that showcases your personality');
    }
    if (!completedSteps.includes('interests')) {
      suggestions.push('Add more interests to help with matching');
    }
    if (!completedSteps.includes('verification')) {
      suggestions.push('Complete profile verification for increased trust');
    }

    // Determine current step
    let currentStep = 'profile_complete';
    if (!completedSteps.includes('name')) currentStep = 'basic_info';
    else if (!completedSteps.includes('photos')) currentStep = 'photos';
    else if (!completedSteps.includes('bio')) currentStep = 'bio';
    else if (!completedSteps.includes('interests')) currentStep = 'interests';
    else if (!completedSteps.includes('verification')) currentStep = 'verification';

    return {
      userId,
      completedSteps,
      currentStep,
      profileCompletion: Math.round((profileCompletion / totalSteps) * 100),
      suggestions
    };
  } catch (error) {
    console.error('Error getting onboarding progress:', error);
    return {
      userId,
      completedSteps: [],
      currentStep: 'basic_info',
      profileCompletion: 0,
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

    // Log the enhancement activity
    await supabase.from('user_activities').insert({
      user_id: userId,
      activity_type: 'profile_enhancement',
      description: 'Profile enhanced with cultural preferences',
      created_at: new Date().toISOString()
    });

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
        .eq('liked_id', userId),
      
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
