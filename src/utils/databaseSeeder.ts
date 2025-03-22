
import { supabase } from '@/integrations/supabase/client';
import { initialQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/sampleQuestions';
import { systemQuestions } from '@/pages/SuperAdmin/components/registration-questions/data/systemQuestions';
import { mockUsers } from '@/pages/SuperAdmin/components/users/UserData';
import { mockRoles } from '@/pages/SuperAdmin/components/roles/RoleData';

export const seedDatabase = async () => {
  console.log('Starting database seeding...');
  
  // Import registration questions
  try {
    console.log('Seeding registration questions...');
    
    // Check if questions already exist
    const { data: existingQuestions } = await supabase
      .from('registration_questions')
      .select('id');
    
    if (!existingQuestions || existingQuestions.length === 0) {
      const allQuestions = [...systemQuestions, ...initialQuestions];
      
      const { error } = await supabase
        .from('registration_questions')
        .insert(allQuestions);
      
      if (error) throw error;
      console.log('Registration questions seeded successfully!');
    } else {
      console.log('Registration questions already exist, skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding registration questions:', error);
  }
  
  // Seed demo users (only if running in development)
  if (process.env.NODE_ENV === 'development') {
    try {
      console.log('Seeding demo users...');
      
      // Check if demo users already exist
      const { data: existingUsers } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (!existingUsers || existingUsers.length === 0) {
        // In a real app, you would create auth users first and then profiles
        // For demo purposes, we'll just add fake profiles
        
        for (const user of mockUsers) {
          // Create a random UUID for each user
          const userId = crypto.randomUUID();
          
          const { error } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              name: user.name,
              age: Math.floor(Math.random() * 20) + 20, // Random age between 20-40
              location: user.location,
              last_active: user.lastActive,
              verified: Math.random() > 0.5, // Random verified status
              email: user.email,
              profile_image: `https://i.pravatar.cc/300?u=${userId}` // Random avatar
            });
          
          if (error) throw error;
          
          // Add role for this user
          await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: user.role
            });
        }
        
        console.log('Demo users seeded successfully!');
      } else {
        console.log('Users already exist, skipping seed.');
      }
    } catch (error) {
      console.error('Error seeding demo users:', error);
    }
  }
  
  console.log('Database seeding completed!');
};
