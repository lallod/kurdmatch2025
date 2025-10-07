-- Create payments table to track all payment transactions
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id text UNIQUE,
  stripe_customer_id text,
  amount decimal(10, 2) NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  payment_method text CHECK (payment_method IN ('credit_card', 'debit_card', 'paypal', 'apple_pay', 'google_pay', 'bank_transfer')),
  subscription_type text CHECK (subscription_type IN ('free', 'basic', 'premium', 'ultimate')),
  description text,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own payments"
ON public.payments
FOR SELECT
USING (auth.uid() = user_id);

-- Super admins can view all payments
CREATE POLICY "Super admins can view all payments"
ON public.payments
FOR SELECT
USING (is_super_admin(auth.uid()));

-- Super admins can insert payments (for manual entries)
CREATE POLICY "Super admins can insert payments"
ON public.payments
FOR INSERT
WITH CHECK (is_super_admin(auth.uid()));

-- Super admins can update payments
CREATE POLICY "Super admins can update payments"
ON public.payments
FOR UPDATE
USING (is_super_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);
CREATE INDEX idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);

-- Create trigger for updated_at
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add helpful comment
COMMENT ON TABLE public.payments IS 'Stores all payment transactions for the platform';