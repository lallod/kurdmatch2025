
import { QuestionItemDB } from '@/pages/SuperAdmin/components/registration-questions/types';

// Define the type for the admin_insert_questions RPC function
export type AdminInsertQuestionsParams = {
  questions: QuestionItemDB[];
};

// Extend the Supabase client types (for TypeScript only)
declare module '@supabase/supabase-js' {
  interface SupabaseClient<Database> {
    rpc<T = any>(
      fn: 'admin_insert_questions',
      params: AdminInsertQuestionsParams
    ): { data: T; error: any };
  }
}
