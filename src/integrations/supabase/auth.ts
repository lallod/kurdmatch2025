
import { useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './client';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got existing session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const response = await supabase.auth.signOut();
      if (response.error) throw response.error;
      return response;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Simplified function to check and create admin user if needed
  const ensureAdminExists = async (email: string, password: string): Promise<boolean> => {
    console.log(`Checking if admin exists: ${email}`);
    
    try {
      // Check if user exists in auth system first
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
        
      if (userError && userError.code !== 'PGRST116') { // Not found error is ok
        console.error('Error checking for existing user:', userError);
        return false;
      }
      
      // If user exists, return true
      if (userData) {
        console.log(`Admin user exists: ${email}`);
        return true;
      }
      
      // Create new admin user
      console.log(`Admin user doesn't exist, creating: ${email}`);
      
      // Sign up the user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: 'Super Admin',
            email
          }
        }
      });
      
      if (signUpError) {
        console.error('Admin signup error:', signUpError);
        return false;
      }
      
      const userId = data.user?.id;
      if (!userId) {
        console.error('User created but ID is missing');
        return false;
      }
      
      // Create role assignment
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'super_admin'
        });
      
      if (roleError) {
        console.error('Error assigning admin role:', roleError);
        return false;
      }
      
      console.log(`Admin role assigned to: ${email}`);
      return true;
    } catch (error) {
      console.error('Unexpected error ensuring admin exists:', error);
      return false;
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    ensureAdminExists,
    supabase
  };
};
