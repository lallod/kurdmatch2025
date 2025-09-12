import { supabase } from '@/integrations/supabase/client';
import { getRandomElement, getRandomSubset } from '../../utils/helpers';
import { 
  heights, bodyTypes, ethnicities, religions, politicalViews, educationLevels, 
  companies, relationshipGoals, childrenStatuses, petStatuses, exerciseHabits, 
  zodiacSigns, personalityTypes, sleepSchedules, travelFrequencies, 
  communicationStyles, loveLanguages, workEnvironments, decisionStyles,
  smokingStatuses, drinkingStatuses
} from '../../data/attributes';
import { kurdishMaleNames, kurdishFemaleNames, globalMaleNames, globalFemaleNames, kurdishSurnames, globalSurnames } from '../../data/names';
import { profilePhotoUrls, maleProfilePhotoUrls, femaleProfilePhotoUrls } from '../../data/photos';
import { locations, kurdishRegions } from '../../data/locations';
import { 
  interests, hobbies, values, techSkills, musicInstruments, favoriteGames,
  favoritePodcasts, favoriteBooks, favoriteMovies, favoriteMusic, favoriteFoods,
  petPeeves, weekendActivities, growthGoals, hiddenTalents, stressRelievers
} from '../../data/interestsAndHobbies';

// Enhanced bio templates
const bioTemplates = [
  "Adventure seeker with a love for {interest1} and {hobby1}. Family means everything to me, and I believe in {value1}. Looking for someone who shares similar passions and values authentic connections.",
  
  "Passionate about {interest1} and {interest2}, you'll often find me {hobby1} on weekends. I'm a firm believer in {value1} and {value2}. Let's explore life's beautiful moments together!",
  
  "Creative soul who loves {hobby1} and {hobby2}. My friends would say I'm someone who values {value1} above all else. When I'm not working, I enjoy {interest1} and discovering new {interest2} experiences.",
  
  "Life enthusiast with a passion for {interest1}, {interest2}, and {hobby1}. I believe strongly in {value1} and {value2}. Looking for meaningful connections with someone who appreciates both adventure and quiet moments.",
  
  "Dedicated professional who finds balance through {hobby1} and {interest1}. Core values include {value1}, {value2}, and {value3}. Seeking someone special to share life's journey with authentic communication and mutual respect.",
  
  "Explorer at heart - whether it's through {interest1}, {hobby1}, or just meaningful conversations. I value {value1} and believe in building relationships based on {value2}. Coffee dates and deep talks are my favorite!",
];

const occupations = [
  'Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Artist', 'Lawyer',
  'Marketing Manager', 'Photographer', 'Writer', 'Student', 'Researcher', 'Consultant',
  'Entrepreneur', 'Nurse', 'Architect', 'Designer', 'Engineer', 'Chef', 'Musician',
  'Therapist', 'Accountant', 'Real Estate Agent', 'Journalist', 'Translator'
];

const languages = ['Kurdish', 'English', 'Arabic', 'Turkish', 'Persian', 'German', 'French', 'Spanish', 'Italian', 'Dutch', 'Swedish'];

const idealDateIdeas = [
  'Coffee and deep conversation', 'Hiking in nature', 'Cooking together', 'Art gallery visit',
  'Beach walk at sunset', 'Live music concert', 'Food festival exploration', 'Museum tour',
  'Outdoor picnic', 'Cultural event', 'Dancing', 'Movie night with homemade dinner',
  'Farmers market browsing', 'Photography walk', 'Wine tasting', 'Bookstore cafe'
];

const careerAmbitions = [
  'Building my own business', 'Making a positive impact in my community', 'Becoming a leader in my field',
  'Traveling the world while working', 'Teaching and mentoring others', 'Creating innovative solutions',
  'Achieving work-life balance', 'Pursuing creative passions', 'Making a difference in healthcare',
  'Advancing in technology', 'Writing and publishing', 'Environmental conservation'
];

