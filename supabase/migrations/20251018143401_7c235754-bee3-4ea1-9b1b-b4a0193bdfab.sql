
-- Fix security issue: Add search_path to update_updated_at_column function
-- This prevents potential SQL injection and privilege escalation attacks

DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Recreate all triggers that use this function
-- (Triggers are automatically dropped when the function is dropped with CASCADE)

-- Trigger for profiles table
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for groups table
CREATE TRIGGER update_groups_updated_at
    BEFORE UPDATE ON public.groups
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for events table
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for profile_details table
CREATE TRIGGER update_profile_details_updated_at
    BEFORE UPDATE ON public.profile_details
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for ab_tests table
CREATE TRIGGER update_ab_tests_updated_at
    BEFORE UPDATE ON public.ab_tests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for payments table
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for user_subscriptions table
CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for system_settings table
CREATE TRIGGER update_system_settings_updated_at
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for landing_page_sections table
CREATE TRIGGER update_landing_page_sections_updated_at
    BEFORE UPDATE ON public.landing_page_sections
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for landing_page_v2_translations table
CREATE TRIGGER update_landing_page_v2_translations_updated_at
    BEFORE UPDATE ON public.landing_page_v2_translations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for landing_page_translations table  
CREATE TRIGGER update_landing_page_translations_updated_at
    BEFORE UPDATE ON public.landing_page_translations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for landing_page_content table
CREATE TRIGGER update_landing_page_content_updated_at
    BEFORE UPDATE ON public.landing_page_content
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for daily_usage table
CREATE TRIGGER update_daily_usage_updated_at
    BEFORE UPDATE ON public.daily_usage
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for category_items table
CREATE TRIGGER update_category_items_updated_at
    BEFORE UPDATE ON public.category_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON FUNCTION public.update_updated_at_column() IS 
'Automatically updates the updated_at column to the current timestamp. SECURITY DEFINER with search_path set to prevent privilege escalation.';
