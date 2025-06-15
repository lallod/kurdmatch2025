
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const SETUP_CACHE_KEY = 'supabase_setup_status';
const LAST_ATTEMPT_KEY = 'supabase_setup_last_attempt';
const COOLDOWN_PERIOD = 30000; // 30 seconds
const MAX_RETRIES = 3;

interface SetupResult {
  success: boolean;
  message?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
}

/**
 * Checks if we're in a cooldown period
 */
const isInCooldown = (): boolean => {
  const lastAttempt = localStorage.getItem(LAST_ATTEMPT_KEY);
  if (!lastAttempt) return false;
  
  const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
  return timeSinceLastAttempt < COOLDOWN_PERIOD;
};

/**
 * Gets cached setup result if valid
 */
const getCachedResult = (): SetupResult | null => {
  try {
    const cached = localStorage.getItem(SETUP_CACHE_KEY);
    if (!cached) return null;
    
    const result = JSON.parse(cached);
    // Cache is valid for 1 hour
    if (Date.now() - result.timestamp < 3600000) {
      return result.data;
    }
  } catch (error) {
    console.error('Error reading cached setup result:', error);
  }
  return null;
};

/**
 * Caches the setup result
 */
const cacheResult = (result: SetupResult): void => {
  try {
    localStorage.setItem(SETUP_CACHE_KEY, JSON.stringify({
      data: result,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.error('Error caching setup result:', error);
  }
};

/**
 * Updates the last attempt timestamp
 */
const updateLastAttempt = (): void => {
  localStorage.setItem(LAST_ATTEMPT_KEY, Date.now().toString());
};

/**
 * Sleep function for retry delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Checks and sets up the super admin user and role with rate limiting protection.
 */
export const setupSupabase = async (): Promise<SetupResult> => {
  // Check if we have a cached successful result
  const cachedResult = getCachedResult();
  if (cachedResult?.success) {
    console.log('Using cached setup result');
    return cachedResult;
  }

  // Check if we're in cooldown period
  if (isInCooldown()) {
    const message = 'Setup is in cooldown period. Please wait before trying again.';
    console.log(message);
    return { 
      success: false, 
      message,
      shouldRetry: true,
      retryAfter: COOLDOWN_PERIOD
    };
  }

  const superAdminEmail = 'lalo.peshawa@gmail.com';
  const superAdminPassword = 'Hanasa2011';

  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`Starting super admin setup verification... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      updateLastAttempt();
      
      let user: User | null = null;

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: superAdminEmail,
        password: superAdminPassword
      });

      if (signInError) {
        if (signInError.code === 'over_request_rate_limit') {
          console.log('Rate limit hit, implementing backoff...');
          const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000); // Exponential backoff, max 30s
          
          if (retryCount < MAX_RETRIES - 1) {
            console.log(`Waiting ${backoffTime}ms before retry...`);
            await sleep(backoffTime);
            retryCount++;
            continue;
          } else {
            const result = {
              success: false,
              message: 'Rate limit reached. The setup will be attempted again automatically after a cooldown period.',
              shouldRetry: true,
              retryAfter: COOLDOWN_PERIOD
            };
            cacheResult(result);
            return result;
          }
        }

        if (signInError.message.includes('Invalid login credentials')) {
          console.log('Super admin does not exist, attempting to sign up.');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: superAdminEmail,
            password: superAdminPassword,
            options: {
              data: { 
                name: 'Super Admin',
                isAdmin: true
              }
            }
          });

          if (signUpError) {
            console.error('Error creating super admin account during setup:', signUpError);
            let message = `Error creating super admin: ${signUpError.message}.`;
            if (signUpError.message.includes('rate limit')) {
              message += ' Please wait a moment before trying again.';
            } else {
               message += ' This might be due to email confirmation being enabled in your Supabase project. Please disable it for the setup to complete automatically.';
            }
            const result = { success: false, message };
            cacheResult(result);
            return result;
          }

          if (!signUpData.user) {
            const message = 'Signup successful but no user object returned. This may be because email confirmation is required in your Supabase project. Please disable it to proceed.';
            console.error(message);
            const result = { success: false, message };
            cacheResult(result);
            return result;
          }
          
          console.log('Super admin account created successfully.');
          user = signUpData.user;

        } else {
          console.error('An unexpected error occurred during super admin sign-in:', signInError);
          let message = `Super admin sign-in failed: ${signInError.message}`;
          if (signInError.message.toLowerCase().includes('failed to fetch')) {
              const origin = window.location.origin;
              message = `CORS Error: Your Supabase project is not configured to accept requests from this domain. Please add the following URL to your Supabase project's "CORS origins" list in the API settings: ${origin}`;
          }
          const result = { success: false, message };
          cacheResult(result);
          return result;
        }
      } else {
        console.log('Successfully signed in as super admin.');
        user = signInData.user;
      }
      
      if (!user || !user.id) {
        const message = 'Could not get super admin user details after sign in/up.';
        console.error(message);
        await supabase.auth.signOut().catch(() => {});
        const result = { success: false, message };
        cacheResult(result);
        return result;
      }
      
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'super_admin')
        .maybeSingle();
      
      if (roleError) {
        console.error('Error checking for super admin role:', roleError);
        const message = `Error checking admin role: ${roleError.message}. Make sure the 'user_roles' table exists and RLS is configured to allow access.`;
        await supabase.auth.signOut().catch(() => {});
        const result = { success: false, message };
        cacheResult(result);
        return result;
      }
      
      if (!roleData) {
        console.log(`User ${user.email} does not have super_admin role, adding it.`);
        
        const { error: insertRoleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: user.id,
            role: 'super_admin'
          });
        
        if (insertRoleError) {
          console.error('Error adding super_admin role:', insertRoleError);
          const message = `Error adding admin role: ${insertRoleError.message}. Make sure the 'user_roles' table exists and has the correct columns (user_id, role).`;
          await supabase.auth.signOut().catch(() => {});
          const result = { success: false, message };
          cacheResult(result);
          return result;
        }
        
        console.log('Super admin role created successfully.');
      } else {
        console.log('User already has super_admin role.');
      }
      
      await supabase.auth.signOut();
      console.log('Super admin setup check complete. Signed out.');
      
      const result = { success: true, message: 'Super admin account is ready.' };
      cacheResult(result);
      return result;

    } catch (error: any) {
      console.error('A critical error occurred during Supabase setup:', error);
      
      if (error.code === 'over_request_rate_limit' && retryCount < MAX_RETRIES - 1) {
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000);
        console.log(`Rate limit error, waiting ${backoffTime}ms before retry...`);
        await sleep(backoffTime);
        retryCount++;
        continue;
      }
      
      let message = `A critical error occurred: ${error.message}.`;
      if (error.message.toLowerCase().includes('failed to fetch')) {
          const origin = window.location.origin;
          message = `Critical CORS Error: Supabase setup failed. Please go to your Supabase Dashboard -> API Settings -> CORS Configuration and add this URL to the list: ${origin}`
      }
      await supabase.auth.signOut().catch(e => console.error("Error signing out in catch block:", e));
      const result = { success: false, message };
      cacheResult(result);
      return result;
    }
  }

  // If we've exhausted all retries
  const result = {
    success: false,
    message: 'Setup failed after multiple attempts due to rate limiting. Please wait and try again later.',
    shouldRetry: true,
    retryAfter: COOLDOWN_PERIOD
  };
  cacheResult(result);
  return result;
};

/**
 * Clears the setup cache (useful for forcing a fresh setup)
 */
export const clearSetupCache = (): void => {
  localStorage.removeItem(SETUP_CACHE_KEY);
  localStorage.removeItem(LAST_ATTEMPT_KEY);
};
