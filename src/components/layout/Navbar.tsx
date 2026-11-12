import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import {
  BookOpen,
  Sun,
  Moon,
  ChevronDown,
  UserPlus,
  LogOut,
  Database,
  ShieldAlert,
  Settings,
  Sparkles,
  Lock,
  Eye,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { getSupabaseConfig } from '../../services/supabase';
import { SupabaseConfigModal } from '../database/SupabaseConfigModal';

export const Navbar: React.FC = () => {
  const { user, theme, setTheme, allUsers, switchUser, logout, isReadOnly } = useAuth();
  const { setUnlockModalOpen } = useProgress();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleConfigChange = () => {
      setSupabaseConfig(getSupabaseConfig());
    };
    window.addEventListener('syllabussync_supabase_changed', handleConfigChange);
    return () => window.removeEventListener('syllabussync_supabase_changed', handleConfigChange);
  }, []);

  const navLinks = [
    { label: 'Syllabus', path: '/dashboard' },
    { label: 'PYQ Questions', path: '/pyq' },
    { label: 'Tasks', path: '/planner' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand & University Scheme */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SyllabusSync
                <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  KTU S7
                </span>
              </span>
            </div>
          </Link>

          {/* Quick Center Nav Links */}
          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions, Database, Theme, User */}
        <div className="flex items-center gap-2">
          {/* Cloud Database Integration Trigger */}
          <button
            onClick={() => setSupabaseModalOpen(true)}
            title={supabaseConfig.isConfigured ? 'Supabase Cloud Connected' : 'Connect Supabase Cloud Database'}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-colors ${
              supabaseConfig.isConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {supabaseConfig.isConfigured ? 'Cloud DB' : 'Connect DB'}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                supabaseConfig.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <img
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                alt={user?.displayName || 'User'}
                className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 object-cover"
              />
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[80px] sm:max-w-[120px] truncate">
                {user?.displayName?.split(' ')[0] || 'User'}
              </span>
              {isReadOnly && (
                <span className="hidden sm:inline-flex items-center gap-0.5 text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                  <Eye className="w-2.5 h-2.5" /> View
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-1.5 w-60 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-50 text-xs"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.displayName}</p>
                    {isReadOnly ? (
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                        View-Only
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                        Owner
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">@{user?.username}</p>
                </div>

                {isReadOnly && (
                  <div className="p-2 bg-amber-50/60 dark:bg-amber-950/30 border-b border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUserDropdownOpen(false);
                        setUnlockModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shadow-xs"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      Unlock Editing (Password)
                    </button>
                  </div>
                )}

                <div className="py-1">
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-indigo-500" />
                    Register New Student
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Account & Database Settings
                  </Link>
                  {user?.role === 'super_admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-3 py-1.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Admin Management
                    </Link>
                  )}
                </div>

                {/* Account Switcher */}
                {allUsers.length > 1 && (
                  <div className="py-1 border-t border-slate-100 dark:border-slate-800">
                    <p className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Account
                    </p>
                    <div className="max-h-36 overflow-y-auto space-y-0.5">
                      {allUsers.map((u) => {
                        const isActive = u.id === user?.id;
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              switchUser(u.id);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left ${
                              isActive
                                ? 'bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 font-semibold'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <img src={u.avatarUrl} alt={u.displayName} className="w-4 h-4 rounded-full" />
                              <span className="truncate">{u.displayName}</span>
                            </div>
                            {isActive && <span className="text-[10px] text-indigo-500 font-medium">Active</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Supabase Cloud Connection Modal */}
      <SupabaseConfigModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </header>
  );
};
