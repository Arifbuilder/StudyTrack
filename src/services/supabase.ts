import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'syllabussync_supabase_url';
const STORAGE_KEY_KEY = 'syllabussync_supabase_key';

function resolveCredentials(): { url: string; anonKey: string; isConfigured: boolean } {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const storedUrl = typeof localStorage !== 'undefined' ? (localStorage.getItem(STORAGE_KEY_URL) || '').trim() : '';
  const storedKey = typeof localStorage !== 'undefined' ? (localStorage.getItem(STORAGE_KEY_KEY) || '').trim() : '';

  const effectiveUrl = storedUrl || envUrl;
  const effectiveKey = storedKey || envKey;

  const isConfigured = Boolean(
    effectiveUrl &&
    effectiveKey &&
    !effectiveUrl.includes('placeholder') &&
    !effectiveKey.includes('placeholder') &&
    effectiveUrl.startsWith('http')
  );

  return { url: effectiveUrl, anonKey: effectiveKey, isConfigured };
}

let currentConfig = resolveCredentials();

export let supabase: SupabaseClient | null = currentConfig.isConfigured
  ? createClient(currentConfig.url, currentConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export let isSupabaseConfigured = currentConfig.isConfigured;

export function getSupabaseConfig() {
  currentConfig = resolveCredentials();
  return {
    url: currentConfig.url,
    anonKey: currentConfig.anonKey,
    isConfigured: currentConfig.isConfigured,
    hasCustomStored: typeof localStorage !== 'undefined' && Boolean(localStorage.getItem(STORAGE_KEY_URL)),
  };
}

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
  tablesMissing?: boolean;
}> {
  try {
    const trimmedUrl = url.trim();
    const trimmedKey = anonKey.trim();

    if (!trimmedUrl || !trimmedKey) {
      return { success: false, message: 'URL and Anon Key cannot be empty.' };
    }
    if (!trimmedUrl.startsWith('https://') && !trimmedUrl.startsWith('http://')) {
      return { success: false, message: 'Supabase URL must start with https://' };
    }

    const startTime = performance.now();
    const tempClient = createClient(trimmedUrl, trimmedKey, {
      auth: { persistSession: false },
    });

    // Test with a lightweight query to check connectivity
    const { error } = await tempClient.from('subjects').select('count', { count: 'exact', head: true });
    const latency = Math.round(performance.now() - startTime);

    if (error) {
      if (
        error.message.includes('relation "subjects" does not exist') ||
        error.message.includes('relation "public.subjects" does not exist') ||
        error.code === '42P01' ||
        error.code === 'PGRST205'
      ) {
        return {
          success: true,
          tablesMissing: true,
          message: 'Connected to Supabase! But SQL tables are not created yet. Run the SQL schema migration in your Supabase SQL Editor.',
          latencyMs: latency,
        };
      }
      if (error.message.includes('JWT') || error.message.includes('apiKey') || error.message.includes('Invalid API key')) {
        return { success: false, message: `Invalid Supabase API key: ${error.message}` };
      }
    }

    const { error: authError } = await tempClient.auth.getSession();
    if (authError && authError.message.includes('Invalid API key')) {
      return { success: false, message: `Authentication check failed: ${authError.message}` };
    }

    return {
      success: true,
      message: 'Supabase cloud connection verified & tables are active!',
      latencyMs: latency,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to connect to Supabase endpoint.',
    };
  }
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  }

  currentConfig = resolveCredentials();
  isSupabaseConfigured = currentConfig.isConfigured;

  if (isSupabaseConfigured) {
    supabase = createClient(currentConfig.url, currentConfig.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });
  } else {
    supabase = null;
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('syllabussync_supabase_changed', { detail: currentConfig }));
  }
}

export function disconnectSupabase(): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY_URL);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }

  currentConfig = resolveCredentials();
  isSupabaseConfigured = false;
  supabase = null;

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('syllabussync_supabase_changed', { detail: { isConfigured: false } }));
  }
}
