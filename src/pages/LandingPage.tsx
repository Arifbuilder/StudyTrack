import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Flame,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  Layers,
  GraduationCap,
  CalendarCheck,
  RotateCcw,
  BarChart3,
  Cpu,
  Activity,
  Lock,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Landing Navbar */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              SyllabusSync
              <Badge variant="primary" size="sm">KTU 2019</Badge>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')}>
              Open Dashboard
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-32 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
            <GraduationCap className="w-4 h-4" />
            <span>APJ Abdul Kalam Technological University • B.Tech 2019 Scheme S7</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Intelligent Collaborative Syllabus Tracking for <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">KTU S7 Exams</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Every module topic and subtopic tracked with individual checkboxes. Watch your classmates' progress live, identify frequently repeated PYQs, and master your university exams together.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="text-base px-6 py-3 shadow-lg shadow-indigo-500/25"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Launch S7 Study Workspace
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/pyq')}
              className="text-base px-6 py-3"
            >
              <Flame className="w-5 h-5 mr-2 text-amber-500" />
              Explore KTU PYQ Intelligence
            </Button>
          </div>
        </div>
      </section>

      {/* 3 Core Examination Subjects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 w-full space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Complete KTU 2019 Scheme S7 Curriculum
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            All 15 subject modules loaded with granular subtopics directly extracted from official university curriculum files.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* AI */}
          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                CST401 • Core • 4 Credits
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Artificial Intelligence (AI)
              </h3>
            </div>
            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              Intelligent agents, uninformed & informed search (BFS, DFS, IDDFS, A*), Minimax, Alpha-Beta pruning, CSPs, First-Order Logic, unification, resolution, and machine learning decision trees.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-indigo-600">
              5 Modules • 36 Lecture Hours →
            </div>
          </Card>

          {/* BMI */}
          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                ECT425 • Open Elective • 3 Credits
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Biomedical Instrumentation (BMI)
              </h3>
            </div>
            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              Physiological systems, resting & action potentials, biopotential electrodes, ECG machines & DRL, blood pressure & cardiac output, EEG 10-20 system, pacemakers, defibrillators, X-ray, CT, MRI, and hospital electrical safety.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600">
              5 Modules • J.G. Webster Standard →
            </div>
          </Card>

          {/* SIC */}
          <Card hoverEffect className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-violet-600 dark:text-violet-400">
                CST433 • Programme Elective • 3 Credits
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Security in Computing (SIC)
              </h3>
            </div>
            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              OSI security architecture, classical ciphers (Playfair, Hill), DES & 3DES, AES 4 stages & key expansion, RSA, ElGamal, Diffie-Hellman, ECC, SHA-512, HMAC, digital signatures, IDS, malware, and DDoS countermeasures.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-violet-600">
              5 Modules • William Stallings Standard →
            </div>
          </Card>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Leaf-Only Topic Precision
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Never calculates fake or double-counted percentages. All statistics stem from verified leaf syllabus items and persist immediately.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Real-Time Collaboration
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              When your study partner checks a topic, your friends dashboard reflects the updated percentage immediately without reloading.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Verified PYQ Intelligence
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Actual KTU examination papers analyzed (Dec 22 to Jan 24). Pinpoints repeatedly tested algorithms, diagrams, and Part B questions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Spaced Repetition & Planner
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Separate study completion from active recall. Records confidence levels (1-5 stars) and schedules 1d, 3d, 7d review cycles.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800">
        <p>SyllabusSync • APJ Abdul Kalam Technological University B.Tech S7 Preparation Platform</p>
        <p className="mt-1 text-[11px] text-slate-400">All syllabus data sourced from official KTU 2019 Scheme curriculum standards.</p>
      </footer>
    </div>
  );
};
