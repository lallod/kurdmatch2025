-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Grant necessary permissions to roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Add location columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS latitude float8,
ADD COLUMN IF NOT EXISTS longitude float8,
ADD COLUMN IF NOT EXISTS geo_location geography(POINT, 4326);

-- Create spatial index for efficient nearby queries
CREATE INDEX IF NOT EXISTS idx_profiles_geo_location 
ON public.profiles USING GIST (geo_location);

-- Create trigger function to automatically update geo_location from lat/long
CREATE OR REPLACE FUNCTION public.update_geo_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.geo_location = ST_Point(NEW.longitude, NEW.latitude)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to maintain geo_location
DROP TRIGGER IF EXISTS trigger_update_geo_location ON public.profiles;
CREATE TRIGGER trigger_update_geo_location
  BEFORE INSERT OR UPDATE OF latitude, longitude ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_geo_location();

-- Create RPC function to find nearby users
CREATE OR REPLACE FUNCTION public.nearby_users(
  current_lat float,
  current_long float,
  radius_km int DEFAULT 50,
  max_results int DEFAULT 100
)
RETURNS TABLE (
  id uuid,
  name varchar,
  age int,
  profile_image varchar,
  location varchar,
  latitude float8,
  longitude float8,
  distance_km float
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_point geography;
BEGIN
  -- Create point from current coordinates
  current_point := ST_Point(current_long, current_lat)::geography;
  
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.age,
    p.profile_image,
    p.location,
    p.latitude,
    p.longitude,
    ROUND(ST_Distance(p.geo_location, current_point)::numeric / 1000, 1)::float as distance_km
  FROM profiles p
  WHERE 
    p.geo_location IS NOT NULL
    AND p.id != auth.uid()
    AND ST_DWithin(p.geo_location, current_point, radius_km * 1000)
    AND p.verified = true
  ORDER BY p.geo_location <-> current_point
  LIMIT max_results;
END;
$$;

-- Drop existing policy if it exists and recreate
DROP POLICY IF EXISTS "Users can update own location" ON public.profiles;
CREATE POLICY "Users can update own location"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Grant execute permission on the nearby_users function
GRANT EXECUTE ON FUNCTION public.nearby_users(float, float, int, int) TO authenticated, anon;