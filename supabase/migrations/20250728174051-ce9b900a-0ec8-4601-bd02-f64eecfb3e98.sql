-- Create admin settings table for storing the global admin PIN
CREATE TABLE public.admin_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_pin_hash text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create admin sessions table to track active admin sessions
CREATE TABLE public.admin_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_settings (only admins can read/write)
CREATE POLICY "Only authenticated users can read admin settings" 
ON public.admin_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only admins can update admin settings" 
ON public.admin_settings 
FOR UPDATE 
USING (get_user_role(auth.uid()) = 'admin'::app_role);

-- RLS policies for admin_sessions
CREATE POLICY "Users can view their own admin sessions" 
ON public.admin_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own admin sessions" 
ON public.admin_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own admin sessions" 
ON public.admin_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own admin sessions" 
ON public.admin_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to validate admin PIN
CREATE OR REPLACE FUNCTION public.validate_admin_pin(pin_input text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    stored_hash text;
BEGIN
    SELECT admin_pin_hash INTO stored_hash
    FROM admin_settings
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF stored_hash IS NULL THEN
        RETURN false;
    END IF;
    
    RETURN crypt(pin_input, stored_hash) = stored_hash;
END;
$$;

-- Create function to check if user has active admin session
CREATE OR REPLACE FUNCTION public.has_active_admin_session(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM admin_sessions 
        WHERE admin_sessions.user_id = has_active_admin_session.user_id 
        AND expires_at > now()
    );
END;
$$;

-- Create function to create admin session
CREATE OR REPLACE FUNCTION public.create_admin_session(user_id uuid, duration_hours integer DEFAULT 2)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    session_id uuid;
BEGIN
    -- Delete any existing sessions for this user
    DELETE FROM admin_sessions WHERE admin_sessions.user_id = create_admin_session.user_id;
    
    -- Create new session
    INSERT INTO admin_sessions (user_id, expires_at)
    VALUES (user_id, now() + (duration_hours || ' hours')::interval)
    RETURNING id INTO session_id;
    
    RETURN session_id;
END;
$$;

-- Insert default admin PIN (hashed version of "admin123" - should be changed in production)
INSERT INTO admin_settings (admin_pin_hash) 
VALUES (crypt('admin123', gen_salt('bf')));

-- Add trigger for updated_at
CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();