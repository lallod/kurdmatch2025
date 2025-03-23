
import { supabase } from '@/integrations/supabase/client';
import { assignRole } from '../utils/roleManager';
import { getRandomElement, getRandomSubset, generateRandomDate, generateBio } from '../utils/helpers';
import { 
  kurdishMaleNames, kurdishFemaleNames, 
  globalMaleNames, globalFemaleNames,
  kurdishSurnames, globalSurnames 
} from '../data/names';
import { locations, kurdishRegions, globalRegions } from '../data/locations';
import { 
  occupations, heights, bodyTypes, ethnicities, religions, 
  politicalViews, educationLevels, companies, relationshipGoals,
  childrenStatuses, petStatuses, exerciseHabits, zodiacSigns,
  personalityTypes, sleepSchedules, travelFrequencies,
  communicationStyles, loveLanguages, workEnvironments,
  decisionStyles, smokingStatuses, drinkingStatuses
} from '../data/attributes';
import {
  values, interests, hobbies, techSkills, musicInstruments,
  favoriteGames, favoritePodcasts, favoriteBooks, favoriteMovies,
  favoriteMusic, favoriteFoods, petPeeves, weekendActivities,
  growthGoals, hiddenTalents, stressRelievers
} from '../data/interestsAndHobbies';
import { profilePhotoUrls } from '../data/photos';
import { CreateDemoProfileParams } from '@/utils/supabaseTypes';

/**
 * Generate a diverse profile and save it to the database
 * @param gender Optional gender preference ('male', 'female', or undefined for random)
 * @param withPhoto Whether to generate a random profile photo
 * @param userId Optional user ID to use (if not provided, a new UUID will be generated)
 * @returns The generated profile ID
 */