const dreamVacations = [
  'Backpacking through Europe', 'Safari in Africa', 'Island hopping in Greece', 
  'Cultural tour of Japan', 'Northern lights in Iceland', 'Trekking in Nepal',
  'Road trip across America', 'Exploring ancient ruins in Peru', 'Beach resort in Maldives',
  'City break in Paris', 'Adventure in New Zealand', 'Historical tour of Kurdistan'
];

const generateRandomBio = (selectedInterests: string[], selectedHobbies: string[], selectedValues: string[]): string => {
  const template = getRandomElement(bioTemplates);
  const availableInterests = selectedInterests.length > 0 ? selectedInterests : interests;
  const availableHobbies = selectedHobbies.length > 0 ? selectedHobbies : hobbies;  
  const availableValues = selectedValues.length > 0 ? selectedValues : values;
  
  return template
    .replace('{interest1}', getRandomElement(availableInterests))
    .replace('{interest2}', getRandomElement(availableInterests))
    .replace('{hobby1}', getRandomElement(availableHobbies))
    .replace('{hobby2}', getRandomElement(availableHobbies))
    .replace('{value1}', getRandomElement(availableValues))
    .replace('{value2}', getRandomElement(availableValues))
    .replace('{value3}', getRandomElement(availableValues));
};

/**
 * Comprehensive profile enrichment with ALL available fields
 */
