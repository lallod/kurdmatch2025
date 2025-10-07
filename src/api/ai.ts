import { supabase } from '@/integrations/supabase/client';

export interface IcebreakerResponse {
  icebreakers: string[];
}

export interface MatchScoreResponse {
  score: number;
  breakdown: {
    interests: number;
    values: number;
    lifestyle: number;
    goals: number;
  };
  commonalities: string[];
  reasoning: string;
}

export interface PhotoModerationResponse {
  approved: boolean;
  reason?: string;
  confidence: number;
  flags: string[];
}

/**
 * Generate AI-powered conversation starters for a matched user
 */
export const generateIcebreakers = async (matchedUserId: string): Promise<IcebreakerResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-icebreakers', {
      body: { matchedUserId }
    });

    if (error) {
      console.error('Error generating icebreakers:', error);
      throw error;
    }

    return data as IcebreakerResponse;
  } catch (error) {
    console.error('Failed to generate icebreakers:', error);
    throw error;
  }
};

/**
 * Calculate AI-powered compatibility match score with another user
 */
export const calculateMatchScore = async (otherUserId: string): Promise<MatchScoreResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('calculate-match-score', {
      body: { otherUserId }
    });

    if (error) {
      console.error('Error calculating match score:', error);
      throw error;
    }

    return data as MatchScoreResponse;
  } catch (error) {
    console.error('Failed to calculate match score:', error);
    throw error;
  }
};

/**
 * Moderate a photo using AI vision analysis
 */
export const moderatePhoto = async (photoUrl: string, photoId?: string): Promise<PhotoModerationResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('moderate-photo', {
      body: { photoUrl, photoId }
    });

    if (error) {
      console.error('Error moderating photo:', error);
      throw error;
    }

    return data as PhotoModerationResponse;
  } catch (error) {
    console.error('Failed to moderate photo:', error);
    throw error;
  }
};

/**
 * Generate an AI bio for a user profile
 */
export const generateBio = async (profileId: string): Promise<{ bio: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-bio', {
      body: { profileId }
    });

    if (error) {
      console.error('Error generating bio:', error);
      throw error;
    }

    return data as { bio: string };
  } catch (error) {
    console.error('Failed to generate bio:', error);
    throw error;
  }
};
