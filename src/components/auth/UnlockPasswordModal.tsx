import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { Lock, ShieldAlert, KeyRound, Check } from 'lucide-react';

interface UnlockPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UnlockPasswordModal: React.FC<UnlockPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user, unlockEditing } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the password for this account.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const unlocked = await unlockEditing(password);
      if (unlocked) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          setPassword('');
          onSuccess?.();
          onClose();
        }, 800);
      } else {
        setError('Incorrect password. Please verify and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Unlock Editing Access"
      description={`Enter the password for ${user?.displayName || 'this account'} to check or edit topics.`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
          <img
            src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
            alt={user?.displayName}
            className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 object-cover"
          />
          <div className="min-w-0">
            <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {user?.displayName}
            </p>
            <p className="text-[11px] text-slate-400">@{user?.username}</p>
          </div>
        </div>

        <Input
          label="Account Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<KeyRound className="w-4 h-4" />}
          autoFocus
          required
        />

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
            <Check className="w-4 h-4 shrink-0" />
            <span>Password verified! Editing unlocked.</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel (Stay Read-Only)
          </Button>

          <Button type="submit" variant="primary" size="sm" loading={loading} disabled={success}>
            <Lock className="w-3.5 h-3.5 mr-1.5" />
            Unlock & Edit
          </Button>
        </div>
      </form>
    </Modal>
  );
};
