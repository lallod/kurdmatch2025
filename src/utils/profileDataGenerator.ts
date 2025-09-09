import { supabase } from '@/integrations/supabase/client';

// Sample data for generating realistic profiles
const firstNames = {
  male: ['Ahmed', 'Omar', 'Khalil', 'Aram', 'Baran', 'Dara', 'Heval', 'Kawa', 'Rebin', 'Saman', 'Zana', 'Hersh', 'Rojhat', 'Naman', 'Dilshad'],
  female: ['Jiyan', 'Rojin', 'Dilan', 'Arin', 'Berfin', 'Helin', 'Narin', 'Rojda', 'Zagros', 'Cihan', 'Berivan', 'Hawre', 'Newroz', 'Vian', 'Sara']
};

const lastNames = ['Ahmad', 'Mahmud', 'Salih', 'Karim', 'Hassan', 'Osman', 'Bakr', 'Rashid', 'Nawroz', 'Qader', 'Aziz', 'Farid', 'Jamal', 'Nuri', 'Zaki'];

const locations = [
  'Erbil, Kurdistan', 'Sulaymaniyah, Kurdistan', 'Duhok, Kurdistan', 'Halabja, Kurdistan',
  'Qamishli, Kurdistan', 'Kobani, Kurdistan', 'Afrin, Kurdistan', 'Diyarbakir, Kurdistan',
  'London, UK', 'Berlin, Germany', 'Toronto, Canada', 'Stockholm, Sweden'
];

const occupations = [
  'Software Engineer', 'Doctor', 'Teacher', 'Business Owner', 'Artist', 'Lawyer',
  'Engineer', 'Designer', 'Marketing Manager', 'Photographer', 'Writer', 'Student',
  'Researcher', 'Consultant', 'Entrepreneur', 'Nurse', 'Architect'
];

const interests = [
  'Travel', 'Photography', 'Cooking', 'Reading', 'Music', 'Dancing', 'Hiking',
  'Art', 'Movies', 'Sports', 'Gaming', 'Fitness', 'Yoga', 'Meditation',
  'Learning Languages', 'Cultural Events', 'Traditional Music', 'Poetry'
];

const values = [
  'Family', 'Honesty', 'Respect', 'Tradition', 'Education', 'Community',
  'Cultural Heritage', 'Kindness', 'Loyalty', 'Faith', 'Freedom', 'Justice'
];

const bios = [
  "Love exploring new cultures and making meaningful connections. Family is everything to me.",
  "Passionate about preserving our Kurdish heritage while embracing modern life. Looking for someone who shares similar values.",
  "Adventure seeker with a love for traditional music and contemporary art. Let's create beautiful memories together.",
  "Believer in authentic connections and genuine conversations. Coffee dates and long walks are my favorite.",
  "Professional by day, artist by heart. Seeking someone who appreciates both ambition and creativity.",
  "Family-oriented person who loves to travel and experience different cultures. Communication is key for me."
];

const photoUrls = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b108?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544348817-5f2cf14b88c8?w=400&h=600&fit=crop&crop=face'
];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomSubset = <T>(array: T[], min: number, max: number): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const generateRandomProfile = () => {
  const gender = Math.random() > 0.5 ? 'male' : 'female';
  const firstName = getRandomElement(firstNames[gender]);
  const lastName = getRandomElement(lastNames);
  const name = `${firstName} ${lastName}`;
  
  const age = Math.floor(Math.random() * 25) + 22; // Ages 22-47
  const location = getRandomElement(locations);
  const occupation = getRandomElement(occupations);
  const bio = getRandomElement(bios);
  
  const profileData = {
    id: crypto.randomUUID(),
    name,
    age,
    gender,
    location,
    occupation,
    bio,
    verified: Math.random() > 0.3, // 70% verified
    interests: getRandomSubset(interests, 3, 6),
    values: getRandomSubset(values, 2, 4),
    height: `${Math.floor(Math.random() * 30) + 155}cm`,
    education: getRandomElement(['High School', 'Bachelor\'s', 'Master\'s', 'PhD']),
    relationship_goals: getRandomElement(['Long-term relationship', 'Marriage', 'Casual dating', 'Friendship first']),
    last_active: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    profile_image: getRandomElement(photoUrls)
  };

  return profileData;
};

export const generateMultipleProfiles = async (count: number = 50) => {
  const profiles = [];
  
  for (let i = 0; i < count; i++) {
    try {
      const profileData = generateRandomProfile();
      
      // Create user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating profile:', error);
        continue;
      }
      
      // Add profile photos
      const photoCount = Math.floor(Math.random() * 3) + 2; // 2-4 photos
      const selectedPhotos = getRandomSubset(photoUrls, photoCount, photoCount);
      
      for (let j = 0; j < selectedPhotos.length; j++) {
        await supabase
          .from('photos')
          .insert({
            profile_id: profile.id,
            url: selectedPhotos[j],
            is_primary: j === 0
          });
      }
      
      profiles.push(profile);
      
      // Add small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error('Error generating profile:', error);
    }
  }
  
  return profiles;
};