
const LAST_ATTEMPT_KEY = 'supabase_setup_last_attempt';
const COOLDOWN_PERIOD = 30000; // 30 seconds

/**
 * Checks if we're in a cooldown period
 */
export const isInCooldown = (): boolean => {
  const lastAttempt = localStorage.getItem(LAST_ATTEMPT_KEY);
  if (!lastAttempt) return false;
  
  const timeSinceLastAttempt = Date.now() - parseInt(lastAttempt);
  return timeSinceLastAttempt < COOLDOWN_PERIOD;
};

/**
 * Updates the last attempt timestamp
 */
export const updateLastAttempt = (): void => {
  localStorage.setItem(LAST_ATTEMPT_KEY, Date.now().toString());
};

/**
 * Clears the last attempt timestamp
 */
export const clearLastAttempt = (): void => {
  localStorage.removeItem(LAST_ATTEMPT_KEY);
};

/**
 * Gets the cooldown period in milliseconds
 */
export const getCooldownPeriod = (): number => {
  return COOLDOWN_PERIOD;
};

/**
 * Sleep function for retry delays
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
