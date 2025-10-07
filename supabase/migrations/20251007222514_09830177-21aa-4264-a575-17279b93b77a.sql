-- Create system_settings table for persistent admin settings
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL DEFAULT '{}',
  category TEXT NOT NULL, -- 'general', 'email', 'security', 'api'
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create system_metrics table for real monitoring data
CREATE TABLE IF NOT EXISTS public.system_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL, -- 'api_performance', 'resource_usage', 'incident'
  metric_data JSONB NOT NULL DEFAULT '{}',
  severity TEXT, -- 'info', 'warning', 'critical'
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for system_settings (super admins only)
CREATE POLICY "Super admins can view system settings"
  ON public.system_settings
  FOR SELECT
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert system settings"
  ON public.system_settings
  FOR INSERT
  WITH CHECK (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update system settings"
  ON public.system_settings
  FOR UPDATE
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can delete system settings"
  ON public.system_settings
  FOR DELETE
  USING (is_super_admin(auth.uid()));

-- Create policies for system_metrics (super admins only)
CREATE POLICY "Super admins can view system metrics"
  ON public.system_metrics
  FOR SELECT
  USING (is_super_admin(auth.uid()));

CREATE POLICY "Super admins can insert system metrics"
  ON public.system_metrics
  FOR INSERT
  WITH CHECK (is_super_admin(auth.uid()));

-- Create indexes for performance
CREATE INDEX idx_system_settings_key ON public.system_settings(setting_key);
CREATE INDEX idx_system_settings_category ON public.system_settings(category);
CREATE INDEX idx_system_metrics_type ON public.system_metrics(metric_type);
CREATE INDEX idx_system_metrics_timestamp ON public.system_metrics(timestamp DESC);
CREATE INDEX idx_system_metrics_severity ON public.system_metrics(severity);

-- Create trigger for updated_at on system_settings
CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, category, description) VALUES
  ('maintenance_mode', '{"enabled": false}', 'general', 'System maintenance mode'),
  ('user_registration', '{"enabled": true}', 'general', 'Allow new user registrations'),
  ('photo_uploads', '{"enabled": true}', 'general', 'Allow photo uploads'),
  ('message_system', '{"enabled": true}', 'general', 'Enable messaging system'),
  ('app_name', '{"value": "KurdMatch"}', 'general', 'Application name'),
  ('support_email', '{"value": "support@kurdmatch.com"}', 'general', 'Support email address'),
  ('smtp_host', '{"value": "smtp.example.com"}', 'email', 'SMTP server host'),
  ('smtp_port', '{"value": "587"}', 'email', 'SMTP server port'),
  ('smtp_username', '{"value": ""}', 'email', 'SMTP username'),
  ('smtp_password', '{"value": ""}', 'email', 'SMTP password (encrypted)'),
  ('from_email', '{"value": "no-reply@kurdmatch.com"}', 'email', 'From email address'),
  ('daily_digest', '{"enabled": true}', 'email', 'Send daily digest emails'),
  ('new_user_notifications', '{"enabled": true}', 'email', 'New user registration notifications'),
  ('report_alerts', '{"enabled": true}', 'email', 'Content report alerts'),
  ('two_factor_auth', '{"enabled": true}', 'security', 'Two-factor authentication'),
  ('password_expiry', '{"days": 90}', 'security', 'Password expiry days'),
  ('session_timeout', '{"minutes": 30}', 'security', 'Session timeout minutes'),
  ('ip_restriction', '{"enabled": false}', 'security', 'IP-based access restriction'),
  ('rate_limiting', '{"enabled": true}', 'api', 'API rate limiting'),
  ('requests_per_minute', '{"value": 100}', 'api', 'API requests per minute limit')
ON CONFLICT (setting_key) DO NOTHING;