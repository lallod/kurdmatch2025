import { supabase } from '@/integrations/supabase/client';
import { QuestionItem, toDbQuestion, fromDbQuestion } from '@/pages/SuperAdmin/components/registration-questions/types';
import { SAFE_PROFILE_COLUMNS } from './constants';

export const getUserRoles = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);
  
  if (error) throw error;
  return data.map((role: { role: string }) => role.role);
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
export const getRegistrationQuestions = async (): Promise<QuestionItem[]> => {
  const { data, error } = await supabase
    .from('registration_questions')
    .select()
    .order('display_order');
  
  if (error) throw error;
  return data.map(fromDbQuestion);
};

export const saveRegistrationQuestion = async (question: QuestionItem): Promise<QuestionItem> => {
  const dbQuestion = toDbQuestion(question);
  
  const { data, error } = await supabase
    .from('registration_questions')
    .upsert(dbQuestion)
    .select()
    .single();
  
  if (error) throw error;
  return fromDbQuestion(data);
};

export const deleteRegistrationQuestion = async (id: string) => {
  const { error } = await supabase
    .from('registration_questions')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Real User Management for Admin — uses edge function instead of client-side admin API
export const getAllUsers = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch profiles with safe columns (admin can see all via RLS)
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select(SAFE_PROFILE_COLUMNS);
  
  if (profilesError) throw profilesError;
  
  // Note: Email addresses should be fetched via admin-actions edge function
  // auth.admin.listUsers() requires service role key which the client doesn't have
  return profiles || [];
};

// Get real user counts and statistics
export const getUserStatistics = async () => {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('verified, last_active, created_at');
  
  if (error) throw error;
  
  const totalUsers = profiles?.length || 0;
  const activeUsers = (profiles || []).filter((p: { verified: boolean | null; last_active: string | null }) => 
    p.verified && p.last_active && 
    (new Date(p.last_active).getTime() > Date.now() - 86400000 * 7)
  ).length;
  const pendingUsers = (profiles || []).filter((p: { verified: boolean | null }) => !p.verified).length;
  const inactiveUsers = totalUsers - activeUsers - pendingUsers;
  
  return {
    totalUsers,
    activeUsers,
    pendingUsers,
    inactiveUsers
  };
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
