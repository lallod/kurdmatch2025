/**
 * Utility functions for handling profile data display
 */

// Database default placeholder values that should not be displayed
const PLACEHOLDER_VALUES = [
  'Not specified',
  'not specified',
  'Tell us about yourself...',
  'Tell us about yourself',
  'New User',
  'User',
  'Prefer not to say',
  'Looking for something serious',
  'Open to children',
  'Sometimes',
  'Average',
  '5\'6"',
  'South-Kurdistan',
  'https://placehold.co/400',
  '/placeholder.svg',
  '',
  null,
  undefined
];

/**
 * Check if a value is a placeholder that shouldn't be displayed
 */
export const isPlaceholderValue = (value: any): boolean => {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return PLACEHOLDER_VALUES.some(placeholder => 
      placeholder && trimmed.toLowerCase() === placeholder.toLowerCase()
    );
  }
  
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  
  return false;
};

/**
 * Get display value only if it's not a placeholder
 */
export const getDisplayValue = (value: any): string | null => {
  if (isPlaceholderValue(value)) {
    return null;
  }
  return value;
};

/**
 * Check if an array field has actual values (not empty or placeholders)
 */
export const hasRealArrayValues = (arr: any[]): boolean => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return false;
  }
  
  return arr.some(item => !isPlaceholderValue(item));
};
