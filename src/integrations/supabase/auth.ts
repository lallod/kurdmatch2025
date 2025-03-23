
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './client';
import * as authService from './authService';
import * as adminService from './adminService';
import { SupabaseAuthHook } from './authTypes';

export const useSupabaseAuth = (): SupabaseAuthHook => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state listener to catch any changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email);
        
        // If we receive a session update, check if the user has admin role
        if (newSession?.user) {
          try {
            await adminService.checkAdminStatus(newSession.user.id);
          } catch (error) {
            console.error('Error checking roles:', error);
          }
        }
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession } } = await authService.getSession();
        console.log('Got existing session:', currentSession?.user?.email);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Always refresh the session to ensure tokens are valid
          const { data } = await authService.refreshSession();
          if (data.session) {
            console.log('Session refreshed:', data.session.user?.email);
            setSession(data.session);
            setUser(data.session.user);
            
            // Log current admin status
            try {
              await adminService.checkAdminStatus(data.session.user.id);
            } catch (error) {
              console.error('Error checking admin status:', error);
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    setLoading(true);
    try {
      return await authService.signUp(email, password, metadata);
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
      return await authService.signIn(email, password);
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
      return await authService.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    ensureAdminExists: adminService.ensureAdminExists,
    supabase
  };
};
