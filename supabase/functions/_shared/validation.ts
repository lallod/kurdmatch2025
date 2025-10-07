/**
 * Server-side input validation for edge functions
 * Provides XSS protection and input sanitization
 */

import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

/**
 * Maximum field lengths (must match client-side validation)
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
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(MAX_LENGTHS.EMAIL, `Email must be less than ${MAX_LENGTHS.EMAIL} characters`);

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name is required")
  .max(MAX_LENGTHS.NAME, `Name must be less than ${MAX_LENGTHS.NAME} characters`)
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    "Name can only contain letters, spaces, hyphens, and apostrophes"
  );

export const bioSchema = z
  .string()
  .trim()
  .max(MAX_LENGTHS.BIO, `Bio must be less than ${MAX_LENGTHS.BIO} characters`)
  .refine(
    (val) => !/<script|javascript:|onerror=/i.test(val),
    "Bio contains potentially dangerous content"
  );

export const messageSchema = z
  .string()
  .trim()
  .min(1, "Message cannot be empty")
  .max(MAX_LENGTHS.MESSAGE, `Message must be less than ${MAX_LENGTHS.MESSAGE} characters`);

export const uuidSchema = z.string().uuid("Invalid UUID format");

/**
 * Sanitizes string input by removing dangerous characters
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return "";
  
  // Trim whitespace
  let clean = input.trim();
  
  // Remove null bytes and other control characters
  clean = clean.replace(/[\x00-\x1F\x7F]/g, "");
  
  // Remove potentially dangerous HTML/script patterns
  clean = clean.replace(/<script[^>]*>.*?<\/script>/gi, "");
  clean = clean.replace(/javascript:/gi, "");
  clean = clean.replace(/onerror=/gi, "");
  
  return clean;
}

/**
 * Validates and sanitizes user input
 */
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(", ") 
      };
    }
    return { success: false, error: "Validation failed" };
  }
}

/**
 * Rate limiting check using in-memory cache
 * For production, use Redis or similar persistent store
 */
const rateLimitCache = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
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
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitCache.entries()) {
    if (now > record.resetAt) {
      rateLimitCache.delete(key);
    }
  }
}

// Cleanup expired entries every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);
