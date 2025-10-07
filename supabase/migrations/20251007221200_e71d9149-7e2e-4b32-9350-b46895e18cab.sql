-- Create ab_tests table
CREATE TABLE IF NOT EXISTS public.ab_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  test_type text NOT NULL CHECK (test_type IN ('feature', 'ui', 'algorithm', 'pricing')),
  variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  target_audience text,
  traffic_split jsonb NOT NULL DEFAULT '{}'::jsonb,
  success_metrics text[],
  start_date timestamptz,
  end_date timestamptz,
  metrics jsonb DEFAULT '{}'::jsonb,
  daily_data jsonb DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on ab_tests
ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;

-- RLS policies for ab_tests
CREATE POLICY "Super admins can view all ab tests"
  ON public.ab_tests FOR SELECT
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert ab tests"
  ON public.ab_tests FOR INSERT
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update ab tests"
  ON public.ab_tests FOR UPDATE
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete ab tests"
  ON public.ab_tests FOR DELETE
  USING (is_super_admin(auth.uid()));

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  subject text NOT NULL,
  template text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'paused', 'failed')),
  campaign_type text NOT NULL CHECK (campaign_type IN ('newsletter', 'promotional', 'announcement', 'onboarding')),
  target_audience text,
  recipient_count integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  bounced_count integer DEFAULT 0,
  unsubscribed_count integer DEFAULT 0,
  scheduled_date timestamptz,
  sent_date timestamptz,
  metrics jsonb DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on email_campaigns
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

-- RLS policies for email_campaigns
CREATE POLICY "Super admins can view all email campaigns"
  ON public.email_campaigns FOR SELECT
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert email campaigns"
  ON public.email_campaigns FOR INSERT
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update email campaigns"
  ON public.email_campaigns FOR UPDATE
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete email campaigns"
  ON public.email_campaigns FOR DELETE
  USING (is_super_admin(auth.uid()));

-- Create data_exports table
CREATE TABLE IF NOT EXISTS public.data_exports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  export_type text NOT NULL CHECK (export_type IN ('users', 'messages', 'payments', 'analytics', 'full')),
  format text NOT NULL DEFAULT 'csv' CHECK (format IN ('csv', 'json', 'xlsx', 'pdf')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  filters jsonb DEFAULT '{}'::jsonb,
  selected_fields text[],
  file_url text,
  file_size bigint,
  row_count integer,
  error_message text,
  scheduled boolean DEFAULT false,
  schedule_frequency text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

-- Enable RLS on data_exports
ALTER TABLE public.data_exports ENABLE ROW LEVEL SECURITY;

-- RLS policies for data_exports
CREATE POLICY "Super admins can view all data exports"
  ON public.data_exports FOR SELECT
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert data exports"
  ON public.data_exports FOR INSERT
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update data exports"
  ON public.data_exports FOR UPDATE
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete data exports"
  ON public.data_exports FOR DELETE
  USING (is_super_admin(auth.uid()));

-- Create content_categories table
CREATE TABLE IF NOT EXISTS public.content_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  item_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on content_categories
ALTER TABLE public.content_categories ENABLE ROW LEVEL SECURITY;

-- RLS policies for content_categories
CREATE POLICY "Anyone can view active categories"
  ON public.content_categories FOR SELECT
  USING (active = true);

CREATE POLICY "Super admins can view all categories"
  ON public.content_categories FOR SELECT
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert categories"
  ON public.content_categories FOR INSERT
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update categories"
  ON public.content_categories FOR UPDATE
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete categories"
  ON public.content_categories FOR DELETE
  USING (is_super_admin(auth.uid()));

-- Create category_items table
CREATE TABLE IF NOT EXISTS public.category_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.content_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  item_type text NOT NULL CHECK (item_type IN ('text', 'single_choice', 'multiple_choice', 'boolean')),
  display_order integer NOT NULL DEFAULT 0,
  options text[],
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on category_items
ALTER TABLE public.category_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for category_items
CREATE POLICY "Anyone can view active items"
  ON public.category_items FOR SELECT
  USING (active = true);

CREATE POLICY "Super admins can view all items"
  ON public.category_items FOR SELECT
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert items"
  ON public.category_items FOR INSERT
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update items"
  ON public.category_items FOR UPDATE
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete items"
  ON public.category_items FOR DELETE
  USING (is_super_admin(auth.uid()));

-- Create indexes for better performance
CREATE INDEX idx_ab_tests_status ON public.ab_tests(status);
CREATE INDEX idx_ab_tests_created_by ON public.ab_tests(created_by);
CREATE INDEX idx_email_campaigns_status ON public.email_campaigns(status);
CREATE INDEX idx_email_campaigns_created_by ON public.email_campaigns(created_by);
CREATE INDEX idx_data_exports_status ON public.data_exports(status);
CREATE INDEX idx_data_exports_created_by ON public.data_exports(created_by);
CREATE INDEX idx_category_items_category_id ON public.category_items(category_id);

-- Create updated_at triggers
CREATE TRIGGER update_ab_tests_updated_at
  BEFORE UPDATE ON public.ab_tests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_categories_updated_at
  BEFORE UPDATE ON public.content_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_category_items_updated_at
  BEFORE UPDATE ON public.category_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();