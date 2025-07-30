-- Create enum for admin verification status
CREATE TYPE verification_status AS ENUM ('Pending', 'Approved', 'Rejected');

-- Create admin_verifications table
CREATE TABLE public.admin_verifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    colony_name TEXT NOT NULL,
    colony_code TEXT NOT NULL,
    document_url TEXT NOT NULL,
    status verification_status NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create community_chats table for realtime chat
CREATE TABLE public.community_chats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    colony_code TEXT NOT NULL,
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.admin_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_chats ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_verifications
CREATE POLICY "Users can view their own verifications" 
ON public.admin_verifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verifications" 
ON public.admin_verifications 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all verifications" 
ON public.admin_verifications 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admins can update verification status" 
ON public.admin_verifications 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'admin');

-- RLS policies for community_chats
CREATE POLICY "Users can view chats from their colony" 
ON public.community_chats 
FOR SELECT 
USING (
    colony_code IN (
        SELECT p.area FROM profiles p WHERE p.user_id = auth.uid()
        UNION
        SELECT av.colony_code FROM admin_verifications av 
        WHERE av.user_id = auth.uid() AND av.status = 'Approved'
    )
);

CREATE POLICY "Users can insert chats to their colony" 
ON public.community_chats 
FOR INSERT 
WITH CHECK (
    auth.uid() = user_id AND
    colony_code IN (
        SELECT p.area FROM profiles p WHERE p.user_id = auth.uid()
        UNION
        SELECT av.colony_code FROM admin_verifications av 
        WHERE av.user_id = auth.uid() AND av.status = 'Approved'
    )
);

-- Add area/colony_code to profiles if not exists (for citizen area assignment)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS area TEXT;

-- Add delete policy for complaints (users can delete their own complaints)
CREATE POLICY "Users can delete their own complaints" 
ON public.complaints 
FOR DELETE 
USING (auth.uid() = user_id);

-- Update trigger for admin_verifications
CREATE TRIGGER update_admin_verifications_updated_at
BEFORE UPDATE ON public.admin_verifications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if user is verified admin
CREATE OR REPLACE FUNCTION public.is_verified_admin(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_verifications 
        WHERE admin_verifications.user_id = is_verified_admin.user_id 
        AND status = 'Approved'
    );
END;
$$;

-- Create function to get user's colony code
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