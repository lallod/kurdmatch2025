
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/swipe';
import { toast } from 'sonner';

interface DatabaseProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation: string | null;
  bio: string | null;
  verified: boolean | null;
  profile_image: string | null;
  kurdistan_region: string | null;
  height: string | null;
  body_type: string | null;
  religion: string | null;
  interests: string[] | null;
  languages: string[] | null;
  relationship_goals: string | null;
  photos: { url: string; is_primary: boolean }[] | null;
  
  // Extended fields
  ethnicity: string | null;
  exercise_habits: string | null;
  have_pets: string | null;
  drinking: string | null;
  smoking: string | null;
  dietary_preferences: string | null;
  sleep_schedule: string | null;
  travel_frequency: string | null;
  transportation_preference: string | null;
  values: string[] | null;
  zodiac_sign: string | null;
  personality_type: string | null;
  political_views: string | null;
  want_children: string | null;
  children_status: string | null;
  family_closeness: string | null;
  love_language: string[] | null;
  education: string | null;
  company: string | null;
  career_ambitions: string | null;
  work_environment: string | null;
  work_life_balance: string | null;
  hobbies: string[] | null;
  creative_pursuits: string[] | null;
  weekend_activities: string[] | null;
  music_instruments: string[] | null;
  tech_skills: string[] | null;
  favorite_books: string[] | null;
  favorite_movies: string[] | null;
  favorite_music: string[] | null;
  favorite_foods: string[] | null;
  favorite_games: string[] | null;
  favorite_podcasts: string[] | null;
  dream_vacation: string | null;
  ideal_date: string | null;
  communication_style: string | null;
  growth_goals: string[] | null;
  morning_routine: string | null;
  evening_routine: string | null;
  financial_habits: string | null;
  stress_relievers: string[] | null;
  friendship_style: string | null;
  decision_making_style: string | null;
  charity_involvement: string | null;
  favorite_memory: string | null;
  favorite_quote: string | null;
  favorite_season: string | null;
  ideal_weather: string | null;
  dream_home: string | null;
  hidden_talents: string[] | null;
  pet_peeves: string[] | null;
}

export const useProfileData = () => {
  const [loading, setLoading] = useState(false);
  const [fullProfileData, setFullProfileData] = useState<Profile | null>(null);

  const fetchFullProfile = async (profileId: number) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          photos(url, is_primary)
        `)
        .eq('id', profileId.toString())
        .single();

      if (error) throw error;

      if (data) {
        // Helper function to ensure array fields are properly handled
        const ensureArray = (value: any): string[] | undefined => {
          if (!value) return undefined;
          if (Array.isArray(value)) return value;
          if (typeof value === 'string') return [value];
          return undefined;
        };

        // Transform database profile to match our comprehensive Profile interface
        const transformedProfile: Profile = {
          id: parseInt(data.id),
          name: data.name || 'Unknown',
          age: data.age || 0,
          location: data.location || 'Unknown',
          avatar: data.profile_image || '',
          distance: Math.floor(Math.random() * 50) + 1, // Mock distance for now
          compatibilityScore: Math.floor(Math.random() * 30) + 70, // Mock score
          kurdistanRegion: data.kurdistan_region || undefined,
          area: data.kurdistan_region || 'Unknown',
          
          // Basic fields with proper array handling
          interests: ensureArray(data.interests) || [],
          occupation: data.occupation || undefined,
          religion: data.religion || undefined,
          bodyType: data.body_type || undefined,
          languages: ensureArray(data.languages) || [],
          height: data.height || undefined,
          photos: data.photos?.map(p => p.url) || [data.profile_image || ''],
          bio: data.bio || undefined,
          relationshipGoals: data.relationship_goals || undefined,
          verified: data.verified || false,
          
          // Extended comprehensive fields with proper array handling
          ethnicity: data.ethnicity || undefined,
          exerciseHabits: data.exercise_habits || undefined,
          havePets: data.have_pets || undefined,
          drinking: data.drinking || undefined,
          smoking: data.smoking || undefined,
          dietaryPreferences: data.dietary_preferences || undefined,
          sleepSchedule: data.sleep_schedule || undefined,
          travelFrequency: data.travel_frequency || undefined,
          transportationPreference: data.transportation_preference || undefined,
          values: ensureArray(data.values),
          zodiacSign: data.zodiac_sign || undefined,
          personalityType: data.personality_type || undefined,
          politicalViews: data.political_views || undefined,
          wantChildren: data.want_children || undefined,
          childrenStatus: data.children_status || undefined,
          familyCloseness: data.family_closeness || undefined,
          loveLanguage: ensureArray(data.love_language),
          education: data.education || undefined,
          company: data.company || undefined,
          careerAmbitions: data.career_ambitions || undefined,
          workEnvironment: data.work_environment || undefined,
          workLifeBalance: data.work_life_balance || undefined,
          hobbies: ensureArray(data.hobbies),
          creativePursuits: ensureArray(data.creative_pursuits),
          weekendActivities: ensureArray(data.weekend_activities),
          musicInstruments: ensureArray(data.music_instruments),
          techSkills: ensureArray(data.tech_skills),
          favoriteBooks: ensureArray(data.favorite_books),
          favoriteMovies: ensureArray(data.favorite_movies),
          favoriteMusic: ensureArray(data.favorite_music),
          favoriteFoods: ensureArray(data.favorite_foods),
          favoriteGames: ensureArray(data.favorite_games),
          favoritePodcasts: ensureArray(data.favorite_podcasts),
          dreamVacation: data.dream_vacation || undefined,
          idealDate: data.ideal_date || undefined,
          communicationStyle: data.communication_style || undefined,
          growthGoals: ensureArray(data.growth_goals),
          morningRoutine: data.morning_routine || undefined,
          eveningRoutine: data.evening_routine || undefined,
          financialHabits: data.financial_habits || undefined,
          stressRelievers: ensureArray(data.stress_relievers),
          friendshipStyle: data.friendship_style || undefined,
          decisionMakingStyle: data.decision_making_style || undefined,
          charityInvolvement: data.charity_involvement || undefined,
          favoriteMemory: data.favorite_memory || undefined,
          favoriteQuote: data.favorite_quote || undefined,
          favoriteSeason: data.favorite_season || undefined,
          idealWeather: data.ideal_weather || undefined,
          dreamHome: data.dream_home || undefined,
          hiddenTalents: ensureArray(data.hidden_talents),
          petPeeves: ensureArray(data.pet_peeves)
        };

        setFullProfileData(transformedProfile);
        return transformedProfile;
      }
    } catch (error) {
      console.error('Error fetching full profile:', error);
      toast.error('Failed to load profile details');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchFullProfile,
    fullProfileData,
    loading
  };
};
