-- Create reported_messages table (new)
CREATE TABLE IF NOT EXISTS public.reported_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  conversation_id UUID,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'action_taken', 'dismissed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Create conversation_metadata table (new)
CREATE TABLE IF NOT EXISTS public.conversation_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create ai_conversation_insights table (new)
CREATE TABLE IF NOT EXISTS public.ai_conversation_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_partner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shared_interests JSONB DEFAULT '[]'::jsonb,
  conversation_summary TEXT,
  suggested_topics JSONB DEFAULT '[]'::jsonb,
  communication_style TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.reported_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversation_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reported_messages
DROP POLICY IF EXISTS "Users can report messages" ON public.reported_messages;
CREATE POLICY "Users can report messages"
  ON public.reported_messages FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can view their own reports" ON public.reported_messages;
CREATE POLICY "Users can view their own reports"
  ON public.reported_messages FOR SELECT
  USING (auth.uid() = reporter_id);

-- RLS Policies for conversation_metadata
DROP POLICY IF EXISTS "Users can view their conversations" ON public.conversation_metadata;
CREATE POLICY "Users can view their conversations"
  ON public.conversation_metadata FOR SELECT
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversation_metadata;
CREATE POLICY "Users can update their conversations"
  ON public.conversation_metadata FOR UPDATE
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can insert conversation metadata" ON public.conversation_metadata;
CREATE POLICY "Users can insert conversation metadata"
  ON public.conversation_metadata FOR INSERT
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- RLS Policies for ai_conversation_insights
DROP POLICY IF EXISTS "Users can view their own insights" ON public.ai_conversation_insights;
CREATE POLICY "Users can view their own insights"
  ON public.ai_conversation_insights FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own insights" ON public.ai_conversation_insights;
CREATE POLICY "Users can insert their own insights"
  ON public.ai_conversation_insights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own insights" ON public.ai_conversation_insights;
CREATE POLICY "Users can update their own insights"
  ON public.ai_conversation_insights FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reported_messages_reporter ON public.reported_messages(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reported_messages_reported_user ON public.reported_messages(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_metadata_users ON public.conversation_metadata(user1_id, user2_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user ON public.ai_conversation_insights(user_id);

-- Function to check if user is blocked (uses existing blocked_users table)
CREATE OR REPLACE FUNCTION is_user_blocked(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM blocked_users
    WHERE (blocker_id = auth.uid() AND blocked_id = target_user_id)
       OR (blocker_id = target_user_id AND blocked_id = auth.uid())
  );
END;
$$;