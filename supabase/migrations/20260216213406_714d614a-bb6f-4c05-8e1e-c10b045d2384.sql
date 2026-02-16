-- Drop the overly permissive update policy
DROP POLICY IF EXISTS "Authenticated users can update story view counts" ON public.stories;

-- Instead, create a trigger to auto-update views_count when a story_view is inserted
CREATE OR REPLACE FUNCTION public.update_story_views_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.stories 
  SET views_count = (
    SELECT COUNT(*) FROM public.story_views WHERE story_id = NEW.story_id
  )
  WHERE id = NEW.story_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_story_view_inserted
AFTER INSERT ON public.story_views
FOR EACH ROW
EXECUTE FUNCTION public.update_story_views_count();