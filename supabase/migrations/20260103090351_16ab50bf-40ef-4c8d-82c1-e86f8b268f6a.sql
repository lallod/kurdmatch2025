-- Add user rating and feedback columns to support_tickets
ALTER TABLE public.support_tickets
ADD COLUMN IF NOT EXISTS user_rating integer CHECK (user_rating >= 1 AND user_rating <= 5),
ADD COLUMN IF NOT EXISTS user_feedback text;