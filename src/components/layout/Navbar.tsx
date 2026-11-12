import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  BookOpen,
  Sun,
  Moon,
  Users,
  ShieldAlert,
  ChevronDown,
  UserPlus,
  LogOut,
  Bell,
  Search,
  Sparkles,
  Database,
  Cloud,
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getSupabaseConfig } from '../../services/supabase';
import { SupabaseConfigModal } from '../database/SupabaseConfigModal';

export const Navbar: React.FC = () => {
  const { user, theme, setTheme, allUsers, switchUser, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState(getSupabaseConfig());
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfigChange = () => {
      setSupabaseConfig(getSupabaseConfig());
    };
    window.addEventListener('syllabussync_supabase_changed', handleConfigChange);
    return () => window.removeEventListener('syllabussync_supabase_changed', handleConfigChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & University Scheme */}
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                SyllabusSync
                <span className="hidden sm:inline-flex">
                  <Badge variant="primary" size="sm">KTU 2019</Badge>
                </span>
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                B.Tech S7 • AI (CST401) • BMI (ECT425) • SIC (CST433)
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Quick Search Trigger */}
        <div className="hidden lg:flex items-center flex-1 max-w-md mx-4">
          <button
            onClick={() => navigate('/priority')}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5" />
              <span>Search topics, algorithms, or PYQs...</span>
            </span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-600 dark:text-slate-300">
              Explore
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Theme, and User Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Notifications preview button */}
          <Link
            to="/friends"
            title="Friends & Activity"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          </Link>

          {/* Cloud Database Integration Trigger */}
          <button
            onClick={() => setSupabaseModalOpen(true)}
            title={supabaseConfig.isConfigured ? 'Supabase Cloud Connected' : 'Connect Supabase Cloud Database'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              supabaseConfig.isConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {supabaseConfig.isConfigured ? 'Cloud DB' : 'Connect DB'}
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                supabaseConfig.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Account Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            >
              <img
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                alt={user?.displayName || 'User'}
                className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden sm:block text-xs">
                <p className="font-semibold text-slate-900 dark:text-white leading-tight">
                  {user?.displayName || 'Guest User'}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">@{user?.username}</span>
                  {user?.role === 'super_admin' && (
                    <Badge variant="danger" size="sm">Super Admin</Badge>
                  )}
                  {user?.role === 'admin' && (
                    <Badge variant="warning" size="sm">Admin</Badge>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-100"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Registered Accounts
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Active student profiles:
                  </p>
                </div>

                <div className="max-h-56 overflow-y-auto py-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => switchUser(u.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors ${
                        user?.id === u.id ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={u.avatarUrl} alt={u.displayName} className="w-6 h-6 rounded-full" />
                        <div>
                          <p className="font-medium leading-none">{u.displayName}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">@{u.username}</p>
                        </div>
                      </div>
                      {u.role === 'super_admin' ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 px-2 space-y-1">
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors font-medium"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    Register New Account
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    View My Profile & Goals
                  </Link>
                  {user?.role === 'super_admin' && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors font-medium"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      Administrator Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Reset Session
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
