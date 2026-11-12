import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  Plus,
  Clock,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Calendar,
  Check,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { StudyTask } from '../types';

export const PlannerPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<StudyTask[]>(user ? api.planner.getTasks(user.id) : []);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('sub-cst401-ai');
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');
  const [notes, setNotes] = useState('');

  const refreshTasks = () => {
    if (user) {
      setTasks(api.planner.getTasks(user.id));
    }
  };

  const handleCreateTask = async () => {
    if (!user || !title.trim()) return;
    await api.planner.addTask({
      userId: user.id,
      title: title.trim(),
      notes: notes.trim() || undefined,
      subjectId,
      targetDate,
      priority,
    });
    setTitle('');
    setNotes('');
    setModalOpen(false);
    refreshTasks();
  };

  const handleToggle = async (id: string, current: boolean) => {
    await api.planner.toggleTask(id, !current);
    refreshTasks();
  };

  const handleDelete = async (id: string) => {
    await api.planner.deleteTask(id);
    refreshTasks();
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter((t) => !t.isCompleted);
  const completedTasks = tasks.filter((t) => t.isCompleted);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60">
              Personal Productivity
            </span>
            <Badge variant="outline" size="sm">Daily & Weekly Agenda</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Study Planner & Revision Calendar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Schedule specific exercises, numerical problems, and revision checkpoints. Tasks are kept separate from official syllabus completion.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Study Task
        </Button>
      </div>

      {/* Grid: Pending Tasks & Completed History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tasks List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              Active Study Tasks ({pendingTasks.length})
            </h2>
          </div>

          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No pending tasks!</h3>
                <p className="text-xs text-slate-500">Plan your next study session by clicking 'Create Study Task'.</p>
              </div>
            ) : (
              pendingTasks.map((t) => {
                const isOverdue = t.targetDate < todayStr;
                return (
                  <div
                    key={t.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-start justify-between gap-3 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button
                        onClick={() => handleToggle(t.id, t.isCompleted)}
                        className="mt-0.5 w-5 h-5 rounded-lg border border-slate-300 dark:border-slate-600 hover:border-emerald-500 flex items-center justify-center shrink-0 transition-colors"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {t.title}
                          </span>
                          <Badge
                            variant={
                              t.priority === 'urgent'
                                ? 'danger'
                                : t.priority === 'high'
                                ? 'warning'
                                : 'default'
                            }
                            size="sm"
                          >
                            {t.priority}
                          </Badge>
                          {isOverdue && (
                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full flex items-center gap-1 border border-rose-200/60">
                              <AlertCircle className="w-2.5 h-2.5" />
                              Overdue
                            </span>
                          )}
                        </div>

                        {t.notes && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                            {t.notes}
                          </p>
                        )}

                        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Target: {t.targetDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Completed History Sidebar */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Completed Archive ({completedTasks.length})
          </h2>

          <Card className="space-y-3">
            {completedTasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Completed study tasks will appear here.
              </p>
            ) : (
              completedTasks.slice(0, 8).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/80 last:border-0"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="line-through text-slate-400 truncate">{t.title}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-slate-300 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </Card>
        </div>
      </div>

      {/* Modal: Create Task */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule Study Task"
        description="Add a specific task, revision checkpoint, or numerical exercise."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Derive 3-opamp instrumentation amplifier CMRR equation"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notes & Specific References
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Refer to Webster textbook page 112; practice 2023 Dec question"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs focus:ring-2 focus:ring-indigo-500"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateTask}>
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
