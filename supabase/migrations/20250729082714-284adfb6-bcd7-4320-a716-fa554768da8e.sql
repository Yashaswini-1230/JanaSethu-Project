-- Fix RLS policies for events, polls, and alerts to work with admin sessions
-- The issue is that pin_code is required but not being set in inserts

-- First, let's update the RLS policies to allow inserts when user has admin session
-- and automatically populate pin_code from user's profile

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage polls" ON public.polls;
DROP POLICY IF EXISTS "Admins can manage alerts" ON public.alerts;

-- Create new policies that allow admin operations
CREATE POLICY "Admins can manage events" 
ON public.events 
FOR ALL 
USING (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
)
WITH CHECK (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
);

CREATE POLICY "Admins can manage polls" 
ON public.polls 
FOR ALL 
USING (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
)
WITH CHECK (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
);

CREATE POLICY "Admins can manage alerts" 
ON public.alerts 
FOR ALL 
USING (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
)
WITH CHECK (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
);

-- Create a function to get user's colony code (pin_code)
CREATE OR REPLACE FUNCTION public.get_user_colony_code(user_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    colony_code text;
BEGIN
    -- First check if user is verified admin
    SELECT av.colony_code INTO colony_code
    FROM admin_verifications av
    WHERE av.user_id = get_user_colony_code.user_id AND av.status = 'Approved';
    
    -- If not admin, get from profile area
    IF colony_code IS NULL THEN
        SELECT p.area INTO colony_code
        FROM profiles p
        WHERE p.user_id = get_user_colony_code.user_id;
    END IF;
    
    RETURN colony_code;
END;
$$;