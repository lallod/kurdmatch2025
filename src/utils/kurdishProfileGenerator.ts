
import { supabase } from '@/integrations/supabase/client';

// Kurdish names and data for generating realistic profiles
const kurdishMaleNames = ['Azad', 'Dilshad', 'Rojhat', 'Heval', 'Kawa', 'Rizgar', 'Sherko', 'Baran', 'Soran', 'Hawar', 
  'Aram', 'Zana', 'Rebin', 'Hogir', 'Xebat', 'Jiyan', 'Serhat', 'Rebaz', 'Berwer', 'Hiwa', 
  'Diyar', 'Welat', 'Brusk', 'Agir', 'Karwan'];

const kurdishFemaleNames = ['Rojin', 'Berfin', 'Zilan', 'Shilan', 'Avesta', 'Berivan', 'Runak', 'Helin', 'Nazdar', 'Delal', 
  'Jinda', 'Soma', 'Havin', 'Dilan', 'Viyan', 'Tara', 'Ruken', 'Sherin', 'Narin', 'Rojda', 
  'Zerin', 'Perwin', 'Rojbin', 'Nesrin', 'Hevi'];

const kurdishSurnames = ['Ahmadi', 'Barzani', 'Talabani', 'Kurdi', 'Shekaki', 'Zaza', 'Hawrami', 'Dizayi', 'Bajalan', 'Zangana',
  'Jaf', 'Zerdeşt', 'Qazi', 'Korani', 'Hewrami', 'Baban', 'Sorani', 'Badini', 'Botani', 'Peshmerga'];

const kurdishLocations = [
  'Erbil, Kurdistan', 'Sulaymaniyah, Kurdistan', 'Duhok, Kurdistan', 'Halabja, Kurdistan',
  'Qamishli, Kurdistan', 'Kobani, Kurdistan', 'Afrin, Kurdistan', 'Diyarbakir, Kurdistan',
  'Sanandaj, Kurdistan', 'Mahabad, Kurdistan', 'Kirmanshah, Kurdistan', 'Mardin, Kurdistan',
  'Van, Kurdistan', 'Urmia, Kurdistan', 'Zakho, Kurdistan', 'Slemani, Kurdistan',
  'Hewlêr, Kurdistan', 'Kirkuk, Kurdistan', 'Amedi, Kurdistan', 'Akre, Kurdistan'
];

const kurdishRegions = ['South-Kurdistan', 'West-Kurdistan', 'East-Kurdistan', 'North-Kurdistan'];

const occupations = ['Student', 'Teacher', 'Engineer', 'Doctor', 'Business Owner', 'Artist', 'Musician', 'Writer', 'Journalist', 'Developer',
  'Farmer', 'Shopkeeper', 'Craftsman', 'Photographer', 'Chef', 'Driver', 'Translator', 'Activist', 'Social Worker', 'Nurse'];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Generate a Kurdish profile and save it to the database
 * @param gender Optional gender preference ('male', 'female', or undefined for random)
 * @param withPhoto Whether to generate a random profile photo
 * @returns The generated profile ID
 */
export const generateKurdishProfile = async (gender?: string, withPhoto: boolean = true): Promise<string> => {
  const isMale = gender ? gender === 'male' : Math.random() > 0.5;
  const firstName = isMale 
    ? getRandomElement(kurdishMaleNames)
    : getRandomElement(kurdishFemaleNames);
  
  const lastName = getRandomElement(kurdishSurnames);
  const fullName = `${firstName} ${lastName}`;
  const location = getRandomElement(kurdishLocations);
  const kurdistanRegion = getRandomElement(kurdishRegions);
  const occupation = getRandomElement(occupations);
  const age = Math.floor(Math.random() * 42) + 18; // Age between 18-60
  const verified = Math.random() > 0.3; // 70% verified
  const role = Math.random() > 0.8 ? 'admin' : 
              Math.random() > 0.7 ? 'moderator' : 
              Math.random() > 0.6 ? 'premium' : 'user';
  
  // Generate a random profile image using a placeholder service based on gender
  const avatarSeed = Math.random().toString(36).substring(2, 8);
  const profileImage = withPhoto 
    ? `https://i.pravatar.cc/300?u=${avatarSeed}` 
    : undefined;
  
  const userId = crypto.randomUUID();
  
  // Random interests and languages
  const interests = [];
  const possibleInterests = ['Music', 'Reading', 'Travel', 'Food', 'Sports', 'Art', 'Photography', 'Nature', 'Technology', 
    'History', 'Culture', 'Language', 'Dance', 'Film', 'Poetry', 'Politics', 'Hiking', 'Cooking'];
  const interestCount = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i < interestCount; i++) {
    const interest = getRandomElement(possibleInterests);
    if (!interests.includes(interest)) {
      interests.push(interest);
    }
  }
  
  const languages = ['Kurdish'];
  if (Math.random() > 0.5) languages.push('English');
  if (Math.random() > 0.7) languages.push('Arabic');
  if (Math.random() > 0.8) languages.push('Farsi');
  
  try {
    // Insert profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        name: fullName,
        age,
        location,
        kurdistan_region: kurdistanRegion,
        occupation,
        verified,
        last_active: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 30 days
        profile_image: profileImage,
        bio: `Kurdish ${isMale ? 'male' : 'female'} from ${kurdistanRegion}, interested in Kurdish culture and heritage.`,
        languages,
        interests,
        gender: isMale ? 'male' : 'female',
      });
    
    if (profileError) {
      console.error('Error creating Kurdish profile:', profileError.message);
      throw profileError;
    }
    
    // Add role for this user
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role
      });
    
    if (roleError) {
      console.error('Error creating role for Kurdish profile:', roleError.message);
      throw roleError;
    }
    
    return userId;
  } catch (error) {
    console.error('Error during profile generation:', error);
    throw error;
  }
};
