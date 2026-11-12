import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserSettings, UserRole } from '../types';
import { api } from '../services/api';
import { localDb, realtimeChannel } from '../services/localDatabase';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  settings: UserSettings | null;
  theme: 'light' | 'dark';
  loading: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  login: (usernameOrEmail: string, password?: string) => Promise<void>;
  register: (data: { email: string; username: string; displayName: string; role?: UserRole }) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => void;
  refreshUser: () => void;
  allUsers: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

  const loadCurrentUser = useCallback(async () => {
    try {
      const u = await api.auth.getCurrentUser();
      setUser(u);
      if (u) {
        const s = await api.auth.getSettings(u.id);
        setSettings(s);
        if (s.theme === 'dark' || (s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          setThemeState('dark');
          document.documentElement.classList.add('dark');
        } else {
          setThemeState('light');
          document.documentElement.classList.remove('dark');
        }
      }
      const users = await api.admin.getAllUsers();
      setAllUsers(users);
    } catch (err) {
      console.error('Error loading current user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();

    // 1. Same-device multi-tab sync
    const channel = realtimeChannel;
    let localHandler: ((e: MessageEvent) => void) | null = null;
    if (channel) {
      localHandler = (e: MessageEvent) => {
        if (e.data?.type === 'USER_DELETED' || e.data?.type === 'PROGRESS_UPDATED') {
          loadCurrentUser();
        }
      };
      channel.addEventListener('message', localHandler);
    }

    // 2. Cross-device Cloud Realtime Subscription for profiles
    let supabaseSub: any = null;
    if (isSupabaseConfigured && supabase) {
      try {
        supabaseSub = supabase
          .channel('public:profiles')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'profiles' },
            () => {
              loadCurrentUser();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('[Supabase Realtime Profiles] error:', err);
      }
    }

    return () => {
      if (channel && localHandler) {
        channel.removeEventListener('message', localHandler);
      }
      if (supabaseSub && supabase) {
        supabase.removeChannel(supabaseSub);
      }
    };
  }, [loadCurrentUser]);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    if (user) {
      api.auth.updateSettings(user.id, { theme: newTheme });
    }
  };

  const login = async (usernameOrEmail: string, password?: string) => {
    const loggedInUser = await api.auth.signIn(usernameOrEmail, password);
    setUser(loggedInUser);
    const s = await api.auth.getSettings(loggedInUser.id);
    setSettings(s);
    const users = await api.admin.getAllUsers();
    setAllUsers(users);
  };

  const register = async (data: { email: string; username: string; displayName: string; role?: UserRole }) => {
    const newUser = await api.auth.register(data);
    setUser(newUser);
    const s = await api.auth.getSettings(newUser.id);
    setSettings(s);
    const users = await api.admin.getAllUsers();
    setAllUsers(users);
  };

  const logout = async () => {
    await api.auth.signOut();
    await loadCurrentUser();
  };

  const switchUser = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId) || localDb.getAllUsers().find((u) => u.id === userId);
    if (found) {
      setUser(found);
    }
    localDb.setCurrentUserId(userId);
    loadCurrentUser();
  };

  const refreshUser = () => {
    loadCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        theme,
        loading,
        setTheme,
        login,
        register,
        logout,
        switchUser,
        refreshUser,
        allUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
