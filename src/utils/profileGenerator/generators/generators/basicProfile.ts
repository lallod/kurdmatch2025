
import { supabase } from '@/integrations/supabase/client';
import { 
  getRandomElement, 
  generateRandomDate 
} from '../../utils/helpers';
import { 
  kurdishMaleNames, kurdishFemaleNames, 
  globalMaleNames, globalFemaleNames,
  kurdishSurnames, globalSurnames 
} from '../../data/names';
import { locations, kurdishRegions, globalRegions } from '../../data/locations';
import { occupations } from '../../data/attributes';
import { generateBio } from '../../utils/helpers';
import { CreateDemoProfileParams } from '@/utils/supabaseTypes';

/**
 * Generate basic profile with auth user and core profile information
 * @param profileId User ID to use
 * @param gender Optional gender preference ('male', 'female', or undefined for random)
 * @returns Boolean indicating success
 */
export const generateBasicProfile = async (
  profileId: string,
  gender?: string
): Promise<boolean> => {
  try {
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
    
    // Create random dates
    const pastDate = new Date();
    pastDate.setFullYear(pastDate.getFullYear() - 2); // Up to 2 years ago
    
    const joinDate = generateRandomDate(pastDate, new Date());
    const lastActiveDate = generateRandomDate(joinDate, new Date());

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
    
    // Create the basic profile with core information
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
        bio: generateBio(firstName, isMale ? 'male' : 'female', location, occupation, age),
      })
      .select('id');
    
    if (profileError) {
      console.error('Basic profile creation failed:', profileError);
      
      // Fall back to using the RPC method
      console.log("Falling back to RPC create_demo_profile method...");
      
      const createDemoProfileParams: CreateDemoProfileParams = {
        user_id: profileId,
        user_name: fullName,
        user_age: age,
        user_location: location,
        user_gender: isMale ? 'male' : 'female',
        user_occupation: occupation
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
    } else {
      console.log('Basic profile created successfully:', profileData);
    }
    
    return true;
  } catch (error) {
    console.error('Error creating basic profile:', error);
    throw error;
  }
};
