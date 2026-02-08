-- Create swipe_history table to track recent swipes for rewind functionality
CREATE TABLE public.swipe_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  swiped_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('like', 'pass', 'superlike')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  rewound BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.swipe_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own swipe history
CREATE POLICY "Users can view their own swipe history"
ON public.swipe_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own swipe history
CREATE POLICY "Users can insert their own swipe history"
ON public.swipe_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own swipe history (for marking as rewound)
CREATE POLICY "Users can update their own swipe history"
ON public.swipe_history
FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own swipe history
CREATE POLICY "Users can delete their own swipe history"
ON public.swipe_history
FOR DELETE
USING (auth.uid() = user_id);

-- Index for efficient queries
CREATE INDEX idx_swipe_history_user_id ON public.swipe_history(user_id);
CREATE INDEX idx_swipe_history_created_at ON public.swipe_history(user_id, created_at DESC);