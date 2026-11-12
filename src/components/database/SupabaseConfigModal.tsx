import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Zap,
  RefreshCw,
  Key,
  Globe,
  Radio,
} from 'lucide-react';
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  disconnectSupabase,
  testSupabaseConnection,
} from '../../services/supabase';
import initSchemaSql from '../../../supabase/migrations/20261112_init_schema.sql?raw';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConnected,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    latencyMs?: number;
  }>({
    tested: false,
    success: false,
    message: '',
  });
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopySql = () => {
    navigator.clipboard.writeText(initSchemaSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  useEffect(() => {
    if (isOpen) {
      const cfg = getSupabaseConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      setTestResult({ tested: false, success: false, message: '' });
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const currentCfg = getSupabaseConfig();

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult({ tested: false, success: false, message: '' });
    try {
      const res = await testSupabaseConnection(url, anonKey);
      setTestResult({
        tested: true,
        success: res.success,
        message: res.message,
        latencyMs: res.latencyMs,
      });
    } catch (e: any) {
      setTestResult({
        tested: true,
        success: false,
        message: e.message || 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveSupabaseConfig(url, anonKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onConnected?.();
      onClose();
    }, 1200);
  };

  const handleDisconnect = () => {
    disconnectSupabase();
    setUrl('');
    setAnonKey('');
    setTestResult({ tested: false, success: false, message: '' });
    onClose();
  };

  const copySchemaPath = () => {
    navigator.clipboard.writeText('supabase/migrations/20261112_init_schema.sql');
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Supabase Cloud Database Integration"
      maxWidth="xl"
    >
      <div className="space-y-5 text-sm">
        {/* Status Header Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 ${
            currentCfg.isConfigured
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
          }`}
        >
          <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-sm">
            {currentCfg.isConfigured ? (
              <Radio className="w-5 h-5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            ) : (
              <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-base">
                {currentCfg.isConfigured ? 'Cloud PostgreSQL Connected' : 'Local Relational Mode Active'}
              </span>
              <Badge variant={currentCfg.isConfigured ? 'success' : 'warning'} size="sm">
                {currentCfg.isConfigured ? 'Live Cloud' : 'Local Offline'}
              </Badge>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90">
              {currentCfg.isConfigured
                ? 'Your syllabus tracking, friend syncing, and exam analytics are syncing in real time to your cloud Supabase database.'
                : 'Connect your cloud Supabase project by entering your Project URL and Anon API key below.'}
            </p>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-3.5 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <Input
            label="Supabase Project URL (VITE_SUPABASE_URL)"
            placeholder="https://xxxxxxxxxxxxxxxx.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            icon={<Globe className="w-4 h-4" />}
            required
          />

          <Input
            label="Supabase Anon Public API Key (VITE_SUPABASE_ANON_KEY)"
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={anonKey}
            onChange={(e) => setAnonKey(e.target.value)}
            icon={<Key className="w-4 h-4" />}
            required
          />

          {/* Test Feedback */}
          {testResult.tested && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 border ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="flex-1 font-medium">{testResult.message}</span>
              {testResult.latencyMs !== undefined && (
                <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/70 dark:bg-slate-800/80">
                  {testResult.latencyMs}ms
                </span>
              )}
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              Supabase configuration saved! Updating application state...
            </div>
          )}

          {/* Test & Save Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleTestConnection}
              loading={testing}
              disabled={!url.trim() || !anonKey.trim()}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Test Connection
            </Button>

            <div className="flex items-center gap-2">
              {currentCfg.isConfigured && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  Disconnect
                </Button>
              )}
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={!url.trim() || !anonKey.trim()}
              >
                <Cloud className="w-3.5 h-3.5 mr-1.5" />
                Save & Connect
              </Button>
            </div>
          </div>
        </div>

        {/* Database Quick Setup Guide */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-500" />
              Do I Need to Run Table Queries in Supabase?
            </span>
            <a
              href="https://supabase.com/dashboard/project/_/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              Open Supabase SQL Editor
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>Yes!</strong> While the app works locally in your browser without tables, Supabase cannot store your checkboxes or cloud backups until you create the tables in PostgreSQL.
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleCopySql}
              className="flex-1 justify-center"
            >
              {copiedSql ? <Check className="w-4 h-4 mr-1.5 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1.5" />}
              {copiedSql ? 'Full SQL Script Copied to Clipboard!' : 'Copy Full SQL Migration Script'}
            </Button>

            <button
              onClick={copySchemaPath}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 font-mono shrink-0"
              title="Copy file path"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSchema ? 'Path Copied' : 'schema.sql path'}
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            Click <strong>Copy Full SQL</strong> above &rarr; Go to Supabase SQL Editor &rarr; Paste &rarr; Click <strong>Run</strong>. (Takes ~10 seconds).
          </p>
        </div>
      </div>
    </Modal>
  );
};
