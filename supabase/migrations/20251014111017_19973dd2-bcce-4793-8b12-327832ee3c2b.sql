-- Recreate payments_decrypted view without security definer
DROP VIEW IF EXISTS public.payments_decrypted;

-- Create simple view without security_barrier
CREATE VIEW public.payments_decrypted AS
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

-- Grant access
GRANT SELECT ON public.payments_decrypted TO authenticated;