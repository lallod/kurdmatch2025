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
  const ensureAdminExists = async (email: string, password: string): Promise<boolean> => {
    console.log(`Checking if admin exists: ${email}`);
    
    try {
      // First check if the user exists in profiles
      const profileQuery = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
      
      if (profileQuery.error) {
        console.error('Error checking for existing user:', profileQuery.error);
        return false;
      }
      
      // If user exists, we're done
      if (profileQuery.data) {
        console.log(`Admin user exists: ${email}`);
        return true;
      }
      
      console.log(`Admin user doesn't exist, creating: ${email}`);
      
      // Create the admin user - using explicit typing to avoid deep nesting
      let signUpResponse;
      
      try {
        signUpResponse = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: 'Super Admin',
              email
            }
          }
        });
      } catch (signUpError) {
        console.error('Error during admin signup:', signUpError);
        return false;
      }
      
      // Early return if signup failed
      if (signUpResponse.error) {
        console.error('Admin signup error:', signUpResponse.error);
        return false;
      }
      
      // Type-safe extraction of user ID
      const user = signUpResponse.data.user;
      if (!user || !user.id) {
        console.error('User created but ID is missing');
        return false;
      }
      
      // Assign admin role with the extracted ID
      const roleResponse = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'super_admin'
        });
      
      if (roleResponse.error) {
        console.error('Error assigning admin role:', roleResponse.error);
        return false;
      }
      
      console.log(`Admin role assigned to: ${email}`);
      return true;
    } catch (error) {
      console.error('General error ensuring admin exists:', error);
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
