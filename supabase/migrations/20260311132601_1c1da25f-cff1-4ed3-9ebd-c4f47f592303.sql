
-- Revoke anonymous access to public profile views
REVOKE SELECT ON public.user_public_profile FROM anon;
REVOKE SELECT ON public.user_public_view FROM anon;

-- Enable RLS on the views (PostgreSQL 15+ supports this)
-- If this fails on older PG versions, the REVOKE above is sufficient
DO $$ 
BEGIN
  ALTER VIEW public.user_public_profile SET (security_invoker = true);
  ALTER VIEW public.user_public_view SET (security_invoker = true);
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not set security_invoker on views: %', SQLERRM;
END $$;
