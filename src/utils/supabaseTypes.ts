
import { QuestionItemDB } from '@/pages/SuperAdmin/components/registration-questions/types';

// Define the type for the admin_insert_questions RPC function
export type AdminInsertQuestionsParams = {
  questions: QuestionItemDB[];
};

// Define the type for create_demo_profile parameters
export type CreateDemoProfileParams = {
  user_id: string;
  user_name: string;
  user_age: number;
  user_location: string;
  user_gender: string;
  user_occupation: string;
  user_profile_image?: string;
};

// Extend the Supabase client types (for TypeScript only)
declare module '@supabase/supabase-js' {
  interface SupabaseClient<Database> {
    rpc<T = any>(
      fn: 'admin_insert_questions',
      params: AdminInsertQuestionsParams
    ): { data: T; error: any };
    
    rpc<T = any>(
      fn: 'create_demo_profile',
      params: CreateDemoProfileParams
    ): { data: T; error: any };
  }
}
