-- Cleanup old typing status records (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_typing_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.typing_status
  WHERE updated_at < (now() - interval '1 hour');
END;
$$;

-- Cleanup inactive push subscriptions (no activity in 30 days)
CREATE OR REPLACE FUNCTION public.cleanup_inactive_push_subscriptions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.push_subscriptions
  SET is_active = false
  WHERE is_active = true
    AND last_used_at < (now() - interval '30 days');
END;
$$;