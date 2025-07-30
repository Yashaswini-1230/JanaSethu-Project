-- Add additional profile fields for user profile management
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nickname text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS mobile text,
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS area text;

-- Update complaints table to support multiple images
ALTER TABLE public.complaints 
ADD COLUMN IF NOT EXISTS image_urls jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS latitude decimal,
ADD COLUMN IF NOT EXISTS longitude decimal;