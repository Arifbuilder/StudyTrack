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
  isReadOnly: boolean;
  canEdit: boolean;
  authenticatedUserId: string | null;
  setTheme: (theme: 'light' | 'dark') => void;
  login: (usernameOrEmail: string, password?: string) => Promise<void>;
  register: (data: { email: string; username: string; displayName: string; password?: string; role?: UserRole }) => Promise<void>;
  logout: () => Promise<void>;
  switchUser: (userId: string) => void;
  viewUserProgress: (userId: string) => void;
  unlockEditing: (password: string) => Promise<boolean>;
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
  const [authenticatedUserId, setAuthUserIdState] = useState<string | null>(localDb.getAuthenticatedUserId());

  // isReadOnly is true if you haven't entered the password for the active viewing user
  const isReadOnly = !authenticatedUserId || authenticatedUserId !== user?.id;
  const canEdit = !isReadOnly;

  const loadCurrentUser = useCallback(async () => {
    try {
      const u = await api.auth.getCurrentUser();
      setUser(u);
      setAuthUserIdState(localDb.getAuthenticatedUserId());
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
    setAuthUserIdState(loggedInUser.id);
    localDb.setAuthenticatedUserId(loggedInUser.id);
    const s = await api.auth.getSettings(loggedInUser.id);
    setSettings(s);
    const users = await api.admin.getAllUsers();
    setAllUsers(users);
  };

  const register = async (data: { email: string; username: string; displayName: string; password?: string; role?: UserRole }) => {
    const newUser = await api.auth.register(data);
    setUser(newUser);
    setAuthUserIdState(newUser.id);
    localDb.setAuthenticatedUserId(newUser.id);
    const s = await api.auth.getSettings(newUser.id);
    setSettings(s);
    const users = await api.admin.getAllUsers();
    setAllUsers(users);
  };

  const logout = async () => {
    await api.auth.signOut();
    setAuthUserIdState(null);
    localDb.setAuthenticatedUserId(null);
    await loadCurrentUser();
  };

  const viewUserProgress = (userId: string) => {
    const found = allUsers.find((u) => u.id === userId) || localDb.getAllUsers().find((u) => u.id === userId);
    if (found) {
      setUser(found);
    }
    localDb.setCurrentUserId(userId);
    // Keep existing authenticatedUserId so if viewing someone else, it becomes read-only
    loadCurrentUser();
  };

  const switchUser = (userId: string) => {
    viewUserProgress(userId);
  };

  const unlockEditing = async (password: string): Promise<boolean> => {
    if (!user) return false;
    const valid = await api.auth.verifyUserPassword(user.id, password);
    if (valid) {
      setAuthUserIdState(user.id);
      localDb.setAuthenticatedUserId(user.id);
      return true;
    }
    return false;
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
        isReadOnly,
        canEdit,
        authenticatedUserId,
        setTheme,
        login,
        register,
        logout,
        switchUser,
        viewUserProgress,
        unlockEditing,
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
