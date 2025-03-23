
import { useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './client';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Got existing session:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: object) => {
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
        // Format the error message for better display
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

  // Function to check if admin exists and create it if not
  const ensureAdminExists = async (email: string, password: string) => {
    console.log(`Checking if admin exists: ${email}`);
    try {
      // First check if the user exists
      const { data: existingUsers, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) throw userError;
      
      if (!existingUsers) {
        console.log(`Admin user doesn't exist, creating: ${email}`);
        // User doesn't exist, create it
        const signUpResult = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: 'Super Admin',
              email,
            }
          }
        });
        
        if (signUpResult.error) throw signUpResult.error;
        
        if (signUpResult.data.user) {
          // Assign super_admin role
          const { error: roleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: signUpResult.data.user.id,
              role: 'super_admin'
            });
          
          if (roleError) throw roleError;
          console.log(`Admin role assigned to: ${email}`);
        }
      } else {
        console.log(`Admin user exists: ${email}`);
      }
      
      return true;
    } catch (error) {
      console.error('Error ensuring admin exists:', error);
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
