import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Eye,
  Sun,
  Moon,
  Bell,
  Trash2,
  AlertTriangle,
  Check,
  Shield,
  Save,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { ProgressVisibility } from '../types';

export const SettingsPage: React.FC = () => {
  const { user, settings, theme, setTheme, refreshUser } = useAuth();

  const [visibility, setVisibility] = useState<ProgressVisibility>(
    settings?.progressVisibility || 'friends'
  );
  const [emailNotifs, setEmailNotifs] = useState(settings?.emailNotifications ?? true);
  const [studyReminders, setStudyReminders] = useState(settings?.studyReminders ?? true);
  const [dailyGoal, setDailyGoal] = useState(settings?.dailyGoalMinutes || 180);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Self deletion modal
  const [selfDeleteModalOpen, setSelfDeleteModalOpen] = useState(false);

  const handleSaveSettings = async () => {
    if (!user) return;
    await api.auth.updateSettings(user.id, {
      progressVisibility: visibility,
      emailNotifications: emailNotifs,
      studyReminders,
      dailyGoalMinutes: dailyGoal,
    });
    refreshUser();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleConfirmSelfDelete = async () => {
    if (!user) return;
    await api.admin.deleteUser(user.id, user.id);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Account & Privacy Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure progress visibility, theme preferences, and data privacy options.
        </p>
      </div>

      {/* Progress Visibility (Privacy Design Requirement) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-500" />
            Study Progress Privacy & Sharing
          </CardTitle>
          <CardDescription>
            Control who can see your subject completion percentages and module checkpoints.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {[
              {
                value: 'private',
                label: 'Private (Default)',
                desc: 'Only you can see your syllabus checkboxes and progress statistics.',
              },
              {
                value: 'friends',
                label: 'Friends-Only Progress',
                desc: 'Authorized connected friends can see your completion percentages.',
              },
              {
                value: 'groups',
                label: 'Study-Group Cohort Only',
                desc: 'Visible strictly to fellow members in your accepted study groups.',
              },
              {
                value: 'public',
                label: 'Public University Summary',
                desc: 'Visible to all registered students in the KTU S7 leaderboard.',
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  visibility === opt.value
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={opt.value}
                  checked={visibility === opt.value}
                  onChange={(e) => setVisibility(e.target.value as ProgressVisibility)}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">{opt.label}</p>
                  <p className="text-[11px] text-slate-500">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interface Theme & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Appearance & Study Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Color Theme
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant={theme === 'light' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTheme('light')}
              >
                <Sun className="w-3.5 h-3.5 mr-1" /> Light Mode
              </Button>
              <Button
                variant={theme === 'dark' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setTheme('dark')}
              >
                <Moon className="w-3.5 h-3.5 mr-1" /> Dark Mode
              </Button>
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={studyReminders}
                onChange={(e) => setStudyReminders(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Enable daily examination study reminders</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Preferences saved!
              </span>
            ) : <span />}
            <Button variant="primary" size="md" onClick={handleSaveSettings}>
              <Save className="w-4 h-4 mr-1.5" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone: Account Self-Deletion */}
      <Card className="border-rose-200 dark:border-rose-950/80 bg-rose-50/20 dark:bg-rose-950/10">
        <CardHeader>
          <CardTitle className="text-base text-rose-600 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Delete My Account
          </CardTitle>
          <CardDescription>
            Permanently delete your profile, topic progress, custom notes, and friends links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
              Once deleted, your account and all study records cannot be recovered. You can register a fresh account at any time.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setSelfDeleteModalOpen(true)}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal: Confirm Self Deletion */}
      <Modal
        isOpen={selfDeleteModalOpen}
        onClose={() => setSelfDeleteModalOpen(false)}
        title="Permanently Delete Your Account?"
        description="Irreversible destructive action."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 space-y-2">
            <p className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Confirm Permanent Account Purge
            </p>
            <p>
              Are you sure you want to delete your account (@{user?.username})? All your completed checkboxes, notes, and study cohorts will be cleared immediately.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSelfDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmSelfDelete}>
              Yes, Delete My Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
