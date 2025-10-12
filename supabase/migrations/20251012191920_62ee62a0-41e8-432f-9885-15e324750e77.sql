-- Create app_translations table for multi-language support
CREATE TABLE IF NOT EXISTS public.app_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code varchar(50) NOT NULL,
  translation_key text NOT NULL,
  translation_value text NOT NULL,
  context text,
  category varchar(100) NOT NULL,
  needs_review boolean DEFAULT false,
  auto_translated boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(language_code, translation_key)
);

-- Enable RLS
ALTER TABLE public.app_translations ENABLE ROW LEVEL SECURITY;

-- Anyone can read translations
CREATE POLICY "Anyone can read translations"
ON public.app_translations
FOR SELECT
USING (true);

-- Super admins can manage translations
CREATE POLICY "Super admins can manage translations"
ON public.app_translations
FOR ALL
USING (is_super_admin(auth.uid()))
WITH CHECK (is_super_admin(auth.uid()));

-- Create index for faster lookups
CREATE INDEX idx_translations_language_key ON public.app_translations(language_code, translation_key);
CREATE INDEX idx_translations_category ON public.app_translations(category);
CREATE INDEX idx_translations_needs_review ON public.app_translations(needs_review) WHERE needs_review = true;

-- Create updated_at trigger
CREATE TRIGGER update_app_translations_updated_at
BEFORE UPDATE ON public.app_translations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();