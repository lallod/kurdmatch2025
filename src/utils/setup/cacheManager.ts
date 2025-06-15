
interface SetupResult {
  success: boolean;
  message?: string;
  shouldRetry?: boolean;
  retryAfter?: number;
}

const SETUP_CACHE_KEY = 'supabase_setup_status';

/**
 * Gets cached setup result if valid
 */
export const getCachedResult = (): SetupResult | null => {
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
export const cacheResult = (result: SetupResult): void => {
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
 * Clears the setup cache (useful for forcing a fresh setup)
 */
export const clearSetupCache = (): void => {
  localStorage.removeItem(SETUP_CACHE_KEY);
};
