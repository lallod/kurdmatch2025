-- Create full-text search function for profiles
CREATE OR REPLACE FUNCTION search_profiles_fts(search_query TEXT)
RETURNS SETOF profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM profiles
  WHERE
    to_tsvector('english', COALESCE(name, '') || ' ' || 
                           COALESCE(bio, '') || ' ' || 
                           COALESCE(occupation, '') || ' ' ||
                           COALESCE(location, '')) 
    @@ plainto_tsquery('english', search_query)
  ORDER BY
    ts_rank(
      to_tsvector('english', COALESCE(name, '') || ' ' || 
                             COALESCE(bio, '') || ' ' || 
                             COALESCE(occupation, '') || ' ' ||
                             COALESCE(location, '')),
      plainto_tsquery('english', search_query)
    ) DESC,
    last_active DESC NULLS LAST
  LIMIT 50;
END;
$$;

-- Create GIN index for faster full-text search
CREATE INDEX IF NOT EXISTS profiles_fts_idx ON profiles 
USING GIN (to_tsvector('english', COALESCE(name, '') || ' ' || 
                                   COALESCE(bio, '') || ' ' || 
                                   COALESCE(occupation, '') || ' ' ||
                                   COALESCE(location, '')));

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_profiles_fts(TEXT) TO authenticated;
