-- ============================================================================
-- SYLLABUSSYNC PRODUCTION DATABASE SCHEMA
-- Target: Supabase / PostgreSQL 15+
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. AUTHENTICATION & PROFILES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    university TEXT DEFAULT 'APJ Abdul Kalam Technological University (KTU)',
    semester TEXT DEFAULT 'S7',
    college_name TEXT,
    study_goal TEXT DEFAULT 'Score 90%+ in KTU S7 examinations',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'user')),
    assigned_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, role)
);

CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    progress_visibility TEXT DEFAULT 'private' CHECK (progress_visibility IN ('private', 'friends', 'groups', 'public')),
    email_notifications BOOLEAN DEFAULT TRUE,
    study_reminders BOOLEAN DEFAULT TRUE,
    daily_goal_minutes INT DEFAULT 180,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 2. ACADEMIC SYLLABUS STRUCTURE
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.universities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.schemes (
    id TEXT PRIMARY KEY,
    university_id TEXT REFERENCES public.universities(id) ON DELETE CASCADE,
    year INT NOT NULL,
    title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    scheme_id TEXT REFERENCES public.schemes(id) ON DELETE CASCADE,
    semester TEXT NOT NULL,
    category TEXT NOT NULL,
    credits INT DEFAULT 4,
    lecture_hours INT NOT NULL,
    color TEXT DEFAULT 'indigo',
    textbook TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE CASCADE,
    module_number INT NOT NULL,
    title TEXT NOT NULL,
    lecture_hours INT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.topics (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
    parent_topic_id TEXT REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    display_order INT NOT NULL DEFAULT 1,
    priority TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW')),
    source_provenance TEXT DEFAULT 'Official KTU 2019 Scheme Syllabus PDF',
    is_leaf BOOLEAN DEFAULT TRUE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Layer 2 & 3: Custom / Study Group / Personal Topics
CREATE TABLE IF NOT EXISTS public.custom_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID, -- NULL if purely personal
    module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
    parent_topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'HIGH' CHECK (priority IN ('VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW')),
    is_completed BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 999,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. PROGRESS & REVISIONS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.user_topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMPTZ,
    revision_state TEXT DEFAULT 'not_started' CHECK (revision_state IN ('not_started', 'in_progress', 'studied', 'revision_needed', 'revised', 'confident')),
    confidence_level INT DEFAULT 0 CHECK (confidence_level BETWEEN 0 AND 5),
    revision_count INT DEFAULT 0,
    last_revised_at TIMESTAMPTZ,
    next_revision_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS public.progress_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('checked', 'unchecked', 'revised', 'note_added')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.progress_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    module_id TEXT REFERENCES public.modules(id) ON DELETE CASCADE,
    completed_leaf_count INT NOT NULL DEFAULT 0,
    total_leaf_count INT NOT NULL DEFAULT 0,
    completion_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    calculated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. COLLABORATION (FRIENDS & STUDY GROUPS)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    friend_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('accepted', 'blocked')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, friend_id)
);

CREATE TABLE IF NOT EXISTS public.friend_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (sender_id, receiver_id)
);

CREATE TABLE IF NOT EXISTS public.study_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    invite_code TEXT UNIQUE NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'moderator', 'member')),
    joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (group_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    group_id UUID REFERENCES public.study_groups(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 5. PYQ INTELLIGENCE SYSTEM
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.question_papers (
    id TEXT PRIMARY KEY,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    month TEXT NOT NULL,
    year INT NOT NULL,
    scheme TEXT DEFAULT '2019 Scheme',
    semester TEXT DEFAULT 'S7',
    total_marks INT DEFAULT 100,
    duration_hours INT DEFAULT 3,
    filename TEXT NOT NULL,
    file_url TEXT,
    verified BOOLEAN DEFAULT TRUE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pyq_questions (
    id TEXT PRIMARY KEY,
    paper_id TEXT NOT NULL REFERENCES public.question_papers(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    q_number TEXT NOT NULL,
    part TEXT NOT NULL CHECK (part IN ('A', 'B')),
    marks INT NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('CONCEPT', 'ALGORITHM', 'DIAGRAM', 'NUMERICAL', 'LONG_ANSWER', 'SHORT_ANSWER')),
    page_number INT DEFAULT 1,
    group_id TEXT,
    priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW_EVIDENCE', 'NOT_YET_ANALYZED')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pyq_import_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    paper_id TEXT REFERENCES public.question_papers(id) ON DELETE CASCADE,
    extracted_text TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'corrected', 'discarded')),
    reviewer_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 6. STUDY PLANNER & TASKS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.study_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id TEXT REFERENCES public.subjects(id) ON DELETE SET NULL,
    topic_id TEXT REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    notes TEXT,
    target_date DATE NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    topic_id TEXT NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, topic_id)
);

