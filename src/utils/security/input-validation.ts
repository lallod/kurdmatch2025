/**
 * Input Validation Utilities
 * 
 * Comprehensive validation rules for all user inputs
 * to prevent injection attacks, data corruption, and ensure data quality
 */

import { z } from 'zod';

/**
 * Maximum lengths for various fields to prevent buffer overflow and DoS
 */
export const MAX_LENGTHS = {
  NAME: 100,
  EMAIL: 255,
  BIO: 1000,
  MESSAGE: 2000,
  POST_CONTENT: 5000,
  COMMENT: 500,
  LOCATION: 200,
  OCCUPATION: 100,
  URL: 2000,
  PHONE: 20,
} as const;

/**
 * Common validation schemas
 */

// Name validation: Letters, spaces, hyphens, apostrophes
export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name is required')
  .max(MAX_LENGTHS.NAME, `Name must be less than ${MAX_LENGTHS.NAME} characters`)
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    'Name can only contain letters, spaces, hyphens, and apostrophes'
  );

// Email validation
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Invalid email address')
  .max(MAX_LENGTHS.EMAIL, `Email must be less than ${MAX_LENGTHS.EMAIL} characters`);

// Bio validation
export const bioSchema = z
  .string()
  .trim()
  .min(20, 'Bio must be at least 20 characters')
  .max(MAX_LENGTHS.BIO, `Bio must be less than ${MAX_LENGTHS.BIO} characters`)
  .refine(
    (val) => !/<script|javascript:|onerror=/i.test(val),
    'Bio contains potentially dangerous content'
  );

// Message validation
export const messageSchema = z
  .string()
  .trim()
  .min(1, 'Message cannot be empty')
  .max(MAX_LENGTHS.MESSAGE, `Message must be less than ${MAX_LENGTHS.MESSAGE} characters`);

// Post content validation
export const postContentSchema = z
  .string()
  .trim()
  .min(1, 'Post content cannot be empty')
  .max(MAX_LENGTHS.POST_CONTENT, `Post must be less than ${MAX_LENGTHS.POST_CONTENT} characters`);

// URL validation
export const urlSchema = z
  .string()
  .trim()
  .url('Invalid URL format')
  .max(MAX_LENGTHS.URL, `URL must be less than ${MAX_LENGTHS.URL} characters`)
  .refine(
    (val) => val.startsWith('http://') || val.startsWith('https://'),
    'URL must start with http:// or https://'
  );

// Phone number validation
export const phoneSchema = z
  .string()
  .trim()
  .min(10, 'Phone number must be at least 10 digits')
  .max(MAX_LENGTHS.PHONE, `Phone number must be less than ${MAX_LENGTHS.PHONE} characters`)
  .regex(/^[+\d\s()-]+$/, 'Phone number contains invalid characters');

// Age validation
export const ageSchema = z
  .number()
  .int('Age must be a whole number')
  .min(18, 'You must be at least 18 years old')
  .max(120, 'Please enter a valid age');

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: messageSchema,
});

/**
 * Profile update validation schema
 */
export const profileUpdateSchema = z.object({
  name: nameSchema,
  bio: bioSchema.optional(),
  age: ageSchema,
  location: z
    .string()
    .trim()
    .max(MAX_LENGTHS.LOCATION, `Location must be less than ${MAX_LENGTHS.LOCATION} characters`)
    .optional(),
  occupation: z
    .string()
    .trim()
    .max(MAX_LENGTHS.OCCUPATION, `Occupation must be less than ${MAX_LENGTHS.OCCUPATION} characters`)
    .optional(),
});

/**
 * Post creation validation schema
 */
export const createPostSchema = z.object({
  content: postContentSchema,
  media_url: urlSchema.optional(),
  media_type: z.enum(['image', 'video']).optional(),
});

/**
 * Comment validation schema
 */
export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, 'Comment cannot be empty')
    .max(MAX_LENGTHS.COMMENT, `Comment must be less than ${MAX_LENGTHS.COMMENT} characters`),
  post_id: z.string().uuid('Invalid post ID'),
});

/**
 * Event creation validation schema
 */
export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .trim()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  location: z
    .string()
    .trim()
    .min(3, 'Location is required')
    .max(MAX_LENGTHS.LOCATION, `Location must be less than ${MAX_LENGTHS.LOCATION} characters`),
  event_date: z.string().datetime('Invalid date format'),
  max_attendees: z.number().int().min(2).max(10000).optional(),
});

/**
 * Helper function to validate input against a schema
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Validation result with success status and errors
 * 
 * @example
 * const result = validateInput(nameSchema, userName);
 * if (!result.success) {
 *   console.error(result.errors);
 * }
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: boolean; data?: T; errors?: string[] } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => err.message);
      return { success: false, errors };
    }
    return { success: false, errors: ['Validation failed'] };
  }
}

/**
 * Sanitizes and validates string input
 * 
 * @param input - Input to validate
 * @param maxLength - Maximum allowed length
 * @param pattern - Optional regex pattern to match
 * @returns Sanitized and validated string or null if invalid
 * 
 * @example
 * const cleanName = sanitizeString(userName, 100, /^[a-zA-Z\s]+$/);
 */
export function sanitizeString(
  input: string | null | undefined,
  maxLength: number,
  pattern?: RegExp
): string | null {
  if (!input) return null;
  
  // Trim whitespace
  let clean = input.trim();
  
  // Check length
  if (clean.length > maxLength) {
    console.warn(`Input exceeds maximum length of ${maxLength}`);
    return null;
  }
  
  // Check pattern if provided
  if (pattern && !pattern.test(clean)) {
    console.warn('Input does not match required pattern');
    return null;
  }
  
  // Remove null bytes and other control characters
  clean = clean.replace(/[\x00-\x1F\x7F]/g, '');
  
  return clean;
}

/**
 * Validates array input to prevent injection
 * 
 * @param input - Array to validate
 * @param maxLength - Maximum array length
 * @param itemValidator - Function to validate each item
 * @returns Validated array or empty array if invalid
 */
export function validateArray<T>(
  input: unknown,
  maxLength: number,
  itemValidator: (item: unknown) => T | null
): T[] {
  if (!Array.isArray(input)) {
    console.warn('Input is not an array');
    return [];
  }
  
  if (input.length > maxLength) {
    console.warn(`Array exceeds maximum length of ${maxLength}`);
    return [];
  }
  
  const validated: T[] = [];
  for (const item of input) {
    const validItem = itemValidator(item);
    if (validItem !== null) {
      validated.push(validItem);
    }
  }
  
  return validated;
}

/**
 * Rate limiting helper - checks if action can be performed
 * 
 * @param key - Unique key for the action (e.g., user ID + action type)
 * @param limit - Maximum number of actions allowed
 * @param windowMs - Time window in milliseconds
 * @returns Whether the action is allowed
 */
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const record = rateLimitCache.get(key);
  
  // No record or expired
  if (!record || now > record.resetAt) {
    rateLimitCache.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  // Within limit
  if (record.count < limit) {
    record.count++;
    return true;
  }
  
  // Exceeded limit
  return false;
}

/**
 * Cleans up expired rate limit entries
 * Should be called periodically
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitCache.entries()) {
    if (now > record.resetAt) {
      rateLimitCache.delete(key);
    }
  }
}
