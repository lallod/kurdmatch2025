
import { supabase } from '@/integrations/supabase/client';
import { CreateDemoProfileParams } from './supabaseTypes';

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

const heights = ['5\'2"', '5\'3"', '5\'4"', '5\'5"', '5\'6"', '5\'7"', '5\'8"', '5\'9"', '5\'10"', '5\'11"', '6\'0"', '6\'1"', '6\'2"', '6\'3"'];
const bodyTypes = ['Athletic', 'Average', 'Slim', 'Muscular', 'Curvy', 'Full figured'];
const ethnicities = ['Kurdish', 'Kurdish-Persian', 'Kurdish-Turkish', 'Kurdish-Arab', 'Kurdish-Armenian'];
const religions = ['Islam', 'Yarsanism', 'Yazidism', 'Zoroastrianism', 'Christianity', 'Spiritual', 'Non-religious'];
const politicalViews = ['Progressive', 'Liberal', 'Moderate', 'Conservative', 'Political activist', 'Apolitical'];
const educationLevels = ['High School', 'Bachelors Degree', 'Masters Degree', 'PhD', 'Trade School', 'Self-educated'];
const companies = ['Kurdistan University', 'Korek Telecom', 'Asiacell', 'Newroz Telecom', 'Kurdsat', 'Rudaw Media', 'Kurdistan 24', 'Local Business Owner', 'Freelancer'];
const relationshipGoals = ['Long-term relationship', 'Marriage', 'Friendship first', 'Taking things slow', 'Seeking connection'];
const childrenStatuses = ['Want children someday', 'Don\'t want children', 'Open to children', 'Open to children', 'Have children already'];
const petStatuses = ['Have pets', 'Love pets but don\'t have any', 'Allergic to pets', 'No pets'];
const exerciseHabits = ['Regular exercise', 'Occasional exercise', 'Daily fitness routine', 'Sports enthusiast', 'Yoga practitioner'];
const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const personalityTypes = ['INFJ', 'INFP', 'ENFJ', 'ENFP', 'INTJ', 'INTP', 'ENTJ', 'ENTP', 'ISFJ', 'ISFP', 'ESFJ', 'ESFP', 'ISTJ', 'ISTP', 'ESTJ', 'ESTP'];
const sleepSchedules = ['Early bird', 'Night owl', 'Balanced sleeper', 'Inconsistent schedule'];
const travelFrequencies = ['Frequent traveler', 'Occasional traveler', 'Aspiring traveler', 'Home-oriented'];
const communicationStyles = ['Direct and honest', 'Thoughtful and reflective', 'Expressive and emotional', 'Reserved but caring'];
const loveLanguages = ['Acts of Service', 'Words of Affirmation', 'Quality Time', 'Physical Touch', 'Receiving Gifts'];
const workEnvironments = ['Office worker', 'Remote worker', 'Hybrid schedule', 'Field work', 'Own business'];
const decisionStyles = ['Analytical and logical', 'Gut instinct follower', 'Balanced approach', 'Collaborative decision maker'];
const smokingStatuses = ['Non-smoker', 'Social smoker', 'Regular smoker', 'Former smoker'];
const drinkingStatuses = ['Non-drinker', 'Social drinker', 'Regular drinker', 'Former drinker'];

