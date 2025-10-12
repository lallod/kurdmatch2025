-- Phase 1: Multi-Language Landing Page Infrastructure

-- 1. Landing page translations table for multi-language support
CREATE TABLE IF NOT EXISTS landing_page_translations (
  id BIGSERIAL PRIMARY KEY,
  language_code VARCHAR(20) NOT NULL,
  content JSONB NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(language_code)
);

-- 2. Dynamic sections table for flexible page building
CREATE TABLE IF NOT EXISTS landing_page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code VARCHAR(20) NOT NULL,
  section_type VARCHAR(50) NOT NULL,
  section_order INTEGER NOT NULL,
  content JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Version snapshots for rollback capability
CREATE TABLE IF NOT EXISTS landing_page_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language_code VARCHAR(20) NOT NULL,
  version_name VARCHAR(100),
  content JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Admin audit log for tracking changes
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action_type VARCHAR(50) NOT NULL,
  table_name VARCHAR(100),
  record_id TEXT,
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE landing_page_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_page_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for landing_page_translations
CREATE POLICY "Public can read published translations" 
ON landing_page_translations FOR SELECT 
USING (is_published = true);

CREATE POLICY "Super admins have full access to translations" 
ON landing_page_translations FOR ALL 
USING (public.is_super_admin(auth.uid()));

-- RLS Policies for landing_page_sections
CREATE POLICY "Public can read active sections" 
ON landing_page_sections FOR SELECT 
USING (is_active = true);

CREATE POLICY "Super admins have full access to sections" 
ON landing_page_sections FOR ALL 
USING (public.is_super_admin(auth.uid()));

-- RLS Policies for landing_page_snapshots
CREATE POLICY "Super admins can view all snapshots" 
ON landing_page_snapshots FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can create snapshots" 
ON landing_page_snapshots FOR INSERT 
WITH CHECK (public.is_super_admin(auth.uid()));

-- RLS Policies for admin_audit_log
CREATE POLICY "Super admins can view all audit logs" 
ON admin_audit_log FOR SELECT 
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "System can insert audit logs" 
ON admin_audit_log FOR INSERT 
WITH CHECK (true);

-- Create update timestamp trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_landing_page_translations_updated_at 
BEFORE UPDATE ON landing_page_translations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_landing_page_sections_updated_at 
BEFORE UPDATE ON landing_page_sections 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default content for supported languages
INSERT INTO landing_page_translations (language_code, content, is_published) VALUES
('kurdish_sorani', '{"hero": {"title": "هاوڕێکەی کوردیی خۆت بدۆزەرەوە", "subtitle": "یەکەم پلاتفۆرمی یاری ڕاستەقینە بۆ کوردان لە هەموو بەشەکانی کوردستان و دیاسپۆرا", "tagline": "گرێدانی دڵەکانی کورد", "cta": "دەست بکە بە گەشت"}, "features": {"title": "گرێدانی دڵەکانی کورد", "items": [{"icon": "Globe", "title": "پەیوەندی جیهانی", "description": "پەیوەندی بکە لەگەڵ کوردانی تەنها لە هەموو هەرێمەکانی کوردستان"}, {"icon": "Users", "title": "تێگەیشتنی کلتوری", "description": "کەسێک بدۆزەرەوە کە کلتوری کوردی بەشداری بکات"}]}}', true),
('kurdish_kurmanci', '{"hero": {"title": "Hevşêra Kurdî ya xwe bibîne", "subtitle": "Platforma yekem a rast bo gelê Kurd ji hemû perçeyên Kurdistanê û diyaspora", "tagline": "Girêdana dilan Kurdî", "cta": "Destpêbike"}, "features": {"title": "Girêdana dilan Kurdî", "items": [{"icon": "Globe", "title": "Girêdana cîhanî", "description": "Bi yekîtiyên Kurd ên ji hemû herêman ve girêdan"}, {"icon": "Users", "title": "Têgihiştina çandî", "description": "Kesek bibîne ku çanda Kurdî parve bike"}]}}', true),
('english', '{"hero": {"title": "Find Your Kurdish Match", "subtitle": "The first dating platform designed exclusively for Kurdish people from all parts of Kurdistan and the diaspora", "tagline": "Connecting Kurdish Hearts", "cta": "Start Your Journey"}, "features": {"title": "Connecting Kurdish Hearts", "items": [{"icon": "Globe", "title": "Worldwide Connection", "description": "Connect with Kurdish singles from all regions of Kurdistan and across the global diaspora"}, {"icon": "Users", "title": "Cultural Understanding", "description": "Find someone who shares your Kurdish heritage, traditions, and values"}]}}', true),
('norwegian', '{"hero": {"title": "Finn din kurdiske match", "subtitle": "Den første datingplattformen designet eksklusivt for kurdiske mennesker fra alle deler av Kurdistan og diasporaen", "tagline": "Kobler kurdiske hjerter", "cta": "Start din reise"}, "features": {"title": "Kobler kurdiske hjerter", "items": [{"icon": "Globe", "title": "Verdensomspennende forbindelse", "description": "Koble med kurdiske singler fra alle regioner av Kurdistan"}, {"icon": "Users", "title": "Kulturell forståelse", "description": "Finn noen som deler din kurdiske arv og verdier"}]}}', true)
ON CONFLICT (language_code) DO NOTHING;

COMMENT ON TABLE landing_page_translations IS 'Stores landing page content in multiple languages with version control';
COMMENT ON TABLE landing_page_sections IS 'Dynamic, reorderable sections for the landing page with multi-language support';
COMMENT ON TABLE landing_page_snapshots IS 'Historical snapshots of landing page content for version control and rollback';
COMMENT ON TABLE admin_audit_log IS 'Tracks all admin actions for security and accountability';