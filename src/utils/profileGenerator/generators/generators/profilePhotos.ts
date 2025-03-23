
import { supabase } from '@/integrations/supabase/client';
import { getRandomElement } from '../../utils/helpers';
import { profilePhotoUrls } from '../../data/photos';

/**
 * Add random profile photos to a user profile
 * @param profileId User ID to add photos to
 * @param photoCount Number of photos to add (default 2)
 * @returns Boolean indicating success
 */
export const addProfilePhotos = async (
  profileId: string,
  photoCount: number = 2
): Promise<boolean> => {
  try {
    // Generate random profile photos
    const profilePhotos = [];
    
    // Add main profile photo
    profilePhotos.push(getRandomElement(profilePhotoUrls));
    
    // Add additional photos
    for (let i = 1; i < photoCount; i++) {
      let nextPhoto;
      do {
        nextPhoto = getRandomElement(profilePhotoUrls);
      } while (profilePhotos.includes(nextPhoto)); // Ensure it's different
      
      profilePhotos.push(nextPhoto);
    }
    
    // Set the first photo as the profile image
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        profile_image: profilePhotos[0]
      })
      .eq('id', profileId);
      
    if (updateError) {
      console.error('Error updating profile image:', updateError);
    }
    
    // Add all photos to the photos table
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
    
    return true;
  } catch (error) {
    console.error('Error adding profile photos:', error);
    return false;
  }
};
