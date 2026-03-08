-- Add unique constraint on matches to prevent duplicate matches
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'matches_user1_user2_unique'
  ) THEN
    ALTER TABLE public.matches ADD CONSTRAINT matches_user1_user2_unique UNIQUE (user1_id, user2_id);
  END IF;
END $$;