// Arrays for multi-select fields
const values = ['Family', 'Honesty', 'Loyalty', 'Kurdish heritage', 'Community', 'Education', 'Independence', 'Tradition', 'Progress', 'Equality', 'Freedom', 'Peace', 'Respect', 'Compassion', 'Cultural preservation'];
const interests = ['Kurdish music', 'Poetry', 'Literature', 'Dance', 'Film', 'History', 'Politics', 'Cultural events', 'Fashion', 'Travel', 'Food', 'Languages', 'Photography', 'Art', 'Technology', 'Science', 'Nature exploration', 'Activism', 'Sports', 'Fitness'];
const hobbies = ['Reading', 'Writing', 'Dancing', 'Singing', 'Cooking', 'Hiking', 'Photography', 'Painting', 'Gardening', 'Playing music', 'Learning languages', 'Travel', 'Sports', 'Meditation', 'Yoga', 'Crafting', 'Volunteering', 'Social activism'];
const techSkills = ['Web development', 'Graphic design', 'Social media', 'Video editing', 'Photography', 'Programming', 'Data analysis', 'Digital marketing'];
const musicInstruments = ['Tembûr', 'Ney', 'Def', 'Zurna', 'Dohol', 'Tar', 'Setar', 'Saz', 'Guitar', 'Piano', 'Violin', 'Flute'];
const favoriteGames = ['Backgammon', 'Chess', 'Traditional Kurdish games', 'Card games', 'Video games', 'Mobile games', 'Board games'];
const favoritePodcasts = ['History podcasts', 'Cultural discussions', 'Political analysis', 'Self-improvement', 'Language learning', 'Kurdish cultural shows'];
const favoriteBooks = ['Kurdish literature', 'Poetry collections', 'Historical novels', 'Political essays', 'Self-help books', 'World literature', 'Biographies'];
const favoriteMovies = ['Kurdish cinema', 'Historical films', 'Documentaries', 'Drama', 'Comedy', 'Action', 'Romance'];
const favoriteMusic = ['Traditional Kurdish music', 'Classical music', 'Pop', 'Folk', 'Rock', 'Jazz', 'Hip hop', 'Electronic'];
const favoriteFoods = ['Kurdish cuisine', 'Persian dishes', 'Turkish food', 'Arabic dishes', 'Mediterranean cuisine', 'International food', 'Vegetarian options'];
const petPeeves = ['Rudeness', 'Dishonesty', 'Lateness', 'Disrespecting culture', 'Interrupting', 'Arrogance', 'Close-mindedness'];
const weekendActivities = ['Family gatherings', 'Cultural events', 'Outdoor activities', 'Relaxing at home', 'Exploring new places', 'Creative projects', 'Sports and fitness'];
const growthGoals = ['Language learning', 'Professional development', 'Cultural knowledge', 'Personal growth', 'Health improvement', 'Creative skills'];
const hiddenTalents = ['Musical ability', 'Artistic talent', 'Storytelling', 'Language learning', 'Cooking', 'Problem-solving', 'Athletic skills'];
const stressRelievers = ['Nature walks', 'Meditation', 'Music', 'Art', 'Exercise', 'Reading', 'Cooking', 'Spending time with loved ones'];

const getRandomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomSubset = <T>(array: T[], min: number = 1, max: number = 3): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateBio = (firstName: string, gender: string, region: string, occupation: string, ageNum: number): string => {
  const bioTemplates = [
    `${firstName} is a ${ageNum}-year-old Kurdish ${gender} from ${region}. Currently working as a ${occupation} with a passion for Kurdish culture and heritage.`,
    `A proud Kurdish ${gender} from ${region}, ${firstName} works as a ${occupation} and loves to connect with people who share an interest in Kurdish traditions.`,
    `${ageNum}-year-old ${firstName} is from ${region} and has spent the last few years working as a ${occupation}. Passionate about Kurdish identity and building meaningful connections.`,
    `Born and raised in ${region}, ${firstName} is a ${occupation} who values ${gender === 'male' ? 'his' : 'her'} Kurdish heritage and enjoys sharing cultural experiences with others.`,
    `${firstName} is a ${ageNum}-year-old ${occupation} from ${region} who believes in preserving Kurdish culture while embracing modern life and forming genuine connections.`
  ];
  
  return getRandomElement(bioTemplates);
};

