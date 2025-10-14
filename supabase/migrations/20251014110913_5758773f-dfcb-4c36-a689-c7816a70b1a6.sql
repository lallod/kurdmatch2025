-- PHASE 2, STEP 2.3: Add Payment Data Encryption
-- Encrypt sensitive payment data using pgcrypto

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add encrypted columns for sensitive payment data
ALTER TABLE public.payments 
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id_encrypted bytea,
  ADD COLUMN IF NOT EXISTS stripe_customer_id_encrypted bytea,
  ADD COLUMN IF NOT EXISTS payment_method_encrypted bytea;

-- Migrate existing data to encrypted columns
-- Using a secret key from Supabase vault (users should set this via dashboard)
UPDATE public.payments
SET 
  stripe_payment_intent_id_encrypted = CASE 
    WHEN stripe_payment_intent_id IS NOT NULL 
    THEN pgp_sym_encrypt(stripe_payment_intent_id, current_setting('app.settings.encryption_key', true))
    ELSE NULL
  END,
  stripe_customer_id_encrypted = CASE 
    WHEN stripe_customer_id IS NOT NULL 
    THEN pgp_sym_encrypt(stripe_customer_id, current_setting('app.settings.encryption_key', true))
    ELSE NULL
  END,
  payment_method_encrypted = CASE 
    WHEN payment_method IS NOT NULL 
    THEN pgp_sym_encrypt(payment_method, current_setting('app.settings.encryption_key', true))
    ELSE NULL
  END
WHERE stripe_payment_intent_id_encrypted IS NULL 
   OR stripe_customer_id_encrypted IS NULL 
   OR payment_method_encrypted IS NULL;

-- Create view for authorized access with automatic decryption
CREATE OR REPLACE VIEW public.payments_decrypted AS
SELECT 
  id,
  user_id,
  amount,
  currency,
  status,
  subscription_type,
  description,
  metadata,
  created_at,
  updated_at,
  -- Decrypt sensitive fields
  pgp_sym_decrypt(stripe_payment_intent_id_encrypted, current_setting('app.settings.encryption_key', true))::text as stripe_payment_intent_id,
  pgp_sym_decrypt(stripe_customer_id_encrypted, current_setting('app.settings.encryption_key', true))::text as stripe_customer_id,
  pgp_sym_decrypt(payment_method_encrypted, current_setting('app.settings.encryption_key', true))::text as payment_method
FROM public.payments;

-- Grant access to the view
GRANT SELECT ON public.payments_decrypted TO authenticated;

-- Add RLS policies for the decrypted view
ALTER VIEW public.payments_decrypted SET (security_barrier = on);

-- Create function to insert encrypted payment data
CREATE OR REPLACE FUNCTION public.insert_encrypted_payment(
  p_user_id uuid,
  p_amount numeric,
  p_currency text,
  p_status text,
  p_stripe_payment_intent_id text,
  p_stripe_customer_id text,
  p_payment_method text,
  p_subscription_type text DEFAULT NULL,
  p_description text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_payment_id uuid;
BEGIN
  INSERT INTO public.payments (
    user_id,
    amount,
    currency,
    status,
    stripe_payment_intent_id_encrypted,
    stripe_customer_id_encrypted,
    payment_method_encrypted,
    subscription_type,
    description,
    metadata
  ) VALUES (
    p_user_id,
    p_amount,
    p_currency,
    p_status,
    pgp_sym_encrypt(p_stripe_payment_intent_id, current_setting('app.settings.encryption_key', true)),
    pgp_sym_encrypt(p_stripe_customer_id, current_setting('app.settings.encryption_key', true)),
    pgp_sym_encrypt(p_payment_method, current_setting('app.settings.encryption_key', true)),
    p_subscription_type,
    p_description,
    p_metadata
  )
  RETURNING id INTO new_payment_id;
  
  RETURN new_payment_id;
END;
$$;

COMMENT ON COLUMN public.payments.stripe_payment_intent_id_encrypted IS 'Encrypted Stripe payment intent ID';
COMMENT ON COLUMN public.payments.stripe_customer_id_encrypted IS 'Encrypted Stripe customer ID';
COMMENT ON COLUMN public.payments.payment_method_encrypted IS 'Encrypted payment method';
COMMENT ON VIEW public.payments_decrypted IS 'View providing decrypted payment data for authorized users';
COMMENT ON FUNCTION public.insert_encrypted_payment IS 'Securely insert payment data with automatic encryption';