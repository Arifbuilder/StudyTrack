-- ==============================================================================
-- SYLLABUSSYNC CROSS-DEVICE REALTIME SYNCHRONIZATION MIGRATION
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- This allows instant desktop ↔ mobile syncing across all devices and phones!
-- ==============================================================================

-- 1. Profiles table: allow string/UUID student IDs and disable restrictive RLS
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE IF EXISTS public.profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE IF EXISTS public.profiles DISABLE ROW LEVEL SECURITY;

-- 2. User Topic Progress table: support string student IDs and desktop ↔ mobile sync
ALTER TABLE IF EXISTS public.user_topic_progress DROP CONSTRAINT IF EXISTS user_topic_progress_user_id_fkey;
ALTER TABLE IF EXISTS public.user_topic_progress DROP CONSTRAINT IF EXISTS user_topic_progress_user_id_topic_id_key;
ALTER TABLE IF EXISTS public.user_topic_progress ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.user_topic_progress ADD CONSTRAINT user_topic_progress_user_id_topic_id_key UNIQUE (user_id, topic_id);
ALTER TABLE IF EXISTS public.user_topic_progress DISABLE ROW LEVEL SECURITY;

-- 3. User Settings & Custom Topics & Tasks
ALTER TABLE IF EXISTS public.user_settings DROP CONSTRAINT IF EXISTS user_settings_user_id_fkey;
ALTER TABLE IF EXISTS public.user_settings ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.user_settings DISABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.study_tasks DROP CONSTRAINT IF EXISTS study_tasks_user_id_fkey;
ALTER TABLE IF EXISTS public.study_tasks ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.study_tasks DISABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.custom_topics DROP CONSTRAINT IF EXISTS custom_topics_user_id_fkey;
ALTER TABLE IF EXISTS public.custom_topics ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE IF EXISTS public.custom_topics DISABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.friendships DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.friend_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.study_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.group_members DISABLE ROW LEVEL SECURITY;

-- 4. Enable Supabase Realtime Broadcast for instant cross-device updates
ALTER TABLE IF EXISTS public.user_topic_progress REPLICA IDENTITY FULL;
ALTER TABLE IF EXISTS public.profiles REPLICA IDENTITY FULL;

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

-- 5. Seed default super-admin account if not already present
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
