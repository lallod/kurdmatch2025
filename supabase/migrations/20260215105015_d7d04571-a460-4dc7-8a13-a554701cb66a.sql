-- Add text overlay support to stories
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS text_overlay text;
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS text_position varchar DEFAULT 'center';
ALTER TABLE public.stories ADD COLUMN IF NOT EXISTS background_color varchar DEFAULT null;