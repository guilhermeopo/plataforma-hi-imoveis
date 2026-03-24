-- Create properties table
CREATE TABLE public.properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('Sale', 'Rent')),
  status text NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Sold')),
  main_image_url text NOT NULL,
  video_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Properties are viewable by everyone."
  ON public.properties FOR SELECT
  USING ( true );

-- For the admin panel, we'll allow all actions for now to work out of the box
CREATE POLICY "Enable insert for all users"
  ON public.properties FOR INSERT
  WITH CHECK ( true );

CREATE POLICY "Enable update for all users"
  ON public.properties FOR UPDATE
  USING ( true )
  WITH CHECK ( true );

CREATE POLICY "Enable delete for all users"
  ON public.properties FOR DELETE
  USING ( true );
