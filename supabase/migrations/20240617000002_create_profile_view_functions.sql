
-- Create functions for profile view operations

-- Function to check if a profile view exists for today
CREATE OR REPLACE FUNCTION check_profile_view_exists(
  p_viewer_id UUID,
  p_viewed_id UUID,
  p_date TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  view_exists BOOLEAN := FALSE;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM profile_views 
    WHERE viewer_id = p_viewer_id 
    AND viewed_id = p_viewed_id 
    AND DATE(created_at) = p_date::DATE
  ) INTO view_exists;
  
  RETURN view_exists;
END;
$$;

-- Function to insert a new profile view
CREATE OR REPLACE FUNCTION insert_profile_view(
  p_viewer_id UUID,
  p_viewed_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_view_id UUID;
BEGIN
  INSERT INTO profile_views (viewer_id, viewed_id)
  VALUES (p_viewer_id, p_viewed_id)
  RETURNING id INTO new_view_id;
  
  RETURN new_view_id;
END;
$$;

-- Function to get profile views with viewer details
CREATE OR REPLACE FUNCTION get_profile_views(p_profile_id UUID)
RETURNS TABLE(
  id UUID,
  created_at TIMESTAMPTZ,
  viewer_id UUID,
  viewer_name TEXT,
  viewer_profile_image TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.id,
    pv.created_at,
    pv.viewer_id,
    p.name as viewer_name,
    p.profile_image as viewer_profile_image
  FROM profile_views pv
  JOIN profiles p ON p.id = pv.viewer_id
  WHERE pv.viewed_id = p_profile_id
  ORDER BY pv.created_at DESC;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_profile_view_exists TO authenticated;
GRANT EXECUTE ON FUNCTION insert_profile_view TO authenticated;
GRANT EXECUTE ON FUNCTION get_profile_views TO authenticated;
