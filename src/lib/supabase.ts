import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl === "YOUR_SUPABASE_URL") supabaseUrl = "";
if (supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY") supabaseAnonKey = "";

// Para evitar que a build trave caso o usuário não tenha o supabase configurado,
// inicializamos com strings vazias e avisamos no console em desenvolvimento.
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV === 'development') {
    console.warn("Atenção: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas.");
  }
}

// Safely ensure url is valid http/https format to prevent createClient from crashing
const validUrl = supabaseUrl && supabaseUrl.startsWith("http") 
  ? supabaseUrl 
  : "https://placeholder-project.supabase.co";

export const supabase = createClient(
  validUrl,
  supabaseAnonKey || "placeholder-anon-key"
);

export type Property = {
  id: string;
  title: string;
  code?: string;
  description: string;
  price: number;
  type: 'Sale' | 'Rent';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  location?: string;
  neighborhood?: string | null;
  property_type?: string | null;
  status: 'Available' | 'Sold';
  is_featured?: boolean;
  main_image_url: string;
  gallery_urls: string[] | null;
  video_url: string | null;
  broker_name?: string | null;
  broker_whatsapp?: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  title: string;
  code?: string;
  description: string;
  price_starts_at: number;
  status: 'Launch' | 'InProgress' | 'Ready';
  stage?: string;
  location: string;
  neighborhood?: string | null;
  property_type?: string | null;
  features: string[];
  main_image_url: string;
  gallery_urls: string[] | null;
  video_url: string | null;
  broker_name?: string | null;
  broker_whatsapp?: string | null;
  created_at: string;
};
