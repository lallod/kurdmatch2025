-- Create security definer function for own-profile PII (geo_location is geography not geometry)
CREATE OR REPLACE FUNCTION public.get_own_profile_pii()
RETURNS TABLE (
  phone_number text,
  latitude double precision,
  longitude double precision,
  geo_location geography
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT phone_number, latitude, longitude, geo_location
  FROM profiles
  WHERE id = auth.uid();
$$;

GRANT EXECUTE ON FUNCTION public.get_own_profile_pii() TO authenticated;