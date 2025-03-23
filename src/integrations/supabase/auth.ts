
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
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
    try {
      return await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      return await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    supabase
  };
};
