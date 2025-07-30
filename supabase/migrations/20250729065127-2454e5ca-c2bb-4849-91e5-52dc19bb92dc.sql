-- Fix RLS policies for polls and alerts tables
-- Drop existing policies that are too restrictive
DROP POLICY IF EXISTS "Admins can manage polls" ON public.polls;
DROP POLICY IF EXISTS "Admins can manage alerts" ON public.alerts;

-- Create new policies that work with admin sessions
CREATE POLICY "Admins can manage polls" 
ON public.polls 
FOR ALL 
USING (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
);

CREATE POLICY "Admins can manage alerts" 
ON public.alerts 
FOR ALL 
USING (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
);

-- Create contact_messages table for contact form
CREATE TABLE public.contact_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages" 
ON public.contact_messages 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view contact messages
CREATE POLICY "Admins can view contact messages" 
ON public.contact_messages 
FOR SELECT 
USING (
    (get_user_role(auth.uid()) = 'admin'::app_role) OR 
    (has_active_admin_session(auth.uid()))
);

-- Add pin_code column to profiles table for area-based access
ALTER TABLE public.profiles ADD COLUMN pin_code TEXT;

-- Create admin_areas table for area assignments
CREATE TABLE public.admin_areas (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    pin_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(admin_id, pin_code)
);

-- Enable RLS on admin_areas
ALTER TABLE public.admin_areas ENABLE ROW LEVEL SECURITY;

-- Admins can view their own area assignments
CREATE POLICY "Admins can view their own areas" 
ON public.admin_areas 
FOR SELECT 
USING (auth.uid() = admin_id);

-- Super admins can manage all area assignments
CREATE POLICY "Super admins can manage all areas" 
ON public.admin_areas 
FOR ALL 
USING (get_user_role(auth.uid()) = 'admin'::app_role);

-- Add pin_code to complaints, events, polls, and alerts for area filtering
ALTER TABLE public.complaints ADD COLUMN pin_code TEXT;
ALTER TABLE public.events ADD COLUMN pin_code TEXT;
ALTER TABLE public.polls ADD COLUMN pin_code TEXT;
ALTER TABLE public.alerts ADD COLUMN pin_code TEXT;

-- Function to get admin's assigned pin codes
CREATE OR REPLACE FUNCTION public.get_admin_pin_codes(admin_user_id uuid)
RETURNS text[]
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    pin_codes text[];
BEGIN
    SELECT array_agg(pin_code) INTO pin_codes
    FROM admin_areas
    WHERE admin_id = admin_user_id;
    
    RETURN COALESCE(pin_codes, ARRAY[]::text[]);
END;
$$;