
import { supabase } from '@/integrations/supabase/client';
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const getUserRoles = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) throw new Error('No user authenticated');
  
  const { data, error } = await supabase
    .from('user_roles')
    .select()
    .eq('user_id', session.user.id);
  
  if (error) throw error;
  return data.map((role: any) => role.role);
};

export const isUserSuperAdmin = async () => {
  try {
    const roles = await getUserRoles();
    return roles.includes('super_admin');
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Registration Questions Management
export const getRegistrationQuestions = async () => {
  const { data, error } = await supabase
    .from('registration_questions')
    .select()
    .order('display_order');
  
  if (error) throw error;
  return data;
};

export const saveRegistrationQuestion = async (question: QuestionItem) => {
  const { data, error } = await supabase
    .from('registration_questions')
    .upsert(question)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteRegistrationQuestion = async (id: string) => {
  const { error } = await supabase
    .from('registration_questions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// User Management for Admin
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select();
  
  if (error) throw error;
  return data;
};

// Social Login Provider Management
export const getSocialLoginProviders = async () => {
  const { data, error } = await supabase
    .from('social_login_providers')
    .select();
  
  if (error) throw error;
  return data;
};

export const updateSocialLoginProvider = async (
  id: string, 
  updates: { enabled?: boolean, client_id?: string, client_secret?: string }
) => {
  const { data, error } = await supabase
    .from('social_login_providers')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
