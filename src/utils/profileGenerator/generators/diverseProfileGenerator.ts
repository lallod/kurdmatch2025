
import { supabase } from '@/integrations/supabase/client';
import { generateKurdishProfile } from './profileGenerator';
import { updateExistingProfiles, generateRandomUserActivity } from './profileUpdater';

/**
 * Generate a batch of diverse Kurdish profiles
 * @param count Number of profiles to generate
 * @returns An object with the count of successfully generated profiles
 */
export const generateDiverseKurdishProfiles = async (count: number = 50): Promise<{
  generatedCount: number,
  updatedCount: number,
  likesGenerated: number,
  matchesGenerated: number,
  messagesGenerated: number
}> => {
  let generatedCount = 0;
  let updatedCount = 0;
  let likesGenerated = 0;
  let matchesGenerated = 0;
  let messagesGenerated = 0;
  
  try {
    console.log(`Starting generation of ${count} diverse Kurdish profiles...`);
    
    // Generate profiles in batches for better performance
    const batchSize = 5;
    const batches = Math.ceil(count / batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
      const batchPromises = [];
      const start = batch * batchSize;
      const end = Math.min(start + batchSize, count);
      
      for (let i = start; i < end; i++) {
        // Alternate gender for diversity
        const gender = i % 2 === 0 ? 'male' : 'female';
        
        // Generate the profile
        batchPromises.push(
          generateKurdishProfile(gender, true)
            .then(id => {
              generatedCount++;
              return id;
            })
            .catch(err => {
              console.error(`Error generating profile ${i+1}:`, err);
              return null;
            })
        );
      }
      
      // Wait for batch to complete
      await Promise.allSettled(batchPromises);
      console.log(`Completed batch ${batch+1}/${batches}, generated ${generatedCount} profiles so far`);
    }
    
    // Update existing profiles with more Kurdish information
    if (generatedCount > 0) {
      console.log(`Updating profiles with richer Kurdish information...`);
      updatedCount = await updateExistingProfiles(generatedCount);
      
      // Generate activity
      console.log(`Generating realistic user activity among Kurdish profiles...`);
      const activity = await generateRandomUserActivity(generatedCount);
      likesGenerated = activity.likesGenerated;
      matchesGenerated = activity.matchesGenerated;
      messagesGenerated = activity.messagesGenerated;
    }
    
    return {
      generatedCount,
      updatedCount,
      likesGenerated,
      matchesGenerated,
      messagesGenerated
    };
  } catch (error) {
    console.error('Error in diverse profile generation:', error);
    return {
      generatedCount,
      updatedCount,
      likesGenerated,
      matchesGenerated,
      messagesGenerated
    };
  }
};
