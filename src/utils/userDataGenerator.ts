import { supabase } from '@/integrations/supabase/client';

// Auto-generate comprehensive user data
const generateRandomProfile = () => {
  const names = [
    'Ava', 'Sarah', 'Emma', 'Olivia', 'Isabella', 'Sophia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
    'Liam', 'Noah', 'Oliver', 'William', 'Elijah', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander'
  ];

  const locations = [
    'Erbil, Kurdistan', 'Sulaymaniyah, Kurdistan', 'Dohuk, Kurdistan', 'Zakho, Kurdistan',
    'Koya, Kurdistan', 'Rania, Kurdistan', 'Shaqlawa, Kurdistan', 'Halabja, Kurdistan'
  ];

  const occupations = [
    'Software Engineer', 'Doctor', 'Teacher', 'Designer', 'Marketing Manager', 'Nurse',
    'Engineer', 'Business Analyst', 'Photographer', 'Writer', 'Chef', 'Lawyer'
  ];

  const interests = [
    'Reading', 'Photography', 'Hiking', 'Cooking', 'Music', 'Travel', 'Art', 'Sports',
    'Dancing', 'Movies', 'Gaming', 'Fitness', 'Language Learning', 'Technology'
  ];

  const languages = [
    'Kurdish', 'Arabic', 'English', 'Turkish', 'Persian', 'German', 'French', 'Spanish'
  ];

  const hobbies = [
    'Painting', 'Guitar', 'Yoga', 'Swimming', 'Rock Climbing', 'Chess', 'Gardening',
    'Meditation', 'Cycling', 'Pottery', 'Writing', 'Volunteering'
  ];

  const name = names[Math.floor(Math.random() * names.length)];
  const age = Math.floor(Math.random() * 15) + 25; // 25-40
  const location = locations[Math.floor(Math.random() * locations.length)];
  const occupation = occupations[Math.floor(Math.random() * occupations.length)];

  // Generate random selections
  const profileInterests = interests
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 5) + 3);

  const profileLanguages = languages
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 2);

  const profileHobbies = hobbies
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 4) + 2);

  // Generate bio based on profile data
  const bio = `${name} is a ${age}-year-old ${occupation.toLowerCase()} from ${location}. I love ${profileInterests.slice(0, 3).join(', ')}, and I'm passionate about connecting with people who share similar values and interests.`;

  return {
    name,
    age,
    location,
    occupation,
    bio,
    interests: profileInterests,
    languages: profileLanguages,
    hobbies: profileHobbies,
    height: `${Math.floor(Math.random() * 25) + 160}cm`,
    verified: Math.random() > 0.3,
    profile_image: `https://picsum.photos/400/600?random=${Math.random()}`,
    kurdistan_region: location.includes('Kurdistan') ? 'South-Kurdistan' : null,
    relationship_goals: ['Long-term relationship', 'Something casual', 'New friends', 'Not sure yet'][Math.floor(Math.random() * 4)],
    education: ['High School', 'Bachelor Degree', 'Master Degree', 'PhD'][Math.floor(Math.random() * 4)],
    body_type: ['Slim', 'Athletic', 'Average', 'Curvy'][Math.floor(Math.random() * 4)],
    drinking: ['Never', 'Rarely', 'Socially', 'Regularly'][Math.floor(Math.random() * 4)],
    smoking: ['Never', 'Rarely', 'Socially', 'Regularly'][Math.floor(Math.random() * 4)],
    religion: ['Muslim', 'Christian', 'Other', 'Not religious'][Math.floor(Math.random() * 4)],
    zodiac_sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][Math.floor(Math.random() * 12)]
  };
};

export const generateAndSaveProfiles = async (count: number = 10) => {
  const profiles = [];
  
  for (let i = 0; i < count; i++) {
    const profile = generateRandomProfile();
    profiles.push(profile);
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profiles)
      .select();

    if (error) throw error;

    console.log(`Generated ${profiles.length} profiles successfully`);
    return data;
  } catch (error) {
    console.error('Error generating profiles:', error);
    throw error;
  }
};

// Real-time profile updates
export const subscribeToProfileUpdates = (onUpdate: (payload: any) => void) => {
  const channel = supabase
    .channel('profile-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles'
      },
      onUpdate
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

// Auto-generate user activity (likes, messages)
export const generateUserActivity = async () => {
  // Get all profile IDs
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id')
    .limit(50);

  if (!profiles || profiles.length < 2) return;

  // Generate some likes
  const likes = [];
  for (let i = 0; i < 20; i++) {
    const liker = profiles[Math.floor(Math.random() * profiles.length)];
    const likee = profiles[Math.floor(Math.random() * profiles.length)];
    
    if (liker.id !== likee.id) {
      likes.push({
        liker_id: liker.id,
        likee_id: likee.id
      });
    }
  }

  try {
    await supabase.from('likes').insert(likes);
    console.log('Generated user activity successfully');
  } catch (error) {
    console.error('Error generating user activity:', error);
  }
};