export const enrichAllExistingProfiles = async (): Promise<number> => {
  let enrichedCount = 0;
  
  try {
    console.log('Starting comprehensive profile enrichment...');
    
    // Get all profiles
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, name, age, gender');
      
    if (fetchError) {
      console.error('Error fetching profiles:', fetchError);
      return 0;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('No profiles found to enrich');
      return 0;
    }
    
    console.log(`Found ${profiles.length} profiles to enrich with comprehensive data`);
    
    for (const profile of profiles) {
      try {
        // Determine or assign gender
        let gender = profile.gender;
        if (!gender || gender === 'null') {
          gender = Math.random() > 0.5 ? 'male' : 'female';
        }
        
        // Generate name if needed
        let name = profile.name;
        if (!name || name === 'New User' || name === 'null') {
          const firstNames = gender === 'male' 
            ? [...kurdishMaleNames, ...globalMaleNames]
            : [...kurdishFemaleNames, ...globalFemaleNames];
          const surnames = [...kurdishSurnames, ...globalSurnames];
          name = `${getRandomElement(firstNames)} ${getRandomElement(surnames)}`;
        }
        
        // Generate age if needed
        let age = profile.age;
        if (!age || age < 18) {
          age = Math.floor(Math.random() * 30) + 22; // Ages 22-51
        }
        
        // Select photo based on gender
        const photoPool = gender === 'male' ? maleProfilePhotoUrls : femaleProfilePhotoUrls;
        const profileImage = getRandomElement(photoPool);
        
        // Generate all profile attributes
        const selectedValues = getRandomSubset(values, 3, 6);
        const selectedInterests = getRandomSubset(interests, 4, 8);
        const selectedHobbies = getRandomSubset(hobbies, 3, 6);
        
        const enrichedData = {
          name,
          age,
          gender,
          profile_image: profileImage,
          verified: Math.random() > 0.2, // 80% verified
          last_active: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          
          // Basic Info
          height: getRandomElement(heights),
          body_type: getRandomElement(bodyTypes),
          ethnicity: getRandomElement(ethnicities),
          
          // Location
          location: getRandomElement(locations),
          kurdistan_region: getRandomElement(kurdishRegions),
          
          // Languages
          languages: getRandomSubset(languages, 2, 4),
          
          // Lifestyle & Habits  
          exercise_habits: getRandomElement(exerciseHabits),
          dietary_preferences: getRandomElement(['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Halal', 'Kosher']),
          smoking: getRandomElement(smokingStatuses),
          drinking: getRandomElement(drinkingStatuses),
          sleep_schedule: getRandomElement(sleepSchedules),
          have_pets: getRandomElement(petStatuses),
          
          // Values & Personality
          religion: getRandomElement(religions),
          political_views: getRandomElement(politicalViews),
          zodiac_sign: getRandomElement(zodiacSigns),
          personality_type: getRandomElement(personalityTypes),
          values: selectedValues,
          
          // Interests & Hobbies
          interests: selectedInterests,
          hobbies: selectedHobbies,
          tech_skills: getRandomSubset(techSkills, 1, 4),
          music_instruments: getRandomSubset(musicInstruments, 0, 2),
          creative_pursuits: getRandomSubset(['Photography', 'Painting', 'Writing', 'Music', 'Design'], 1, 3),
          weekend_activities: getRandomSubset(weekendActivities, 2, 4),
          
          // Career & Education
          occupation: getRandomElement(occupations),
          education: getRandomElement(educationLevels),
          company: getRandomElement(companies),
          work_environment: getRandomElement(workEnvironments),
          work_life_balance: getRandomElement(['Excellent balance', 'Work-focused', 'Life-focused', 'Flexible approach']),
          career_ambitions: getRandomElement(careerAmbitions),
          
          // Relationship Goals & Preferences
          relationship_goals: getRandomElement(relationshipGoals),
          want_children: getRandomElement(childrenStatuses),
          family_closeness: getRandomElement(['Very close', 'Close', 'Moderately close', 'Independent']),
          love_language: getRandomElement(loveLanguages),
          communication_style: getRandomElement(communicationStyles),
          ideal_date: getRandomElement(idealDateIdeas),
          
          // Favorites
          favorite_books: getRandomSubset(favoriteBooks, 1, 3),
          favorite_movies: getRandomSubset(favoriteMovies, 1, 4),
          favorite_music: getRandomSubset(favoriteMusic, 2, 4),
          favorite_foods: getRandomSubset(favoriteFoods, 2, 5),
          favorite_games: getRandomSubset(favoriteGames, 0, 2),
          favorite_podcasts: getRandomSubset(favoritePodcasts, 0, 2),
          
          // Personal Growth & Lifestyle
          growth_goals: getRandomSubset(growthGoals, 1, 3),
          hidden_talents: getRandomSubset(hiddenTalents, 1, 2),
          stress_relievers: getRandomSubset(stressRelievers, 2, 4),
          pet_peeves: getRandomSubset(petPeeves, 1, 3),
          
          // Travel & Dreams  
          travel_frequency: getRandomElement(travelFrequencies),
          dream_vacation: getRandomElement(dreamVacations),
          favorite_season: getRandomElement(['Spring', 'Summer', 'Autumn', 'Winter']),
          
          // Generate personalized bio
          bio: generateRandomBio(selectedInterests, selectedHobbies, selectedValues)
        };
        
        // Update profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update(enrichedData)
          .eq('id', profile.id);
          
        if (updateError) {
          console.error(`Error enriching profile ${profile.id}:`, updateError);
          continue;
        }
        
        // Add photos if they don't exist
        const { data: existingPhotos } = await supabase
          .from('photos')
          .select('id')
          .eq('profile_id', profile.id);
          
        if (!existingPhotos || existingPhotos.length === 0) {
          // Add 2-4 photos per profile
          const photoCount = Math.floor(Math.random() * 3) + 2;
          const selectedPhotos = getRandomSubset(photoPool, photoCount, photoCount);
          
          for (let i = 0; i < selectedPhotos.length; i++) {
            await supabase
              .from('photos')
              .insert({
                profile_id: profile.id,
                url: selectedPhotos[i],
                is_primary: i === 0
              });
          }
        }
        
        enrichedCount++;
        if (enrichedCount % 5 === 0) {
          console.log(`Enriched ${enrichedCount} profiles...`);
        }
        
      } catch (profileError) {
        console.error(`Error enriching profile ${profile.id}:`, profileError);
      }
    }
    
    console.log(`✅ Successfully enriched ${enrichedCount} profiles with comprehensive data!`);
    return enrichedCount;
    
  } catch (error) {
    console.error('Error in comprehensive profile enrichment:', error);
    return enrichedCount;
  }
};