/**
 * Generate a Kurdish profile and save it to the database
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
    console.log(`Generating Kurdish profile - Gender: ${gender || 'random'}, With photo: ${withPhoto}, User ID: ${userId || 'new'}`);
    
    // Determine gender and generate name
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
    
    // Generate a random profile image using a placeholder service based on gender
    const avatarSeed = Math.random().toString(36).substring(2, 8);
    const profileImage = withPhoto 
      ? `https://i.pravatar.cc/300?u=${avatarSeed}` 
      : undefined;
    
    // Use the provided user ID or generate a new one
    const profileId = userId || crypto.randomUUID();
    console.log(`Using profile ID: ${profileId} for ${fullName}`);

    // Create the profile record directly in the profiles table with admin rights
    console.log("Attempting to create profile directly...");
    
    try {
      // Check if the auth user exists before trying to create a profile
      const { data: authUserExists, error: authCheckError } = await supabase.auth
        .admin.getUserById(profileId);

      if (authCheckError || !authUserExists) {
        console.log("Auth user doesn't exist or couldn't be verified. Creating auth user first...");
        
        // Create a dummy auth user for this profile ID
        const email = `${profileId.slice(0, 8)}@example.com`;
        const { data: authUser, error: authError } = await supabase.rpc(
          'create_dummy_auth_user' as any, 
          { 
            user_uuid: profileId,
            email: email
          }
        );
        
        if (authError) {
          console.error("Failed to create auth user:", authError);
          throw new Error(`Auth user creation failed: ${authError.message}`);
        }
        
        console.log("Auth user created successfully");
      }
      
      // Now create the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: profileId,
          name: fullName,
          age,
          gender: isMale ? 'male' : 'female',
          location,
          kurdistan_region: kurdistanRegion,
          occupation,
          verified: Math.random() > 0.3, // 70% verified
          last_active: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 30 days
          profile_image: profileImage,
          bio: generateBio(firstName, isMale ? 'male' : 'female', kurdistanRegion, occupation, age),
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
          personality_type: getRandomElement(personalityTypes),
          sleep_schedule: getRandomElement(sleepSchedules),
          travel_frequency: getRandomElement(travelFrequencies),
          communication_style: getRandomElement(communicationStyles),
          love_language: getRandomElement(loveLanguages),
          work_environment: getRandomElement(workEnvironments),
          decision_making_style: getRandomElement(decisionStyles),
          smoking: getRandomElement(smokingStatuses),
          drinking: getRandomElement(drinkingStatuses),
          values: getRandomSubset(values, 3, 6),
          interests: getRandomSubset(interests, 3, 8),
          hobbies: getRandomSubset(hobbies, 2, 5),
          languages: ['Kurdish'], // Always include Kurdish
          tech_skills: Math.random() > 0.7 ? getRandomSubset(techSkills, 1, 4) : [],
          music_instruments: Math.random() > 0.7 ? getRandomSubset(musicInstruments, 1, 3) : [],
          favorite_games: Math.random() > 0.6 ? getRandomSubset(favoriteGames, 1, 3) : [],
          favorite_podcasts: Math.random() > 0.5 ? getRandomSubset(favoritePodcasts, 1, 3) : [],
          favorite_books: getRandomSubset(favoriteBooks, 1, 4),
          favorite_movies: getRandomSubset(favoriteMovies, 1, 4),
          favorite_music: getRandomSubset(favoriteMusic, 2, 5),
          favorite_foods: getRandomSubset(favoriteFoods, 2, 5),
          pet_peeves: Math.random() > 0.6 ? getRandomSubset(petPeeves, 1, 3) : [],
          weekend_activities: Math.random() > 0.7 ? getRandomSubset(weekendActivities, 1, 3) : [],
          growth_goals: Math.random() > 0.6 ? getRandomSubset(growthGoals, 1, 3) : [],
          hidden_talents: Math.random() > 0.7 ? getRandomSubset(hiddenTalents, 1, 2) : [],
          stress_relievers: Math.random() > 0.6 ? getRandomSubset(stressRelievers, 1, 3) : [],
          favorite_memory: Math.random() > 0.6 ? `A memorable experience in ${getRandomElement(kurdishLocations)}` : null,
          dream_vacation: Math.random() > 0.7 ? `Exploring ${getRandomElement(['more of Kurdistan', 'Europe', 'Americas', 'Asia', 'historical sites'])}` : null,
          favorite_quote: Math.random() > 0.7 ? `"${getRandomElement(['Life is what happens when you\'re busy making other plans', 'Be the change you wish to see in the world', 'The journey of a thousand miles begins with a single step', 'Nothing is permanent except change'])}"` : null,
          dream_home: Math.random() > 0.7 ? `A ${getRandomElement(['traditional', 'modern', 'cozy', 'spacious'])} home in ${getRandomElement(kurdishLocations)}` : null,
          transportation_preference: Math.random() > 0.6 ? getRandomElement(['Car', 'Public transport', 'Walking when possible', 'Bicycle', 'Combination of methods']) : null,
          charity_involvement: Math.random() > 0.7 ? `Supporting ${getRandomElement(['cultural preservation', 'education initiatives', 'humanitarian efforts', 'environmental causes', 'community development'])}` : null,
          financial_habits: Math.random() > 0.7 ? getRandomElement(['Careful planner', 'Balanced spender/saver', 'Generous with resources', 'Investment-focused', 'Living in the moment']) : null,
          morning_routine: Math.random() > 0.6 ? `${getRandomElement(['Early riser', 'Leisurely morning', 'Quick start'])} with ${getRandomElement(['coffee', 'tea', 'exercise', 'reading'])}` : null,
          evening_routine: Math.random() > 0.6 ? `${getRandomElement(['Reading', 'Family time', 'Cultural activities', 'Relaxing', 'Preparing for tomorrow'])}` : null,
          ideal_date: Math.random() > 0.6 ? getRandomElement(['Cultural exploration', 'Outdoor adventure', 'Quiet conversation', 'Dinner and music', 'Something active and engaging']) : null,
          favorite_season: Math.random() > 0.7 ? getRandomElement(['Spring', 'Summer', 'Fall', 'Winter']) : null,
          ideal_weather: Math.random() > 0.7 ? getRandomElement(['Warm and sunny', 'Cool and breezy', 'Mild with occasional rain', 'Crisp mountain air']) : null,
          family_closeness: Math.random() > 0.6 ? getRandomElement(['Very close to family', 'Balanced family relationship', 'Independent but connected', 'Building chosen family']) : null,
          friendship_style: Math.random() > 0.6 ? getRandomElement(['Few close friends', 'Wide social circle', 'Mix of close and casual friendships', 'Values deep connections']) : null,
        })
        .select('id');
      
      if (profileError) {
        console.error('Direct insert failed, error:', profileError);
        throw new Error(`Profile direct insert failed: ${profileError.message}`);
      }

      console.log('Profile created via direct insert:', profileData);
      
      // Assign a random role
      await assignRole(profileId);
      
      return profileId;
    } catch (directInsertError) {
      console.error('Direct insert error:', directInsertError);
      
      // Fall back to using the RPC method
      console.log("Falling back to RPC create_demo_profile method...");
      
      const createDemoProfileParams: CreateDemoProfileParams = {
        user_id: profileId,
        user_name: fullName,
        user_age: age,
        user_location: location,
        user_gender: isMale ? 'male' : 'female',
        user_occupation: occupation,
        user_profile_image: profileImage
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
      
      // Assign a random role
      await assignRole(profileId);
      
      return profileId;
    }
  } catch (error) {
    console.error('Error during profile generation:', error);
    throw error;
  }
};

/**
 * Assign a random role to a user
 * @param userId The user ID to assign a role to
 */
const assignRole = async (userId: string): Promise<void> => {
  try {
    const role = Math.random() > 0.8 ? 'admin' : 
              Math.random() > 0.7 ? 'moderator' : 
              Math.random() > 0.6 ? 'premium' : 'user';
              
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role
      });
    
    if (roleError) {
      console.error('Error creating role for Kurdish profile:', roleError);
    } else {
      console.log(`Role '${role}' assigned to user ${userId}`);
    }
  } catch (roleErr) {
    console.error('Exception adding role:', roleErr);
  }
};
