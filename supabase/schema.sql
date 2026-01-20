-- PriceIQ Master Schema (Re-initialization)
-- Run this in Supabase > SQL Editor > New Query

-- !!! WARNING: THIS WILL DELETE EXISTING DATA !!!
DROP TABLE IF EXISTS public.rate_submissions CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.skills CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop functions/triggers to avoid conflicts
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.get_market_rates(INT, INT) CASCADE;

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. PUBLIC TABLES
-- ==========================================

-- PROFILES (Linked to Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role VARCHAR(20) DEFAULT 'user', -- 'user', 'admin'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SKILLS (Pre-seeded data)
CREATE TABLE public.skills (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Frontend', 'Backend', 'Fullstack', 'Mobile', 'Design', 'DevOps', 'Data', 'Other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- LOCATIONS (Pre-seeded data)
CREATE TABLE public.locations (
  id SERIAL PRIMARY KEY,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  UNIQUE(city, country)
);

-- RATE SUBMISSIONS (Core Data)
CREATE TABLE public.rate_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Can be null for anonymous mvp (optional)
  
  skill_id INT REFERENCES public.skills(id) ON DELETE RESTRICT,
  location_id INT REFERENCES public.locations(id) ON DELETE RESTRICT,
  
  hourly_rate NUMERIC(10, 2) NOT NULL CHECK (hourly_rate > 0),
  years_experience NUMERIC(3, 1) NOT NULL CHECK (years_experience >= 0),
  seniority_level TEXT NOT NULL CHECK (seniority_level IN ('Junior', 'Mid', 'Senior', 'Lead', 'Expert')),
  project_type TEXT CHECK (project_type IN ('Hourly', 'Fixed', 'Retainer')),
  
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE, -- Requires admin approval to show in public stats?
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: Viewable by owner, Editable by owner
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Skills/Locations: Public Read Only
CREATE POLICY "Skills are viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Locations are viewable by everyone" ON public.locations FOR SELECT USING (true);

-- Rate Submissions: Public Read (Aggregated usually, but row access allowed for verify)
CREATE POLICY "Rates are viewable by everyone" ON public.rate_submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can submit rates" ON public.rate_submissions FOR INSERT WITH CHECK (true);

-- ==========================================
-- 4. AUTOMATION & TRIGGERS
-- ==========================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Helper Function: Get Market Rates (RPC)
CREATE OR REPLACE FUNCTION get_market_rates(
    target_skill_id INT,
    target_location_id INT DEFAULT NULL
)
RETURNS TABLE (
    min_rate NUMERIC,
    max_rate NUMERIC,
    avg_rate NUMERIC,
    p25_rate NUMERIC,
    p50_rate NUMERIC,
    p75_rate NUMERIC,
    p90_rate NUMERIC,
    total_count INT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        MIN(hourly_rate),
        MAX(hourly_rate),
        AVG(hourly_rate)::NUMERIC,
        percentile_cont(0.25) WITHIN GROUP (ORDER BY hourly_rate)::NUMERIC as p25,
        percentile_cont(0.50) WITHIN GROUP (ORDER BY hourly_rate)::NUMERIC as p50,
        percentile_cont(0.75) WITHIN GROUP (ORDER BY hourly_rate)::NUMERIC as p75,
        percentile_cont(0.90) WITHIN GROUP (ORDER BY hourly_rate)::NUMERIC as p90,
        COUNT(*)::INT
    FROM rate_submissions
    WHERE skill_id = target_skill_id
    AND (target_location_id IS NULL OR location_id = target_location_id);
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 5. SEED DATA
-- ==========================================

INSERT INTO public.skills (name, category) VALUES
('React', 'Frontend'), ('Node.js', 'Backend'), ('Python', 'Backend'), 
('UI/UX Design', 'Design'), ('DevOps', 'DevOps'), ('Flutter', 'Mobile'),
('Next.js', 'Frontend'), ('Go', 'Backend'), ('Rust', 'Backend'), ('Figma', 'Design')
ON CONFLICT DO NOTHING;

INSERT INTO public.locations (city, country, currency) VALUES
('San Francisco', 'USA', 'USD'), ('New York', 'USA', 'USD'),
('London', 'UK', 'GBP'), ('Berlin', 'Germany', 'EUR'),
('Bangalore', 'India', 'INR'), ('Remote', 'Global', 'USD'),
('Toronto', 'Canada', 'CAD'), ('Sydney', 'Australia', 'AUD')
ON CONFLICT DO NOTHING;
