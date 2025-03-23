
import { supabase } from '@/integrations/supabase/client';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';
import { systemQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/systemQuestions';
import { mockUsers } from '@/pages/SuperAdmin/components/users/UserData';
import { mockRoles } from '@/pages/SuperAdmin/components/roles/RoleData';
import { toDbQuestion } from '@/pages/SuperAdmin/components/registration-questions/types';

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
      const { error } = await supabase.rpc('admin_insert_questions', {
        questions: dbQuestions as any // Type assertion to fix TS error
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
  
  // Seed demo users
  try {
    console.log('Seeding demo users...');
    
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
      
      // Create sample engagement data for the last 30 days
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
  
  console.log('Database seeding completed!');
};
