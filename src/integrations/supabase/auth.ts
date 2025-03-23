
import { useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from './client';

export const useSupabaseAuth = () => {
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
            const { data: roleData } = await supabase
              .from('user_roles')
              .select('role')
              .eq('user_id', newSession.user.id)
              .eq('role', 'super_admin');
              
            console.log('User roles check:', roleData);
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
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log('Got existing session:', currentSession?.user?.email);
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Always refresh the session to ensure tokens are valid
          const { data } = await supabase.auth.refreshSession();
          if (data.session) {
            console.log('Session refreshed:', data.session.user?.email);
            setSession(data.session);
            setUser(data.session.user);
            
            // Log current admin status
            try {
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', data.session.user.id)
                .eq('role', 'super_admin');
                
              console.log('Admin status check:', roleData && roleData.length > 0);
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
    try {
      console.log(`Checking if admin exists: ${email}`);
      
      const { data: users, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error('Error listing users:', listError);
        return false;
      }
      
      // Fix type issue by properly checking if users and users.users exist
      const existingUser = users?.users?.find(u => {
        if (u && typeof u === 'object' && 'email' in u) {
          // Cast to any to prevent TypeScript error and check explicitly
          const userObj = u as any;
          return userObj.email && typeof userObj.email === 'string' && 
                 userObj.email.toLowerCase() === email.toLowerCase();
        }
        return false;
      });
      
      let userId = existingUser?.id;
      
      let isAdmin = false;
      
      if (userId) {
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .eq('role', 'super_admin');
          
        isAdmin = roles && roles.length > 0;
        
        if (isAdmin) {
          console.log(`Admin user confirmed: ${email}`);
          return true;
        }
      }
      
      console.log(`Admin user doesn't exist or doesn't have admin role, creating: ${email}`);
      
      if (!userId) {
        const { data: newUser, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: 'Super Admin', email }
          }
        });
        
        if (signUpError || !newUser?.user?.id) {
          console.error('Admin signup error:', signUpError);
          return false;
        }
        
        userId = newUser.user.id;
        
        try {
          await supabase.auth.admin.updateUserById(userId, { 
            user_metadata: { name: 'Super Admin' },
            email_confirm: true 
          });
        } catch (err) {
          console.error('Could not confirm email automatically:', err);
        }
      }
      
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
