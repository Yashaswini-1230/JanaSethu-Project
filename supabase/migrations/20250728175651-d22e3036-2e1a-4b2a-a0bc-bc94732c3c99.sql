-- Update admin PIN to the user's preferred PIN (5102)
UPDATE admin_settings 
SET admin_pin_hash = crypt('5102', gen_salt('bf', 10)),
    updated_at = now();

-- If no admin settings exist, insert the new PIN
INSERT INTO admin_settings (admin_pin_hash)
SELECT crypt('5102', gen_salt('bf', 10))
WHERE NOT EXISTS (SELECT 1 FROM admin_settings);

-- Update the create_admin_session function to use 8 hours by default instead of 2
CREATE OR REPLACE FUNCTION public.create_admin_session(user_id uuid, duration_hours integer DEFAULT 8)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;