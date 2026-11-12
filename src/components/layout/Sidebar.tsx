import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import {
  LayoutDashboard,
  BookMarked,
  FileText,
  Target,
  CalendarCheck,
  RotateCcw,
  BarChart3,
  Users,
  FolderKanban,
  ShieldAlert,
  Settings,
  Cpu,
  Activity,
  Lock,
} from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { overallSummary } = useProgress();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'All Subjects', path: '/subjects', icon: BookMarked },
    { label: 'PYQ Intelligence', path: '/pyq', icon: FileText, badge: 'Verified' },
    { label: 'High Priority Topics', path: '/priority', icon: Target },
    { label: 'Study Planner', path: '/planner', icon: CalendarCheck },
    { label: 'Revision Tracker', path: '/revisions', icon: RotateCcw },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Friends Live', path: '/friends', icon: Users },
    { label: 'Study Groups', path: '/groups', icon: FolderKanban },
  ];

  const subjects = [
    { code: 'CST401', name: 'AI', color: 'text-indigo-500', icon: Cpu, id: 'sub-cst401-ai' },
    { code: 'ECT425', name: 'BMI', color: 'text-emerald-500', icon: Activity, id: 'sub-ect425-bmi' },
    { code: 'CST433', name: 'SIC', color: 'text-violet-500', icon: Lock, id: 'sub-cst433-sic' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-6">
        {/* Main Navigation Links */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Study Workspace
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Quick Subject Access with Live % */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Subjects (S7)
            </p>
            <span className="text-[10px] text-slate-400 font-mono">15 Modules</span>
          </div>
          <div className="space-y-1">
            {subjects.map((s) => {
              const summary = overallSummary.subjectSummaries.find((sum) => sum.subjectId === s.id);
              const pct = summary ? summary.percentage : 0;

              return (
                <NavLink
                  key={s.id}
                  to={`/subjects/${s.id}`}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <s.icon className={`w-3.5 h-3.5 ${s.color} shrink-0`} />
                    <span className="truncate">{s.code} — {s.name}</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                    {pct}%
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Administration Links (Authorized only) */}
        {(user?.role === 'super_admin' || user?.role === 'admin') && (
          <div>
            <p className="px-3 text-[11px] font-semibold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              Administrative
            </p>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 font-semibold'
                    : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
                }`
              }
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Admin Management</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* Bottom Card: Overall Progress Snapshot */}
      <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <span className="text-slate-600 dark:text-slate-300">Overall Progress</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {overallSummary.percentage}%
            </span>
          </div>
          <ProgressBar value={overallSummary.percentage} size="sm" color="indigo" />
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
            <span>{overallSummary.completedLeafCount} of {overallSummary.totalLeafCount} topics</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {overallSummary.totalLeafCount - overallSummary.completedLeafCount} left
            </span>
          </p>
        </div>

        <NavLink
          to="/settings"
          className="flex items-center gap-2 px-2 py-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Account & Visibility Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};
