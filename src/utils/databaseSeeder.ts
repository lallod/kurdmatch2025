import { supabase } from '@/integrations/supabase/client';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';
import { systemQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/systemQuestions';
import { toDbQuestion, QuestionItemDB } from '@/pages/SuperAdmin/components/registration-questions/types';
import './supabaseTypes'; // Import the type definitions

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

const occupations = ['Student', 'Teacher', 'Engineer', 'Doctor', 'Business Owner', 'Artist', 'Musician', 'Writer', 'Journalist', 'Developer'];

// Generate a random Kurdish profile
const generateKurdishProfile = (gender?: string) => {
  const isMale = gender ? gender === 'male' : Math.random() > 0.5;
  const firstName = isMale 
    ? kurdishMaleNames[Math.floor(Math.random() * kurdishMaleNames.length)]
    : kurdishFemaleNames[Math.floor(Math.random() * kurdishFemaleNames.length)];
  
  const lastName = kurdishSurnames[Math.floor(Math.random() * kurdishSurnames.length)];
  const location = kurdishLocations[Math.floor(Math.random() * kurdishLocations.length)];
  const kurdistanRegion = kurdishRegions[Math.floor(Math.random() * kurdishRegions.length)];
  const occupation = occupations[Math.floor(Math.random() * occupations.length)];
  const age = Math.floor(Math.random() * 42) + 18; // Age between 18-60
  const verified = Math.random() > 0.3; // 70% verified
  const role = Math.random() > 0.8 ? 'admin' : 
               Math.random() > 0.7 ? 'moderator' : 
               Math.random() > 0.6 ? 'premium' : 'user';
  
  return {
    name: `${firstName} ${lastName}`,
    location,
    kurdistanRegion,
    occupation,
    age,
    verified,
    role,
    gender: isMale ? 'male' : 'female',
    bio: `Kurdish ${isMale ? 'male' : 'female'} from ${kurdistanRegion}, interested in Kurdish culture and heritage.`
  };
};

export const seedDatabase = async () => {
  console.log('Starting database seeding...');
  
  // Import registration questions
  try {
    console.log('Seeding registration questions...');
    
    // Check if questions already exist
    const { data: existingQuestions, error: questionError } = await supabase
      .from('registration_questions')
      .select('id');
    
    if (questionError) {
      console.error('Error checking for existing questions:', questionError.message);
      // Continue with other seeding even if this fails
    } else if (!existingQuestions || existingQuestions.length === 0) {
      const allQuestions = [...systemQuestions, ...initialQuestions];
      const dbQuestions = allQuestions.map(toDbQuestion);
      
      // Use RLS bypass to create questions as they might be protected
      // Use "any" type to avoid TypeScript errors
      const { error } = await supabase.rpc('admin_insert_questions' as any, {
        questions: dbQuestions
      });
      
      if (error) {
        console.error('Error seeding registration questions:', error.message);
        // Try direct insert as fallback
        const { error: directError } = await supabase
          .from('registration_questions')
          .insert(dbQuestions);
        
        if (directError) {
          console.error('Direct insert also failed:', directError.message);
        } else {
          console.log('Registration questions seeded successfully via direct insert!');
        }
      } else {
        console.log('Registration questions seeded successfully!');
      }
    } else {
      console.log('Registration questions already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding registration questions:', error);
  }
  
  // Seed demo users and Kurdish profiles
  try {
    console.log('Seeding demo users and Kurdish profiles...');
    
    // Force recreate profiles for demo purposes
    const shouldForceRecreate = true; // Set to true to force recreate profiles
    const createKurdishProfiles = true; // Set to true to create Kurdish profiles

    if (shouldForceRecreate) {
      console.log('Force recreating demo profiles...');
      
      // Delete existing profiles if recreating
      if (createKurdishProfiles) {
        console.log('First removing any existing roles to start fresh...');
        try {
          // Remove existing roles
          const { error: roleDeleteError } = await supabase
            .from('user_roles')
            .delete()
            .neq('role', 'nonexistent'); // Delete all roles
          
          if (roleDeleteError) {
            console.error('Error deleting existing roles:', roleDeleteError.message);
          }
          
        } catch (error) {
          console.error('Error during cleanup:', error);
        }
      }
      
      // For each mock user, create a profile entry
      for (const user of mockUsers) {
        // Create a random UUID for each user
        const userId = crypto.randomUUID();
        const email = `${userId.slice(0, 8)}@example.com`;
        
        try {
          // First create the auth user - this is necessary for the foreign key constraint
          const { data: authUserData, error: authUserError } = await supabase.rpc(
            'create_dummy_auth_user' as any, 
            { 
              user_uuid: userId,
              email: email
            }
          );
          
          if (authUserError) {
            console.error(`Failed to create auth user: ${authUserError.message}`);
            continue; // Skip this profile if auth user creation fails
          }
        
          // Insert profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: user.name,
              age: Math.floor(Math.random() * 20) + 20, // Random age between 20-40
              location: user.location || 'Unknown Location',
              last_active: new Date().toISOString(),
              verified: Math.random() > 0.5, // Random verified status
              profile_image: `https://i.pravatar.cc/300?u=${userId}`, // Random avatar
              occupation: user.role === 'admin' ? 'Administrator' : 
                        user.role === 'moderator' ? 'Content Moderator' : 
                        'Member',
              bio: `This is a demo ${user.role} account.`
            });
          
          if (profileError) {
            console.error('Error creating profile:', profileError.message);
            continue;
          }
          
          // Add role for this user
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: user.role
            });
          
          if (roleError) {
            console.error('Error creating user role:', roleError.message);
          } else {
            console.log(`Created profile and role for ${user.name} (${user.role})`);
          }
        } catch (error) {
          console.error(`Exception in profile creation process:`, error);
        }
      }
      
      // Generate Kurdish profiles if requested
      if (createKurdishProfiles) {
        console.log('Generating Kurdish profiles...');
        
        // Generate 50 Kurdish profiles (or any desired number)
        const numProfiles = 50;
        
        for (let i = 0; i < numProfiles; i++) {
          // Generate a Kurdish profile with random attributes
          const profile = generateKurdishProfile();
          const userId = crypto.randomUUID();
          const email = `${userId.slice(0, 8)}@example.com`;
          
          try {
            // First create the auth user - this is necessary for the foreign key constraint
            const { data: authUserData, error: authUserError } = await supabase.rpc(
              'create_dummy_auth_user' as any, 
              { 
                user_uuid: userId,
                email: email
              }
            );
            
            if (authUserError) {
              console.error(`Failed to create auth user: ${authUserError.message}`);
              continue; // Skip this profile if auth user creation fails
            }
          
            // Insert the profile
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: userId,
                name: profile.name,
                age: profile.age,
                location: profile.location,
                kurdistan_region: profile.kurdistanRegion,
                occupation: profile.occupation,
                verified: profile.verified,
                last_active: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Random time in last 30 days
                profile_image: `https://i.pravatar.cc/300?u=${userId}`, // Random avatar
                bio: profile.bio,
                // Add languages array with Kurdish
                languages: ['Kurdish', Math.random() > 0.5 ? 'English' : '', Math.random() > 0.7 ? 'Arabic' : '', Math.random() > 0.8 ? 'Farsi' : ''].filter(Boolean)
              });
            
            if (profileError) {
              console.error(`Error creating Kurdish profile #${i}:`, profileError.message);
              continue;
            }
            
            // Add role for this user
            const { error: roleError } = await supabase
              .from('user_roles')
              .insert({
                user_id: userId,
                role: profile.role
              });
            
            if (roleError) {
              console.error(`Error creating role for Kurdish profile #${i}:`, roleError.message);
            } else {
              if (i % 10 === 0) { // Log progress every 10 profiles to reduce console spam
                console.log(`Created ${i+1}/${numProfiles} Kurdish profiles`);
              }
            }
          } catch (error) {
            console.error(`Exception in profile creation process:`, error);
          }
        }
        
        console.log('Kurdish profiles generation completed!');
      }
      
      console.log('Demo users seeded successfully!');
    } else {
      // Check if profiles already exist
      const { data: existingProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (profilesError) {
        console.error('Error checking for existing profiles:', profilesError.message);
      } else if (!existingProfiles || existingProfiles.length === 0) {
        console.log('No existing profiles found, creating demo profiles...');
        
        // For each mock user, create a profile entry
        for (const user of mockUsers) {
          // Create a random UUID for each user
          const userId = crypto.randomUUID();
          
          // Insert profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: user.name,
              age: Math.floor(Math.random() * 20) + 20, // Random age between 20-40
              location: user.location || 'Unknown Location',
              last_active: new Date().toISOString(),
              verified: Math.random() > 0.5, // Random verified status
              profile_image: `https://i.pravatar.cc/300?u=${userId}`, // Random avatar
              occupation: user.role === 'admin' ? 'Administrator' : 
                        user.role === 'moderator' ? 'Content Moderator' : 
                        'Member',
              bio: `This is a demo ${user.role} account.`
            });
          
          if (profileError) {
            console.error('Error creating profile:', profileError.message);
            continue;
          }
          
          // Add role for this user
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: user.role
            });
          
          if (roleError) {
            console.error('Error creating user role:', roleError.message);
          }
        }
        
        console.log('Demo users seeded successfully!');
      } else {
        console.log('Users already exist, skipping seed.');
      }
    }
  } catch (error) {
    console.error('Error seeding demo users:', error);
  }
  
  // Seed engagement data
  try {
    // Check if engagement data already exists
    const { data: existingEngagement, error: engagementError } = await supabase
      .from('user_engagement')
      .select('id')
      .limit(1);
    
    if (engagementError) {
      console.error('Error checking for existing engagement data:', engagementError.message);
    } else if (!existingEngagement || existingEngagement.length === 0) {
      console.log('Creating sample engagement data...');
      
      const engagementData = [];
      const today = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const trendOptions = ['positive', 'negative', 'neutral'];
        
        engagementData.push({
          date: date.toISOString().split('T')[0],
          users: Math.floor(Math.random() * 100) + 50,
          conversations: Math.floor(Math.random() * 80) + 20,
          likes: Math.floor(Math.random() * 200) + 100,
          views: Math.floor(Math.random() * 500) + 200,
          matches: Math.floor(Math.random() * 40) + 10,
          trend: trendOptions[Math.floor(Math.random() * trendOptions.length)]
        });
      }
      
      const { error: insertError } = await supabase
        .from('user_engagement')
        .insert(engagementData);
      
      if (insertError) {
        console.error('Error creating engagement data:', insertError.message);
      } else {
        console.log('Engagement data created successfully!');
      }
    } else {
      console.log('Engagement data already exists, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding engagement data:', error);
  }
  
  // Seed dashboard stats if they don't exist
  try {
    // Check if dashboard stats already exist
    const { data: existingStats, error: statsError } = await supabase
      .from('dashboard_stats')
      .select('id')
      .limit(1);
    
    if (statsError) {
      console.error('Error checking for existing dashboard stats:', statsError.message);
    } else if (!existingStats || existingStats.length === 0) {
      console.log('Creating dashboard stats...');
      
      const statData = [
        {
          stat_name: 'Total Users',
          stat_value: 248,
          change_percentage: 12.5,
          icon: 'Users',
          trend: 'positive'
        },
        {
          stat_name: 'Conversations',
          stat_value: 1842,
          change_percentage: 8.3,
          icon: 'MessageSquare',
          trend: 'positive'
        },
        {
          stat_name: 'Photos Uploaded',
          stat_value: 854,
          change_percentage: -3.2,
          icon: 'ImageIcon',
          trend: 'negative'
        },
        {
          stat_name: 'User Activity',
          stat_value: 92,
          change_percentage: 1.8,
          icon: 'Activity',
          trend: 'positive'
        }
      ];
      
      const { error: insertError } = await supabase
        .from('dashboard_stats')
        .insert(statData);
      
      if (insertError) {
        console.error('Error creating dashboard stats:', insertError.message);
      } else {
        console.log('Dashboard stats created successfully!');
      }
    } else {
      console.log('Dashboard stats already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding dashboard stats:', error);
  }
  
  // Seed admin activities for the recent activity feed
  try {
    // Check if admin activities already exist
    const { data: existingActivities, error: activitiesError } = await supabase
      .from('admin_activities')
      .select('id')
      .limit(1);
    
    if (activitiesError) {
      console.error('Error checking for existing admin activities:', activitiesError.message);
    } else if (!existingActivities || existingActivities.length === 0) {
      console.log('Creating admin activities...');
      
      const activityTypes = [
        'user_moderation', 'system_update', 'content_moderation', 
        'user_support', 'system_maintenance'
      ];
      
      const descriptions = [
        'User account verified and approved',
        'System settings updated',
        'Photo moderation completed',
        'User support ticket resolved',
        'Database maintenance performed',
        'New feature implemented',
        'Bug fix deployed',
        'Security patch applied',
        'Performance optimization completed',
        'User feedback processed'
      ];
      
      const activities = [];
      const now = new Date();
      
      for (let i = 0; i < 10; i++) {
        const date = new Date(now);
        date.setHours(date.getHours() - i * 2);
        
        activities.push({
          activity_type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
          description: descriptions[i],
          created_at: date.toISOString(),
          user_id: crypto.randomUUID()
        });
      }
      
      const { error: insertError } = await supabase
        .from('admin_activities')
        .insert(activities);
      
      if (insertError) {
        console.error('Error creating admin activities:', insertError.message);
      } else {
        console.log('Admin activities created successfully!');
      }
    } else {
      console.log('Admin activities already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding admin activities:', error);
  }
  
  console.log('Database seeding completed!');
};
