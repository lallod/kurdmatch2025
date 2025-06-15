
interface SetupResult {
  success: boolean;
  message?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
}

/**
 * Handles sign-in errors and returns appropriate result
 */
export const handleSignInError = (error: any): SetupResult => {
  if (error.message.includes('Invalid login credentials')) {
    return { success: false, message: 'SIGN_UP_NEEDED' };
  }

  let message = `Super admin sign-in failed: ${error.message}`;
  if (error.message.toLowerCase().includes('failed to fetch')) {
    const origin = window.location.origin;
    message = `CORS Error: Your Supabase project is not configured to accept requests from this domain. Please add the following URL to your Supabase project's "CORS origins" list in the API settings: ${origin}`;
  }

  return { success: false, message };
};

/**
 * Handles sign-up errors and returns appropriate result
 */
export const handleSignUpError = (error: any): SetupResult => {
  console.error('Error creating super admin account during setup:', error);
  let message = `Error creating super admin: ${error.message}.`;
  if (error.message.includes('rate limit')) {
    message += ' Please wait a moment before trying again.';
  } else {
    message += ' This might be due to email confirmation being enabled in your Supabase project. Please disable it for the setup to complete automatically.';
  }
  return { success: false, message };
};

/**
 * Handles critical errors during setup
 */
export const handleCriticalError = (error: any): SetupResult => {
  console.error('A critical error occurred during Supabase setup:', error);
  
  let message = `A critical error occurred: ${error.message}.`;
  if (error.message.toLowerCase().includes('failed to fetch')) {
    const origin = window.location.origin;
    message = `Critical CORS Error: Supabase setup failed. Please go to your Supabase Dashboard -> API Settings -> CORS Configuration and add this URL to the list: ${origin}`;
  }
  return { success: false, message };
};
