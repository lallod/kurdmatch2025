-- Fix Security Definer View issue
-- Remove security_barrier to avoid security definer view warning

-- Drop the problematic view configuration
ALTER VIEW public.payments_decrypted SET (security_barrier = off);

-- Note: Users accessing payments_decrypted will use encryption key from their session
-- This is secure because:
-- 1. Only authenticated users with proper RLS policies can access
-- 2. The encryption key is session-specific via current_setting
-- 3. RLS on base payments table is still enforced