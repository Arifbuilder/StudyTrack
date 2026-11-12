import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import {
  LayoutDashboard,
  FileText,
  CalendarCheck,
  ShieldAlert,
  Settings,
  Cpu,
  Activity,
  Lock,
  Sparkles,
} from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { overallSummary } = useProgress();

  const navItems = [
    { label: 'Syllabus Tracker', path: '/dashboard', icon: LayoutDashboard },
    { label: 'PYQ Question Bank', path: '/pyq', icon: FileText, badge: 'KTU S7' },
    { label: 'Study Tasks', path: '/planner', icon: CalendarCheck },
  ];

  const subjects = [
    { code: 'CST401', name: 'AI', color: 'text-indigo-600 dark:text-indigo-400', icon: Cpu, id: 'sub-cst401-ai' },
    { code: 'ECT425', name: 'BMI', color: 'text-emerald-600 dark:text-emerald-400', icon: Activity, id: 'sub-ect425-bmi' },
    { code: 'CST433', name: 'SIC', color: 'text-violet-600 dark:text-violet-400', icon: Lock, id: 'sub-cst433-sic' },
  ];

  return (
    <aside className="w-60 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-3.5 space-y-5">
        {/* Main Navigation */}
        <div>
          <p className="px-2.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
            Navigation
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Subjects & Progress */}
        <div>
          <div className="flex items-center justify-between px-2.5 mb-1.5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Subjects (15 Modules)
            </p>
          </div>
          <div className="space-y-1">
            {subjects.map((s) => {
              const summary = overallSummary.subjectSummaries.find((sum) => sum.subjectId === s.id);
              const pct = summary ? summary.percentage : 0;
              const count = summary ? summary.completedLeafCount : 0;
              const total = summary ? summary.totalLeafCount : 0;

              return (
                <div
                  key={s.id}
                  className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
                >
                  <div className="flex items-center justify-between font-medium mb-1">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{s.code}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} size="sm" color="indigo" className="mb-1" />
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{s.name}</span>
                    <span>{count}/{total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Administration (Authorized only) */}
        {(user?.role === 'super_admin' || user?.role === 'admin') && (
          <div>
            <p className="px-2.5 text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-1">
              Admin
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold'
                    : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
                }`
              }
            >
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>User & Deletion Tools</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Bottom: Minimal Progress Card & Settings */}
      <div className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Total Completion</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{overallSummary.percentage}%</span>
          </div>
          <ProgressBar value={overallSummary.percentage} size="sm" color="indigo" />
          <p className="text-[10px] text-slate-400 mt-1.5 text-center">
            {overallSummary.completedLeafCount} of {overallSummary.totalLeafCount} topics completed
          </p>
        </div>

        <NavLink
          to="/settings"
          className="flex items-center gap-2 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings & Supabase</span>
        </NavLink>
      </div>
    </aside>
  );
};