-- ----------------------------------------------------------------------------
-- 7. ADMINISTRATION & AUDIT LOGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 8. INDEXES FOR HIGH-PERFORMANCE QUERIES
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_topics_module ON public.topics(module_id);
CREATE INDEX IF NOT EXISTS idx_topics_parent ON public.topics(parent_topic_id);
CREATE INDEX IF NOT EXISTS idx_progress_user ON public.user_topic_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_topic ON public.user_topic_progress(topic_id);
CREATE INDEX IF NOT EXISTS idx_pyq_subject ON public.pyq_questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_pyq_module ON public.pyq_questions(module_id);
CREATE INDEX IF NOT EXISTS idx_pyq_topic ON public.pyq_questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_study_tasks_user ON public.study_tasks(user_id);

-- ----------------------------------------------------------------------------
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyq_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = $1 AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone can view usernames/avatars, users can edit their own
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Settings: Only user can view and edit own settings
CREATE POLICY "Users can manage own settings" 
    ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Syllabus: Anyone can read official subjects, modules, topics
CREATE POLICY "Official syllabus is readable by everyone" 
    ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Official modules are readable by everyone" 
    ON public.modules FOR SELECT USING (true);
CREATE POLICY "Official topics are readable by everyone" 
    ON public.topics FOR SELECT USING (true);

-- Syllabus editing: Only admins can insert/update/delete official syllabus
CREATE POLICY "Admins can manage official subjects" 
    ON public.subjects FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage official modules" 
    ON public.modules FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage official topics" 
    ON public.topics FOR ALL USING (public.is_admin(auth.uid()));

-- Custom topics: Users can manage their own personal/group topics
CREATE POLICY "Users can manage own custom topics" 
    ON public.custom_topics FOR ALL USING (auth.uid() = user_id);

-- Progress: Users can manage their own progress
CREATE POLICY "Users can manage own progress" 
    ON public.user_topic_progress FOR ALL USING (auth.uid() = user_id);

-- Progress: Friends can view progress IF user progress_visibility is 'friends' or 'public'
CREATE POLICY "Friends can view shared progress" 
    ON public.user_topic_progress FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM public.friendships f
            JOIN public.user_settings s ON s.user_id = user_topic_progress.user_id
            WHERE f.user_id = user_topic_progress.user_id 
              AND f.friend_id = auth.uid()
              AND f.status = 'accepted'
              AND s.progress_visibility IN ('friends', 'public')
        )
    );

-- Friendships & Requests
CREATE POLICY "Users can view and manage their friendships" 
    ON public.friendships FOR ALL USING (auth.uid() = user_id OR auth.uid() = friend_id);
CREATE POLICY "Users can manage their friend requests" 
    ON public.friend_requests FOR ALL USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Study Groups & Members
CREATE POLICY "Group members can view their groups" 
    ON public.study_groups FOR SELECT USING (
        NOT is_private OR 
        EXISTS (SELECT 1 FROM public.group_members WHERE group_id = study_groups.id AND user_id = auth.uid())
    );
CREATE POLICY "Group owners can update their groups" 
    ON public.study_groups FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Members can view group members" 
    ON public.group_members FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.group_members gm WHERE gm.group_id = group_members.group_id AND gm.user_id = auth.uid())
    );

-- Tasks & Notes
CREATE POLICY "Users can manage own study tasks" 
    ON public.study_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notes" 
    ON public.user_notes FOR ALL USING (auth.uid() = user_id);

-- PYQs: Readable by all authenticated users
CREATE POLICY "PYQ papers are readable by all" 
    ON public.question_papers FOR SELECT USING (true);
CREATE POLICY "PYQ questions are readable by all" 
    ON public.pyq_questions FOR SELECT USING (true);
CREATE POLICY "Admins can manage PYQs" 
    ON public.pyq_questions FOR ALL USING (public.is_admin(auth.uid()));

-- Audit Logs: Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" 
    ON public.audit_logs FOR SELECT USING (public.is_admin(auth.uid()));

-- ----------------------------------------------------------------------------
-- 10. REALTIME CONFIGURATION
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'user_topic_progress'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.user_topic_progress;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'friendships'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.friendships;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'activity_events'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_events;
    END IF;
END $$;
