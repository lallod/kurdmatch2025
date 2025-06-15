
import { supabase } from '@/integrations/supabase/client';
import { getCachedResult, cacheResult } from './setup/cacheManager';
import { isInCooldown, updateLastAttempt, getCooldownPeriod, sleep } from './setup/rateLimitManager';
import { signInSuperAdmin, signUpSuperAdmin, ensureSuperAdminRole } from './setup/setupOperations';
import { handleSignInError, handleSignUpError, handleCriticalError } from './setup/errorHandlers';

const MAX_RETRIES = 3;

interface SetupResult {
  success: boolean;
  message?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
}

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
      retryAfter: getCooldownPeriod()
    };
  }

  const superAdminEmail = 'lalo.peshawa@gmail.com';
  const superAdminPassword = 'Hanasa2011';

  let retryCount = 0;
  
  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`Starting super admin setup verification... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
      updateLastAttempt();
      
      let user = null;

      try {
        const signInResult = await signInSuperAdmin(superAdminEmail, superAdminPassword, retryCount);
        if (signInResult.error) {
          const errorResult = handleSignInError(signInResult.error);
          if (errorResult.message === 'SIGN_UP_NEEDED') {
            console.log('Super admin does not exist, attempting to sign up.');
            
            const signUpResult = await signUpSuperAdmin(superAdminEmail, superAdminPassword);
            if (signUpResult.error) {
              const result = handleSignUpError(signUpResult.error);
              cacheResult(result);
              return result;
            }

            if (!signUpResult.user) {
              const message = 'Signup successful but no user object returned. This may be because email confirmation is required in your Supabase project. Please disable it to proceed.';
              console.error(message);
              const result = { success: false, message };
              cacheResult(result);
              return result;
            }
            
            console.log('Super admin account created successfully.');
            user = signUpResult.user;
          } else {
            cacheResult(errorResult);
            return errorResult;
          }
        } else {
          console.log('Successfully signed in as super admin.');
          user = signInResult.user;
        }
      } catch (error: any) {
        if (error.message === 'RETRY_NEEDED') {
          retryCount++;
          continue;
        }
        throw error;
      }
      
      if (!user || !user.id) {
        const message = 'Could not get super admin user details after sign in/up.';
        console.error(message);
        await supabase.auth.signOut().catch(() => {});
        const result = { success: false, message };
        cacheResult(result);
        return result;
      }
      
      const roleResult = await ensureSuperAdminRole(user.id);
      if (!roleResult.success) {
        await supabase.auth.signOut().catch(() => {});
        cacheResult(roleResult);
        return roleResult;
      }
      
      await supabase.auth.signOut();
      console.log('Super admin setup check complete. Signed out.');
      
      const result = { success: true, message: 'Super admin account is ready.' };
      cacheResult(result);
      return result;

    } catch (error: any) {
      if (error.code === 'over_request_rate_limit' && retryCount < MAX_RETRIES - 1) {
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 30000);
        console.log(`Rate limit error, waiting ${backoffTime}ms before retry...`);
        await sleep(backoffTime);
        retryCount++;
        continue;
      }
      
      const result = handleCriticalError(error);
      await supabase.auth.signOut().catch(e => console.error("Error signing out in catch block:", e));
      cacheResult(result);
      return result;
    }
  }

  // If we've exhausted all retries
  const result = {
    success: false,
    message: 'Setup failed after multiple attempts due to rate limiting. Please wait and try again later.',
    shouldRetry: true,
    retryAfter: getCooldownPeriod()
  };
  cacheResult(result);
  return result;
};

/**
 * Clears the setup cache (useful for forcing a fresh setup)
 */
export const clearSetupCache = (): void => {
  const { clearSetupCache: clearCache } = require('./setup/cacheManager');
  const { clearLastAttempt } = require('./setup/rateLimitManager');
  clearCache();
  clearLastAttempt();
};