export const generateKurdishProfile = async (
  gender?: string, 
  withPhoto: boolean = true,
  userId?: string
): Promise<string> => {
  try {
    console.log(`Generating profile - Gender: ${gender || 'random'}, With photo: ${withPhoto}, User ID: ${userId || 'new'}`);
    
    // Determine gender and ethnicity
    const isMale = gender ? gender === 'male' : Math.random() > 0.5;
    const isKurdish = Math.random() > 0.5; // 50% chance of Kurdish, 50% global
    
    // Select appropriate name lists based on ethnicity
    const firstNameList = isKurdish 
      ? (isMale ? kurdishMaleNames : kurdishFemaleNames)
      : (isMale ? globalMaleNames : globalFemaleNames);
    
    const surnameList = isKurdish ? kurdishSurnames : globalSurnames;
    
    const firstName = getRandomElement(firstNameList);
    const lastName = getRandomElement(surnameList);
    const fullName = `${firstName} ${lastName}`;
    
    // Generate location and region
    const isKurdishLocation = isKurdish || Math.random() > 0.7; // Kurdish profiles or 30% chance for others
    const location = isKurdishLocation 
      ? getRandomElement(locations.filter(loc => loc.includes('Kurdistan')))
      : getRandomElement(locations.filter(loc => !loc.includes('Kurdistan')));
    
    const region = isKurdish 
      ? getRandomElement(kurdishRegions)
      : getRandomElement(globalRegions);
    
    const occupation = getRandomElement(occupations);
    const age = Math.floor(Math.random() * 42) + 18; // Age between 18-60
    
    // Generate random profile photos
    const profilePhotos = [];
    if (withPhoto) {
      // Main profile photo
      profilePhotos.push(getRandomElement(profilePhotoUrls));
      
      // Add a second photo with a different URL
      let secondPhoto;
      do {
        secondPhoto = getRandomElement(profilePhotoUrls);
      } while (secondPhoto === profilePhotos[0]); // Ensure it's different
      
      profilePhotos.push(secondPhoto);
    }
    
    // Use the provided user ID or generate a new one
    const profileId = userId || crypto.randomUUID();
    console.log(`Using profile ID: ${profileId} for ${fullName}`);

    // Create random dates
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 2); // Up to 2 years ago
    
    const joinDate = generateRandomDate(pastDate, new Date());
    const lastActiveDate = generateRandomDate(joinDate, new Date());

    try {
      // Check if the auth user exists before trying to create a profile
      const { data: authUserExists, error: authCheckError } = await supabase.auth
        .admin.getUserById(profileId);

      if (authCheckError || !authUserExists) {
        console.log("Auth user doesn't exist or couldn't be verified. Creating auth user first...");
        
        // Create a dummy auth user for this profile ID
        const email = `${profileId.slice(0, 8)}@example.com`;
        const { data: authUser, error: authError } = await supabase.rpc(
          'create_dummy_auth_user',
          { 
            email: email,
            user_uuid: profileId
          }
        );
        
        if (authError) {
          console.error("Failed to create auth user:", authError);
          throw new Error(`Auth user creation failed: ${authError.message}`);
        }
        
        console.log("Auth user created successfully");
      }
      
      // Now create the profile with all the random data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: profileId,
          name: fullName,
          age,
          gender: isMale ? 'male' : 'female',
          location,
          kurdistan_region: isKurdish ? region : null,
          occupation,
          verified: Math.random() > 0.3, // 70% verified
          last_active: lastActiveDate.toISOString(),
          created_at: joinDate.toISOString(),
          profile_image: profilePhotos[0], // Primary profile image
          bio: generateBio(firstName, isMale ? 'male' : 'female', location, occupation, age),
          height: getRandomElement(heights),
          body_type: getRandomElement(bodyTypes),
          ethnicity: isKurdish ? getRandomElement(ethnicities.filter(e => e.includes('Kurdish'))) : getRandomElement(ethnicities.filter(e => !e.includes('Kurdish'))),
          religion: getRandomElement(religions),
          political_views: getRandomElement(politicalViews),
          education: getRandomElement(educationLevels),
          company: isKurdish ? getRandomElement(companies.filter(c => c.includes('Kurdistan'))) : getRandomElement(companies.filter(c => !c.includes('Kurdistan'))),
          relationship_goals: getRandomElement(relationshipGoals),
          want_children: getRandomElement(childrenStatuses),
          have_pets: getRandomElement(petStatuses),
          exercise_habits: getRandomElement(exerciseHabits),
          zodiac_sign: getRandomElement(zodiacSigns),
          personality_type: getRandomElement(personalityTypes),
          sleep_schedule: getRandomElement(sleepSchedules),
          travel_frequency: getRandomElement(travelFrequencies),
          communication_style: getRandomElement(communicationStyles),
          love_language: getRandomElement(loveLanguages),
          work_environment: getRandomElement(workEnvironments),
          decision_making_style: getRandomElement(decisionStyles),
          smoking: getRandomElement(smokingStatuses),
          drinking: getRandomElement(drinkingStatuses),
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
        .select('id');
      
      if (profileError) {
        console.error('Direct insert failed, error:', profileError);
        throw new Error(`Profile direct insert failed: ${profileError.message}`);
      }

      console.log('Profile created via direct insert:', profileData);
      
      // Add the profile photos to the photos table
      if (withPhoto && profilePhotos.length > 0) {
        for (let i = 0; i < profilePhotos.length; i++) {
          const { error: photoError } = await supabase
            .from('photos')
            .insert({
              profile_id: profileId,
              url: profilePhotos[i],
              is_primary: i === 0 // First photo is primary
            });
            
          if (photoError) {
            console.error(`Error adding photo ${i+1}:`, photoError);
          } else {
            console.log(`Added photo ${i+1} for profile ${profileId}`);
          }
        }
      }
      
      // Assign a random role
      await assignRole(profileId);
      
      return profileId;
    } catch (directInsertError) {
      console.error('Direct insert error:', directInsertError);
      
      // Fall back to using the RPC method
      console.log("Falling back to RPC create_demo_profile method...");
      
      const createDemoProfileParams: CreateDemoProfileParams = {
        user_id: profileId,
        user_name: fullName,
        user_age: age,
        user_location: location,
        user_gender: isMale ? 'male' : 'female',
        user_occupation: occupation,
        user_profile_image: profilePhotos[0] || undefined
      };
      
      const { data: rpcData, error: rpcError } = await supabase.rpc(
        'create_demo_profile',
        createDemoProfileParams
      );
      
      if (rpcError) {
        console.error('RPC method failed:', rpcError);
        throw new Error(`Both direct insert and RPC methods failed: ${rpcError.message}`);
      }
      
      console.log('Profile created via RPC:', rpcData);
      
      // Still try to add photos
      if (withPhoto && profilePhotos.length > 0) {
        for (let i = 0; i < profilePhotos.length; i++) {
          const { error: photoError } = await supabase
            .from('photos')
            .insert({
              profile_id: profileId,
              url: profilePhotos[i],
              is_primary: i === 0 // First photo is primary
            });
            
          if (photoError) {
            console.error(`Error adding photo ${i+1}:`, photoError);
          } else {
            console.log(`Added photo ${i+1} for profile ${profileId}`);
          }
        }
      }
      
      // Assign a random role
      await assignRole(profileId);
      
      return profileId;
    }
  } catch (error) {
    console.error('Error during profile generation:', error);
    throw error;
  }
};
