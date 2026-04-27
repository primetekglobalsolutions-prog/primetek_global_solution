-- ====================================================================
-- Primetek Global Solutions - Supabase Database Schema
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Inquiries Table
-- Stores contact form submissions from the public website
-- ==========================================
CREATE TABLE public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in-progress', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. Jobs Table
-- Stores active and inactive job postings
-- ==========================================
CREATE TABLE public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('full-time', 'contract', 'remote', 'part-time')),
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary_range TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. Applications Table
-- Stores candidate applications linked to jobs
-- ==========================================
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    experience_years NUMERIC,
    cover_letter TEXT,
    resume_url TEXT, -- Path to file in Supabase Storage
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. Employees Table
-- Stores internal employee HR profiles and auth credentials
-- ==========================================
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id TEXT UNIQUE NOT NULL, -- e.g., 'EMP-001'
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Hashed with bcrypt
    role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee', 'hr')),
    join_date DATE NOT NULL,
    department TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'On Leave')),
    avatar_url TEXT, -- Path to file in Supabase Storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 5. Attendance Table
-- Stores daily check-in/out logs with GPS validation
-- ==========================================
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP WITH TIME ZONE,
    check_out TIMESTAMP WITH TIME ZONE,
    duration_hours NUMERIC(4,2), -- e.g., 8.50
    status TEXT CHECK (status IN ('Present', 'Late', 'Absent', 'Half-day')),
    lat NUMERIC(10,6), -- Captured GPS Latitude
    lng NUMERIC(10,6), -- Captured GPS Longitude
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date) -- Enforce max 1 attendance record per employee per day
);

-- ==========================================
-- 6. Office Locations Table
-- Stores approved physical office coordinates for GPS validation
-- ==========================================
CREATE TABLE public.office_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    lat NUMERIC(10,6) NOT NULL,
    lng NUMERIC(10,6) NOT NULL,
    radius_meters INTEGER DEFAULT 500,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Auto-update `updated_at` Triggers
-- ==========================================
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jobs_modtime
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_employees_modtime
    BEFORE UPDATE ON public.employees
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_office_locations_modtime
    BEFORE UPDATE ON public.office_locations
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- Row Level Security (RLS) Configuration
-- ==========================================

-- 1. Enable RLS on all tables
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_locations ENABLE ROW LEVEL SECURITY;

-- 2. Public Access Policies (Anonymous users)
-- Anyone can view active jobs
CREATE POLICY "Public can view active jobs" ON public.jobs 
    FOR SELECT USING (is_active = true);

-- Anyone can submit an inquiry
CREATE POLICY "Public can insert inquiries" ON public.inquiries 
    FOR INSERT WITH CHECK (true);

-- Anyone can submit a job application
CREATE POLICY "Public can insert applications" ON public.applications 
    FOR INSERT WITH CHECK (true);

-- NOTE: Since Primetek uses custom JWT auth (Next.js server-side) instead of Supabase Auth,
-- server API routes should use the SUPABASE_SERVICE_ROLE_KEY to bypass RLS for admin operations 
-- and employee operations. RLS policies here are primarily to restrict direct client-side (anon key) access.

-- ==========================================
-- Storage Buckets
-- ==========================================
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', false) ON CONFLICT (id) DO NOTHING;
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Avatars (Public Read, Authenticated Write handled via Service Role in API)
CREATE POLICY "Public can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Storage Policies for Resumes (Private, handled via Service Role in API)
-- No public policies needed for resumes as they are handled entirely backend-side via Service Role.
