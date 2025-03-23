
import { supabase } from '@/integrations/supabase/client';
import { getRandomElement, getRandomSubset } from '../../utils/helpers';
import { 
  heights, bodyTypes, ethnicities, religions, 
  politicalViews, educationLevels, companies, relationshipGoals,
  childrenStatuses, petStatuses, exerciseHabits, zodiacSigns,
  personalityTypes, sleepSchedules, travelFrequencies,
  communicationStyles, loveLanguages, workEnvironments,
  decisionStyles, smokingStatuses, drinkingStatuses
} from '../../data/attributes';
import {
  values, interests, hobbies, techSkills, musicInstruments,
  favoriteGames, favoritePodcasts, favoriteBooks, favoriteMovies,
  favoriteMusic, favoriteFoods, petPeeves, weekendActivities,
  growthGoals, hiddenTalents, stressRelievers
} from '../../data/interestsAndHobbies';
import { locations } from '../../data/locations';

/**
 * Enrich profile with additional details and preferences
 * @param profileId User ID to enrich
 * @param gender Gender of the profile for consistent enrichment
 * @returns Boolean indicating success
 */
export const enrichProfileWithDetails = async (
  profileId: string,
  gender?: string
): Promise<boolean> => {
  try {
    // Determine if profile is Kurdish based on gender for consistency
    const isMale = gender ? gender === 'male' : Math.random() > 0.5;
    const isKurdish = Math.random() > 0.5; // Keep consistent with the basic profile

    // Get current profile to ensure we don't override the basic details
    const { data: profile, error: profileFetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single();
      
    if (profileFetchError) {
      console.error('Error fetching profile for enrichment:', profileFetchError);
      throw profileFetchError;
    }

    // Now enrich the profile with more detailed information
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        // Personal attributes
        height: getRandomElement(heights),
        body_type: getRandomElement(bodyTypes),
        ethnicity: isKurdish ? getRandomElement(ethnicities.filter(e => e.includes('Kurdish'))) : getRandomElement(ethnicities.filter(e => !e.includes('Kurdish'))),
        religion: getRandomElement(religions),
        political_views: getRandomElement(politicalViews),
        education: getRandomElement(educationLevels),
        company: isKurdish ? getRandomElement(companies.filter(c => c.includes('Kurdistan'))) : getRandomElement(companies.filter(c => !c.includes('Kurdistan'))),
        
        // Relationship preferences
        relationship_goals: getRandomElement(relationshipGoals),
        want_children: getRandomElement(childrenStatuses),
        have_pets: getRandomElement(petStatuses),
        
        // Lifestyle choices
        exercise_habits: getRandomElement(exerciseHabits),
        zodiac_sign: getRandomElement(zodiacSigns),
        personality_type: getRandomElement(personalityTypes),
        sleep_schedule: getRandomElement(sleepSchedules),
        travel_frequency: getRandomElement(travelFrequencies),
        
        // Communication and relationship styles
        communication_style: getRandomElement(communicationStyles),
        love_language: getRandomElement(loveLanguages),
        work_environment: getRandomElement(workEnvironments),
        decision_making_style: getRandomElement(decisionStyles),
        smoking: getRandomElement(smokingStatuses),
        drinking: getRandomElement(drinkingStatuses),
        
        // Multi-select fields and preferences
        values: getRandomSubset(values, 3, 6),
        interests: getRandomSubset(interests, 3, 8),
        hobbies: getRandomSubset(hobbies, 2, 5),
        languages: isKurdish ? ['Kurdish', ...getRandomSubset(['English', 'Arabic', 'Persian', 'Turkish'], 0, 2)] : getRandomSubset(['English', 'Spanish', 'French', 'German', 'Mandarin', 'Arabic', 'Hindi'], 1, 3),
        tech_skills: Math.random() > 0.5 ? getRandomSubset(techSkills, 1, 4) : [],
        music_instruments: Math.random() > 0.6 ? getRandomSubset(musicInstruments, 1, 3) : [],
        favorite_games: Math.random() > 0.6 ? getRandomSubset(favoriteGames, 1, 3) : [],
        favorite_podcasts: Math.random() > 0.5 ? getRandomSubset(favoritePodcasts, 1, 3) : [],
        favorite_books: getRandomSubset(favoriteBooks, 1, 4),
        favorite_movies: getRandomSubset(favoriteMovies, 1, 4),
        favorite_music: getRandomSubset(favoriteMusic, 2, 5),
        favorite_foods: getRandomSubset(favoriteFoods, 2, 5),
        pet_peeves: Math.random() > 0.6 ? getRandomSubset(petPeeves, 1, 3) : [],
        weekend_activities: Math.random() > 0.7 ? getRandomSubset(weekendActivities, 1, 3) : [],
        growth_goals: Math.random() > 0.6 ? getRandomSubset(growthGoals, 1, 3) : [],
        hidden_talents: Math.random() > 0.7 ? getRandomSubset(hiddenTalents, 1, 2) : [],
        stress_relievers: Math.random() > 0.6 ? getRandomSubset(stressRelievers, 1, 3) : [],
        
        // Free text fields with conditional generation
        favorite_memory: Math.random() > 0.6 ? `A memorable experience in ${getRandomElement(locations)}` : null,
        dream_vacation: Math.random() > 0.7 ? `Exploring ${getRandomElement(['more of Kurdistan', 'Europe', 'Americas', 'Asia', 'historical sites', 'tropical islands', 'mountain regions'])}` : null,
        favorite_quote: Math.random() > 0.7 ? `"${getRandomElement(['Life is what happens when you\'re busy making other plans', 'Be the change you wish to see in the world', 'The journey of a thousand miles begins with a single step', 'Nothing is permanent except change'])}"` : null,
        dream_home: Math.random() > 0.7 ? `A ${getRandomElement(['traditional', 'modern', 'cozy', 'spacious'])} home in ${getRandomElement(locations)}` : null,
        transportation_preference: Math.random() > 0.6 ? getRandomElement(['Car', 'Public transport', 'Walking when possible', 'Bicycle', 'Combination of methods']) : null,
        charity_involvement: Math.random() > 0.7 ? `Supporting ${getRandomElement(['cultural preservation', 'education initiatives', 'humanitarian efforts', 'environmental causes', 'community development'])}` : null,
        financial_habits: Math.random() > 0.7 ? getRandomElement(['Careful planner', 'Balanced spender/saver', 'Generous with resources', 'Investment-focused', 'Living in the moment']) : null,
        morning_routine: Math.random() > 0.6 ? `${getRandomElement(['Early riser', 'Leisurely morning', 'Quick start'])} with ${getRandomElement(['coffee', 'tea', 'exercise', 'reading'])}` : null,
        evening_routine: Math.random() > 0.6 ? `${getRandomElement(['Reading', 'Family time', 'Cultural activities', 'Relaxing', 'Preparing for tomorrow'])}` : null,
        ideal_date: Math.random() > 0.6 ? getRandomElement(['Cultural exploration', 'Outdoor adventure', 'Quiet conversation', 'Dinner and music', 'Something active and engaging']) : null,
        favorite_season: Math.random() > 0.7 ? getRandomElement(['Spring', 'Summer', 'Fall', 'Winter']) : null,
        ideal_weather: Math.random() > 0.7 ? getRandomElement(['Warm and sunny', 'Cool and breezy', 'Mild with occasional rain', 'Crisp mountain air']) : null,
        family_closeness: Math.random() > 0.6 ? getRandomElement(['Very close to family', 'Balanced family relationship', 'Independent but connected', 'Building chosen family']) : null,
        friendship_style: Math.random() > 0.6 ? getRandomElement(['Few close friends', 'Wide social circle', 'Mix of close and casual friendships', 'Values deep connections']) : null,
      })
      .eq('id', profileId);
    
    if (updateError) {
      console.error('Error enriching profile with details:', updateError);
      throw updateError;
    }
    
    console.log(`Profile ${profileId} enriched with detailed information`);
    return true;
  } catch (error) {
    console.error('Error during profile enrichment:', error);
    throw error;
  }
};
