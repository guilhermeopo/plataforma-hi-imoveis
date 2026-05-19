-- Create properties table
CREATE TABLE public.properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL,
  type text NOT NULL CHECK (type IN ('Sale', 'Rent')),
  bedrooms int DEFAULT 0,
  bathrooms int DEFAULT 0,
  area int DEFAULT 0,
  location text,
  status text NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Sold')),
  main_image_url text NOT NULL,
  gallery_urls text[] DEFAULT '{}',
  video_url text,
  broker_name text,
  broker_whatsapp text,
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

-- Create projects table
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  code text,
  description text NOT NULL,
  price_starts_at numeric NOT NULL,
  status text NOT NULL DEFAULT 'Launch' CHECK (status IN ('Launch', 'InProgress', 'Ready')),
  stage text,
  location text NOT NULL,
  features text[] DEFAULT '{}',
  main_image_url text NOT NULL,
  gallery_urls text[] DEFAULT '{}',
  video_url text,
  broker_name text,
  broker_whatsapp text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by everyone."
  ON public.projects FOR SELECT
  USING ( true );

CREATE POLICY "Enable insert projects for all users"
  ON public.projects FOR INSERT
  WITH CHECK ( true );

CREATE POLICY "Enable update projects for all users"
  ON public.projects FOR UPDATE
  USING ( true )
  WITH CHECK ( true );

CREATE POLICY "Enable delete projects for all users"
  ON public.projects FOR DELETE
  USING ( true );

-- Storage Setup Instructions:
-- 1. Create a public bucket called 'properties' in Supabase Storage
-- 2. Run the policies below in SQL Editor to enable access

-- Enable public access for bucket 'properties'
-- CREATE POLICY "Public Storage Select" ON storage.objects FOR SELECT USING ( bucket_id = 'properties' );
-- CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'properties' );

-- Create team_members table
CREATE TABLE public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security for Team Members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team Members are viewable by everyone."
  ON public.team_members FOR SELECT
  USING ( true );

CREATE POLICY "Enable insert team members for all users"
  ON public.team_members FOR INSERT
  WITH CHECK ( true );

CREATE POLICY "Enable update team members for all users"
  ON public.team_members FOR UPDATE
  USING ( true )
  WITH CHECK ( true );

CREATE POLICY "Enable delete team members for all users"
  ON public.team_members FOR DELETE
  USING ( true );
