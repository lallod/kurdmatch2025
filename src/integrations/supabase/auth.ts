
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

  const ensureAdminExists = async (email: string, password: string): Promise<boolean> => {
    console.log(`Checking if admin exists: ${email}`);
    
    try {
      // Check if profile exists using raw query to avoid complex type instantiation
      const profileQuery = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);
      
      // Handle profile query error
      if (profileQuery.error) {
        console.error('Error checking for existing profile:', profileQuery.error);
        return false;
      }
      
      // If profile exists, return true
      if (profileQuery.data && profileQuery.data.length > 0) {
        console.log(`Admin user exists: ${email}`);
        return true;
      }
      
      // Create new admin user
      console.log(`Admin user doesn't exist, creating: ${email}`);
      
      // Sign up the user
      const authResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: 'Super Admin',
            email
          }
        }
      });
      
      // Handle signup error
      if (authResponse.error) {
        console.error('Admin signup error:', authResponse.error);
        return false;
      }
      
      // Check if user was created successfully
      const newUser = authResponse.data.user;
      if (!newUser || !newUser.id) {
        console.error('User created but ID is missing');
        return false;
      }
      
      // Create role assignment
      const roleInsert = await supabase
        .from('user_roles')
        .insert({
          user_id: newUser.id,
          role: 'super_admin'
        });
      
      // Handle role assignment error
      if (roleInsert.error) {
        console.error('Error assigning admin role:', roleInsert.error);
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
