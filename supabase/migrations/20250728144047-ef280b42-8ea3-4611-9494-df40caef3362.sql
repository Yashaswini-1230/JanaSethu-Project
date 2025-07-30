-- Create storage buckets and policies for verification documents and complaint images
INSERT INTO storage.buckets (id, name, public) VALUES ('verification-documents', 'verification-documents', false);

-- Create policies for verification documents bucket
CREATE POLICY "Users can upload their own verification documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'verification-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own verification documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'verification-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all verification documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'verification-documents' AND get_user_role(auth.uid()) = 'admin');

-- Update complaint-images bucket policies for better access
CREATE POLICY "Anyone can view complaint images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'complaint-images');

-- Enable realtime for community chats
ALTER TABLE community_chats REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE community_chats;