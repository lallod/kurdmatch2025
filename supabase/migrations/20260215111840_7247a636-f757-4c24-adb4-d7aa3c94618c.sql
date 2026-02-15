
-- Create calls table for call history
CREATE TABLE public.calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caller_id UUID NOT NULL REFERENCES auth.users(id),
  callee_id UUID NOT NULL REFERENCES auth.users(id),
  call_type TEXT NOT NULL DEFAULT 'video' CHECK (call_type IN ('video', 'voice')),
  status TEXT NOT NULL DEFAULT 'ringing' CHECK (status IN ('ringing', 'answered', 'ended', 'missed', 'declined', 'failed')),
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;

-- Users can see their own calls
CREATE POLICY "Users can view their own calls"
  ON public.calls FOR SELECT
  USING (auth.uid() = caller_id OR auth.uid() = callee_id);

-- Users can create calls
CREATE POLICY "Users can create calls"
  ON public.calls FOR INSERT
  WITH CHECK (auth.uid() = caller_id);

-- Users can update calls they're part of
CREATE POLICY "Users can update their calls"
  ON public.calls FOR UPDATE
  USING (auth.uid() = caller_id OR auth.uid() = callee_id);

-- Indexes
CREATE INDEX idx_calls_caller_id ON public.calls(caller_id);
CREATE INDEX idx_calls_callee_id ON public.calls(callee_id);
CREATE INDEX idx_calls_status ON public.calls(status);

-- Trigger for updated_at
CREATE TRIGGER update_calls_updated_at
  BEFORE UPDATE ON public.calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
