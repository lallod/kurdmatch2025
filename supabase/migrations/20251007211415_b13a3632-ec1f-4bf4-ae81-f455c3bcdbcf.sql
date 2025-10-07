-- CRITICAL SECURITY FIX #1: Add security definer function for role checking
-- This prevents infinite recursion and privilege escalation attacks

-- Create enum for roles if not exists
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'moderator', 'user');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create security definer function to check user roles
-- This prevents infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = _role
  )
$$;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text = 'super_admin'
  )
$$;

-- CRITICAL SECURITY FIX #2: Enable RLS on all remaining tables
-- Enable RLS on tables that don't have it

ALTER TABLE public.user_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_login_providers ENABLE ROW LEVEL SECURITY;

-- CRITICAL SECURITY FIX #3: Fix user_roles policies using security definer function
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow users to view their own roles" ON public.user_roles;

-- Only super admins can manage all roles
CREATE POLICY "Super admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Users can view only their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- CRITICAL SECURITY FIX #4: Restrict admin tables to super admins only
DROP POLICY IF EXISTS "Allow super_admin access to user_engagement" ON public.user_engagement;
DROP POLICY IF EXISTS "Allow super_admin access to admin_activities" ON public.admin_activities;
DROP POLICY IF EXISTS "Allow super_admin access to dashboard_stats" ON public.dashboard_stats;

CREATE POLICY "Only super admins can access user engagement"
ON public.user_engagement
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Only super admins can access admin activities"
ON public.admin_activities
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Only super admins can access dashboard stats"
ON public.dashboard_stats
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- CRITICAL SECURITY FIX #5: Strengthen reports access
-- Only super admins should see all reports
DROP POLICY IF EXISTS "Super admins can view all reports" ON public.reports;

CREATE POLICY "Super admins can view all reports"
ON public.reports
FOR SELECT
TO authenticated
USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins can update reports"
ON public.reports
FOR UPDATE
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- CRITICAL SECURITY FIX #6: Fix function search paths
-- Update all functions to have proper search_path

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_dashboard_stats_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add comments for documentation
COMMENT ON FUNCTION public.has_role IS 'Security definer function to check if a user has a specific role. Prevents infinite recursion in RLS policies.';
COMMENT ON FUNCTION public.is_super_admin IS 'Security definer function to check if a user is a super admin. Used in RLS policies for admin-only access.';