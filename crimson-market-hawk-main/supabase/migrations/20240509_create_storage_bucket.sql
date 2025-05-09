
-- Create a storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'Listing Images', true);

-- Allow authenticated users to upload files to the listings bucket
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'listings' AND auth.uid() = owner);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'listings' AND auth.uid() = owner);

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'listings' AND auth.uid() = owner);

-- Allow public read access to all files in the listings bucket
CREATE POLICY "Public read access for listing images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'listings');
