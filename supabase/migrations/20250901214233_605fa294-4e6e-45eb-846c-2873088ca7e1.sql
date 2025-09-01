-- Create dashboard_stats table for admin dashboard statistics
CREATE TABLE public.dashboard_stats (
  id INTEGER PRIMARY KEY,
  stat_name VARCHAR NOT NULL,
  stat_value INTEGER NOT NULL DEFAULT 0,
  change_percentage DECIMAL(5,2) NOT NULL DEFAULT 0,
  trend VARCHAR CHECK (trend IN ('positive', 'negative', 'neutral')) DEFAULT 'neutral',
  icon VARCHAR NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for super admin access
CREATE POLICY "Allow super_admin access to dashboard_stats" 
ON public.dashboard_stats 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_roles.user_id = auth.uid() 
  AND user_roles.role = 'super_admin'
));

-- Insert default dashboard statistics
INSERT INTO public.dashboard_stats (id, stat_name, stat_value, change_percentage, trend, icon) VALUES
(1, 'Total Users', 1250, 12.5, 'positive', 'Users'),
(2, 'Active Users', 842, 8.3, 'positive', 'UserCheck'),
(3, 'New Matches', 156, -2.1, 'negative', 'Heart'),
(4, 'Messages Sent', 3420, 15.7, 'positive', 'MessageCircle');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_dashboard_stats_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dashboard_stats_updated_at
BEFORE UPDATE ON public.dashboard_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_dashboard_stats_updated_at_column();