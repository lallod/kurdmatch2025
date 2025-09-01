import { supabase } from '@/integrations/supabase/client';
import { generateAndSaveProfiles, generateUserActivity, subscribeToProfileUpdates } from './userDataGenerator';

// Initialize auto data generation system
export const initializeAutoDataGeneration = () => {
  console.log('Initializing auto data generation system...');
  
  // Generate initial profiles if database is empty
  checkAndGenerateInitialData();
  
  // Set up real-time updates
  const unsubscribe = subscribeToProfileUpdates((payload) => {
    console.log('Real-time profile update:', payload);
    // Handle real-time updates here
  });

  // Generate new activity every 30 seconds (for demo purposes)
  const activityInterval = setInterval(() => {
    generateUserActivity().catch(console.error);
  }, 30000);

  // Clean up function
  return () => {
    unsubscribe();
    clearInterval(activityInterval);
  };
};

const checkAndGenerateInitialData = async () => {
  try {
    // Check if we have profiles
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (count === 0) {
      console.log('No profiles found, generating initial data...');
      await generateAndSaveProfiles(20);
      await generateUserActivity();
    }
  } catch (error) {
    console.error('Error checking/generating initial data:', error);
  }
};