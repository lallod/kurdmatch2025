
import { generateBasicProfile } from './generators/basicProfile';
import { enrichProfileWithDetails } from './generators/profileDetails';
import { addProfilePhotos } from './generators/profilePhotos';
import { assignRole } from '../utils/roleManager';

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
    
    // Use the provided user ID or generate a new one
    const profileId = userId || crypto.randomUUID();
    console.log(`Using profile ID: ${profileId}`);

    try {
      // Step 1: Generate the basic profile (auth user + basic profile info)
      await generateBasicProfile(profileId, gender);
      
      // Step 2: Enrich the profile with additional details
      await enrichProfileWithDetails(profileId, gender);
      
      // Step 3: Add profile photos if requested
      if (withPhoto) {
        await addProfilePhotos(profileId);
      }
      
      // Step 4: Assign a random role
      await assignRole(profileId);
      
      return profileId;
    } catch (directInsertError) {
      console.error('Profile generation error:', directInsertError);
      throw directInsertError;
    }
  } catch (error) {
    console.error('Error during profile generation:', error);
    throw error;
  }
};
