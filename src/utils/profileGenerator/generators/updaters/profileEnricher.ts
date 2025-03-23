
import { supabase } from '@/integrations/supabase/client';
import { getRandomElement, getRandomSubset } from '../../utils/helpers';
import { 
  heights, bodyTypes, ethnicities, religions, 
  politicalViews, educationLevels, companies, relationshipGoals,
  childrenStatuses, petStatuses, exerciseHabits, zodiacSigns
} from '../../data/attributes';
import { profilePhotoUrls } from '../../data/photos';
import { locations, kurdishRegions } from '../../data/locations';
import { 
  interests, hobbies, values, 
  favoriteBooks, favoriteMovies, favoriteMusic, favoriteFoods 
} from '../../data/interestsAndHobbies';

/**
 * Update existing profiles with more diverse information and photos
 * @param count Number of profiles to update
 */
export const updateExistingProfiles = async (count: number = 100): Promise<number> => {
  let updatedCount = 0;
  
  try {
    // Get profiles that need updating
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .limit(count);
      
    if (fetchError) {
      console.error('Error fetching profiles to update:', fetchError);
      return 0;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('No profiles found to update');
      return 0;
    }
    
    console.log(`Found ${profiles.length} profiles to update with more information`);
    
    // Update each profile with more diverse information
    for (const profile of profiles) {
      try {
        // Get random photos
        const photoUrls = [];
        photoUrls.push(getRandomElement(profilePhotoUrls));
        
        let secondPhoto;
        do {
          secondPhoto = getRandomElement(profilePhotoUrls);
        } while (secondPhoto === photoUrls[0]);
        photoUrls.push(secondPhoto);
        
        // Generate a random date within the last 7 days for last_active
        const now = new Date();
        const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const lastActive = new Date(lastWeek.getTime() + Math.random() * (now.getTime() - lastWeek.getTime()));
        
        // Generate a join date between 1 month and 2 years ago
        const twoYearsAgo = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const joinDate = new Date(twoYearsAgo.getTime() + Math.random() * (oneMonthAgo.getTime() - twoYearsAgo.getTime()));
        
        // Update the profile with rich information
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            profile_image: photoUrls[0],
            verified: true, // Make all users active/verified
            last_active: lastActive.toISOString(),
            created_at: joinDate.toISOString(),
            height: getRandomElement(heights),
            body_type: getRandomElement(bodyTypes),
            ethnicity: getRandomElement(ethnicities),
            religion: getRandomElement(religions),
            political_views: getRandomElement(politicalViews),
            education: getRandomElement(educationLevels),
            company: getRandomElement(companies),
            relationship_goals: getRandomElement(relationshipGoals),
            want_children: getRandomElement(childrenStatuses),
            have_pets: getRandomElement(petStatuses),
            exercise_habits: getRandomElement(exerciseHabits),
            zodiac_sign: getRandomElement(zodiacSigns),
            location: getRandomElement(locations),
            kurdistan_region: Math.random() > 0.5 ? getRandomElement(kurdishRegions) : null,
            bio: `A unique individual with a passion for life and connecting with others. Active member of the community looking for meaningful connections.`,
            values: getRandomSubset(values, 3, 6),
            interests: getRandomSubset(interests, 3, 8),
            hobbies: getRandomSubset(hobbies, 2, 5),
            favorite_books: getRandomSubset(favoriteBooks, 1, 4),
            favorite_movies: getRandomSubset(favoriteMovies, 1, 4),
            favorite_music: getRandomSubset(favoriteMusic, 2, 5),
            favorite_foods: getRandomSubset(favoriteFoods, 2, 5),
          })
          .eq('id', profile.id);
          
        if (updateError) {
          console.error(`Error updating profile ${profile.id}:`, updateError);
          continue;
        }
        
        // Check if photos already exist
        const { data: existingPhotos, error: photosCheckError } = await supabase
          .from('photos')
          .select('id')
          .eq('profile_id', profile.id);
          
        if (photosCheckError) {
          console.error(`Error checking photos for profile ${profile.id}:`, photosCheckError);
        }
        
        // If photos don't exist, add them
        if (!existingPhotos || existingPhotos.length === 0) {
          for (let i = 0; i < photoUrls.length; i++) {
            const { error: photoError } = await supabase
              .from('photos')
              .insert({
                profile_id: profile.id,
                url: photoUrls[i],
                is_primary: i === 0
              });
              
            if (photoError) {
              console.error(`Error adding photo ${i+1} for profile ${profile.id}:`, photoError);
            }
          }
        }
        
        updatedCount++;
        if (updatedCount % 10 === 0) {
          console.log(`Updated ${updatedCount} profiles so far...`);
        }
      } catch (profileError) {
        console.error(`Error updating profile ${profile.id}:`, profileError);
      }
    }
    
    console.log(`Successfully updated ${updatedCount} profiles with more information and photos`);
    return updatedCount;
  } catch (error) {
    console.error('Error in bulk profile update:', error);
    return updatedCount;
  }
};
