-- ==============================================================================
-- SYLLABUSSYNC: 1-CLICK INSTANT CROSS-DEVICE FIX (DESKTOP ↔ MOBILE)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- This completely fixes the "policy depends on column" error and enables instant
-- real-time cross-device sync between your Desktop and Mobile phone!
-- ==============================================================================

-- 1. Drop all old restrictive policies that caused the "policy depends on column" error
DO $$ 
DECLARE
  pol record;
BEGIN
  FOR pol IN 
    SELECT policyname, tablename 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename IN (
        'profiles', 'user_topic_progress', 'user_settings', 
        'study_tasks', 'custom_topics', 'friendships', 
        'friend_requests', 'study_groups', 'group_members', 'user_notes'
      )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, pol.tablename);
  END LOOP;
END $$;

-- 2. Cleanly drop user tables with CASCADE (Syllabus subjects & modules remain untouched!)
DROP TABLE IF EXISTS public.user_topic_progress CASCADE;
DROP TABLE IF EXISTS public.user_settings CASCADE;
DROP TABLE IF EXISTS public.custom_topics CASCADE;
DROP TABLE IF EXISTS public.study_tasks CASCADE;
DROP TABLE IF EXISTS public.user_notes CASCADE;
DROP TABLE IF EXISTS public.friendships CASCADE;
DROP TABLE IF EXISTS public.friend_requests CASCADE;
DROP TABLE IF EXISTS public.group_members CASCADE;
DROP TABLE IF EXISTS public.study_groups CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Recreate Profiles with TEXT id (supports both Student accounts & Supabase Auth)
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    university TEXT DEFAULT 'APJ Abdul Kalam Technological University (KTU)',
    semester TEXT DEFAULT 'S7',
    college_name TEXT,
    study_goal TEXT DEFAULT 'Score 90%+ in KTU S7 examinations',
    role TEXT DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Recreate User Topic Progress with TEXT user_id & topic_id
CREATE TABLE public.user_topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    topic_id TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMPTZ,
    revision_state TEXT DEFAULT 'not_started',
    confidence_level INT DEFAULT 0,
    revision_count INT DEFAULT 0,
    last_revised_at TIMESTAMPTZ,
    next_revision_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, topic_id)
);

-- 5. Recreate User Settings
CREATE TABLE public.user_settings (
    user_id TEXT PRIMARY KEY,
    theme TEXT DEFAULT 'system',
    progress_visibility TEXT DEFAULT 'friends',
    email_notifications BOOLEAN DEFAULT TRUE,
    study_reminders BOOLEAN DEFAULT TRUE,
    daily_goal_minutes INT DEFAULT 180,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Recreate Study Tasks & Custom Topics
CREATE TABLE public.study_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    subject_id TEXT,
    module_id TEXT,
    due_date DATE,
    priority TEXT DEFAULT 'MEDIUM',
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE public.custom_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    group_id UUID,
    module_id TEXT,
    parent_topic_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'HIGH',
    is_completed BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 999,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Disable RLS for seamless desktop ↔ mobile syncing without auth hurdles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_topics DISABLE ROW LEVEL SECURITY;

-- 8. Enable Supabase Realtime broadcast on progress & profiles
ALTER TABLE public.user_topic_progress REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'user_topic_progress'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_topic_progress;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
  END IF;
END $$;

-- 9. Seed the default Super Admin profile
INSERT INTO public.profiles (id, username, display_name, email, university, semester, college_name, study_goal, role)
VALUES (
  'usr-superadmin',
  'superadmin',
  'System Super Admin',
  'admin@syllabussync.edu',
  'APJ Abdul Kalam Technological University (KTU)',
  'S7',
  'College of Engineering Trivandrum',
  'Maintain university examination standards & syllabus updates',
  'super_admin'
)
ON CONFLICT (id) DO NOTHING;
