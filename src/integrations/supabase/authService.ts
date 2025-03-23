
import { AuthError } from '@supabase/supabase-js';
import { supabase } from './client';

export const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
  const response = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: window.location.origin
    }
  });
  
  if (response.error) throw response.error;
  return response;
};

export const signIn = async (email: string, password: string) => {
  console.log(`Attempting to sign in with email: ${email}`);
  const response = await supabase.auth.signInWithPassword({ email, password });
  
  if (response.error) {
    console.error('Sign in error response:', response.error);
    if (response.error.message === 'Invalid login credentials') {
      const formattedError = new AuthError('Invalid email or password. Please try again.');
      formattedError.status = response.error.status;
      formattedError.code = response.error.code;
      throw formattedError;
    }
    throw response.error;
  }
  
  console.log('Sign in successful:', response.data.user?.email);
  return response;
};

export const signOut = async () => {
  const response = await supabase.auth.signOut();
  if (response.error) throw response.error;
  return response;
};

export const getSession = async () => {
  return await supabase.auth.getSession();
};

export const refreshSession = async () => {
  return await supabase.auth.refreshSession();
};
