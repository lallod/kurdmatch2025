-- Remove the problematic decrypted view
-- Users will access encrypted data through the insert_encrypted_payment function
-- or by directly querying the encrypted columns when needed

DROP VIEW IF EXISTS public.payments_decrypted CASCADE;

-- The payments table now stores encrypted data
-- Use the insert_encrypted_payment() function to add encrypted payments
-- Access control is handled via RLS policies on the payments table itself