
-- Add translation columns to registration_questions
ALTER TABLE public.registration_questions
  ADD COLUMN IF NOT EXISTS text_en text,
  ADD COLUMN IF NOT EXISTS text_no text,
  ADD COLUMN IF NOT EXISTS text_ku_sorani text,
  ADD COLUMN IF NOT EXISTS text_ku_kurmanci text,
  ADD COLUMN IF NOT EXISTS text_de text,
  ADD COLUMN IF NOT EXISTS placeholder_en text,
  ADD COLUMN IF NOT EXISTS placeholder_no text,
  ADD COLUMN IF NOT EXISTS placeholder_ku_sorani text,
  ADD COLUMN IF NOT EXISTS placeholder_ku_kurmanci text,
  ADD COLUMN IF NOT EXISTS placeholder_de text,
  ADD COLUMN IF NOT EXISTS field_options_en text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS field_options_no text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS field_options_ku_sorani text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS field_options_ku_kurmanci text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS field_options_de text[] DEFAULT '{}';

-- Backfill English columns from existing data
UPDATE public.registration_questions
SET text_en = COALESCE(text_en, text),
    placeholder_en = COALESCE(placeholder_en, placeholder),
    field_options_en = COALESCE(NULLIF(field_options_en, '{}'), field_options);

-- Add translation columns to content_categories
ALTER TABLE public.content_categories
  ADD COLUMN IF NOT EXISTS name_en text,
  ADD COLUMN IF NOT EXISTS name_no text,
  ADD COLUMN IF NOT EXISTS name_ku_sorani text,
  ADD COLUMN IF NOT EXISTS name_ku_kurmanci text,
  ADD COLUMN IF NOT EXISTS name_de text,
  ADD COLUMN IF NOT EXISTS description_en text,
  ADD COLUMN IF NOT EXISTS description_no text,
  ADD COLUMN IF NOT EXISTS description_ku_sorani text,
  ADD COLUMN IF NOT EXISTS description_ku_kurmanci text,
  ADD COLUMN IF NOT EXISTS description_de text;

-- Backfill English columns
UPDATE public.content_categories
SET name_en = COALESCE(name_en, name),
    description_en = COALESCE(description_en, description);

-- Add translation columns to category_items
ALTER TABLE public.category_items
  ADD COLUMN IF NOT EXISTS name_en text,
  ADD COLUMN IF NOT EXISTS name_no text,
  ADD COLUMN IF NOT EXISTS name_ku_sorani text,
  ADD COLUMN IF NOT EXISTS name_ku_kurmanci text,
  ADD COLUMN IF NOT EXISTS name_de text,
  ADD COLUMN IF NOT EXISTS description_en text,
  ADD COLUMN IF NOT EXISTS description_no text,
  ADD COLUMN IF NOT EXISTS description_ku_sorani text,
  ADD COLUMN IF NOT EXISTS description_ku_kurmanci text,
  ADD COLUMN IF NOT EXISTS description_de text;

-- Backfill English columns
UPDATE public.category_items
SET name_en = COALESCE(name_en, name),
    description_en = COALESCE(description_en, description);
