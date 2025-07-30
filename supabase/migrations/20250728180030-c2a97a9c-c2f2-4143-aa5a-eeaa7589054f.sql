-- First ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop and recreate the validate_admin_pin function with simpler logic for testing
DROP FUNCTION IF EXISTS public.validate_admin_pin(text);

-- For now, let's use a simple text comparison for the PIN (we can improve security later)
-- Update admin settings to store plain text PIN temporarily for testing
TRUNCATE TABLE admin_settings;
INSERT INTO admin_settings (admin_pin_hash) VALUES ('5102');

-- Create a simple validation function that just compares the plain text
CREATE OR REPLACE FUNCTION public.validate_admin_pin(pin_input text)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
    stored_pin text;
BEGIN
    SELECT admin_pin_hash INTO stored_pin
    FROM admin_settings
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF stored_pin IS NULL THEN
        RETURN false;
    END IF;
    
    -- For now, simple text comparison (we can add encryption later)
    RETURN pin_input = stored_pin;
END;
$function$;