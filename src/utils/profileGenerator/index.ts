
import { generateKurdishProfile } from './generators/profileGenerator';
import { updateExistingProfiles, generateRandomUserActivity } from './generators/profileUpdater';
import { generateDiverseKurdishProfiles } from './generators/diverseProfileGenerator';
import { 
  generateBasicProfile 
} from './generators/generators/basicProfile';
import { 
  enrichProfileWithDetails 
} from './generators/generators/profileDetails';
import { 
  addProfilePhotos 
} from './generators/generators/profilePhotos';

export {
  // Main generator functions
  generateKurdishProfile,
  updateExistingProfiles,
  generateRandomUserActivity,
  generateDiverseKurdishProfiles,
  
  // Component generator functions that can be used independently
  generateBasicProfile,
  enrichProfileWithDetails,
  addProfilePhotos
};
