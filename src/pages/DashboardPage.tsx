import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import {
  Brain,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  ArrowRight,
  Plus,
  Users,
  AlertTriangle,
  Award,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CircularProgress } from '../components/ui/CircularProgress';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import officialSyllabus from '../data/officialSyllabus.json';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { overallSummary, readiness } = useProgress();
  const navigate = useNavigate();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('sub-cst401-ai');
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);

  // Greeting based on local time
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Demo friends for live tracking widget
  const friendsProgress = user ? api.friends.getFriends(user.id) : [];

  // Tasks
  const tasks = user ? api.planner.getTasks(user.id).filter((t) => !t.isCompleted).slice(0, 4) : [];

  const handleCreateTask = async () => {
    if (!user || !taskTitle.trim()) return;
    await api.planner.addTask({
      userId: user.id,
      title: taskTitle.trim(),
      subjectId: taskSubject,
      targetDate: taskDate,
      priority: 'high',
    });
    setTaskTitle('');
    setTaskModalOpen(false);
  };

  // Find first incomplete topic for "Continue Studying"
  const getContinueTopic = (subjectId: string) => {
    const subject = officialSyllabus.subjects.find((s) => s.id === subjectId);
    if (!subject) return null;
    const progressRecords = user ? api.progress.getUserProgress(user.id) : [];
    const completedSet = new Set(
      Array.isArray(progressRecords) ? progressRecords.filter((p) => p.isCompleted).map((p) => p.topicId) : []
    );

    for (const mod of subject.modules) {
      for (const top of mod.topics) {
        if (top.subtopics && top.subtopics.length > 0) {
          for (const st of top.subtopics) {
            if (!completedSet.has(st.id)) {
              return { module: mod, topic: top, subtopic: st };
            }
          }
        } else {
          if (!completedSet.has(top.id)) {
            return { module: mod, topic: top };
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/90 via-indigo-800 to-violet-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <Badge variant="primary" size="sm" className="bg-white/10 text-white border-white/20">
              KTU B.Tech S7 • 2019 Scheme
            </Badge>
            <span className="text-xs text-indigo-200">Dec 2024 / Jan 2025 Exams</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}, {user?.displayName?.split(' ')[0] || 'Scholar'}!
          </h1>
          <p className="text-sm text-indigo-200 leading-relaxed">
            Ready to make solid progress? You have completed{' '}
            <strong className="text-white font-bold">{overallSummary.completedLeafCount}</strong> of{' '}
            <strong className="text-white font-bold">{overallSummary.totalLeafCount}</strong> syllabus topics.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/subjects')}
              className="bg-white text-indigo-900 hover:bg-slate-100 shadow-md font-semibold"
            >
              <BookOpen className="w-4 h-4 mr-1.5" />
              Open Syllabus Checklist
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTaskModalOpen(true)}
              className="text-white border-white/30 hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Today's Goal
            </Button>
          </div>
        </div>

        {/* Circular Progress in Header */}
        <div className="relative z-10 flex items-center justify-center shrink-0 self-center">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col items-center">
            <CircularProgress
              value={overallSummary.percentage}
              size={130}
              strokeWidth={10}
              color="#ffffff"
            >
              <span className="text-3xl font-black text-white">{overallSummary.percentage}%</span>
              <span className="text-[10px] uppercase font-bold text-indigo-200 tracking-wider">Overall</span>
            </CircularProgress>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Primary 3-Subject Progress Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Subject Overview
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All 15 KTU S7 modules with live leaf topic calculations
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/subjects')}>
            View all details <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {overallSummary.subjectSummaries.map((subject) => {
            const nextItem = getContinueTopic(subject.subjectId);

            return (
              <Card key={subject.subjectId} hoverEffect className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {subject.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {subject.name}
                      </h3>
                    </div>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {subject.percentage}%
                    </span>
                  </div>

                  <ProgressBar value={subject.percentage} color={subject.color} size="md" className="mb-4" />

                  {/* 5-Module Mini Breakdown */}
                  <div className="space-y-1.5 mb-5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      5-Module Progress
                    </p>
                    {subject.modules.map((m) => (
                      <div
                        key={m.moduleId}
                        onClick={() => navigate(`/subjects/${subject.subjectId}/modules/${m.moduleId}`)}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                      >
                        <span className="truncate text-slate-600 dark:text-slate-400">
                          M{m.moduleNumber}: {m.title.split(' ')[0]}...
                        </span>
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                          {m.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{subject.completedLeafCount} / {subject.totalLeafCount} topics done</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {subject.totalLeafCount - subject.completedLeafCount} left
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full justify-between"
                    onClick={() => {
                      if (nextItem) {
                        navigate(`/subjects/${subject.subjectId}/modules/${nextItem.module.id}`);
                      } else {
                        navigate(`/subjects/${subject.subjectId}`);
                      }
                    }}
                  >
                    <span>{nextItem ? `Continue: M${nextItem.module.moduleNumber}` : 'Review Subject'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Grid: Exam Readiness Heuristic & Real-Time Friends Online */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exam Readiness Indicator */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-4 h-4 text-indigo-500" />
                Exam Readiness Indicator
              </CardTitle>
              <Badge variant="purple" size="sm">{readiness.label}</Badge>
            </div>
            <CardDescription>
              Heuristic score based on syllabus coverage, high-priority topics, and revision depth.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800">
              <CircularProgress
                value={readiness.score}
                size={120}
                strokeWidth={10}
                color="#8b5cf6"
                subtitle="Readiness Index"
              />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Syllabus Coverage (45%)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {readiness.breakdown.coverage}%
                </span>
              </div>
              <ProgressBar value={readiness.breakdown.coverage} size="sm" color="indigo" />

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>High Priority Exam Topics (35%)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {readiness.breakdown.highPriorityCoverage}%
                </span>
              </div>
              <ProgressBar value={readiness.breakdown.highPriorityCoverage} size="sm" color="amber" />

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Revision & Confidence (20%)</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {readiness.breakdown.revisionScore}%
                </span>
              </div>
              <ProgressBar value={readiness.breakdown.revisionScore} size="sm" color="emerald" />
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 dark:text-amber-300 leading-tight">
                <strong>Planning Heuristic:</strong> This score estimates study preparedness based on completed topics and revision records. It is not an official prediction of KTU examination marks.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Friends Progress Live */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="w-4 h-4 text-emerald-500" />
                Friends Live Progress
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/friends')}>
                Manage Friends
              </Button>
            </div>
            <CardDescription>
              Real-time synchronization across devices and tabs without refreshing.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {friendsProgress.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No friends connected yet. Search classmates or share your invitation link!
              </div>
            ) : (
              friendsProgress.map(({ friend, progress }) => {
                const aiPct = progress.subjectSummaries.find((s) => s.code === 'CST401')?.percentage || 0;
                const bmiPct = progress.subjectSummaries.find((s) => s.code === 'ECT425')?.percentage || 0;
                const sicPct = progress.subjectSummaries.find((s) => s.code === 'CST433')?.percentage || 0;

                return (
                  <div
                    key={friend.id}
                    onClick={() => navigate(`/friends/${friend.id}`)}
                    className="p-3.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.displayName}
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/30"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900 dark:text-white">
                            {friend.displayName}
                          </span>
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" title="Online" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">@{friend.username} • {friend.collegeName?.split(',')[0]}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono font-medium">
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-sans">AI</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">{aiPct}%</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-sans">BMI</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{bmiPct}%</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[10px] text-slate-400 block font-sans">SIC</span>
                        <span className="text-violet-600 dark:text-violet-400 font-bold">{sicPct}%</span>
                      </div>
                      <div className="text-center pl-2 border-l border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-sans">Total</span>
                        <span className="text-slate-900 dark:text-white font-bold">{progress.percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Tasks & High-Yield PYQ Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Study Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                Today's Focus & Study Tasks
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setTaskModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No active tasks scheduled for today. Click 'Add Task' to plan your revision!
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      onClick={async () => {
                        await api.planner.toggleTask(task.id, true);
                      }}
                      className="mt-0.5 w-4 h-4 rounded border border-slate-300 dark:border-slate-600 hover:border-emerald-500 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {task.title}
                      </p>
                      {task.notes && (
                        <p className="text-[11px] text-slate-500 truncate">{task.notes}</p>
                      )}
                    </div>
                  </div>
                  <Badge variant={task.priority === 'urgent' ? 'danger' : 'warning'} size="sm">
                    {task.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* High-Yield PYQ Question Highlights */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Frequently Repeated PYQs
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/pyq')}>
                View all PYQs <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <CardDescription>
              Verified questions that appeared multiple times across KTU S7 examinations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                title: 'A* Search Algorithm optimality & admissible heuristic proof',
                subject: 'AI • CST401',
                repeat: '3 Times (Dec 22, Dec 23, Jan 24)',
                type: 'ALGORITHM • 14 Marks',
              },
              {
                title: 'ECG Machine Block Diagram with Driven Right Leg (DRL)',
                subject: 'BMI • ECT425',
                repeat: '2 Times (May 23, Dec 23)',
                type: 'DIAGRAM • 14 Marks',
              },
              {
                title: 'AES Round Stages (SubBytes, ShiftRows, MixColumns, AddRoundKey)',
                subject: 'SIC • CST433',
                repeat: '3 Times (Dec 22, Dec 23, Jan 24)',
                type: 'ALGORITHM • 14 Marks',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate('/pyq')}
                className="p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.subject}</span>
                  <Badge variant="warning" size="sm">{item.repeat}</Badge>
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                  {item.title}
                </p>
                <span className="text-[10px] text-slate-500 block mt-1">{item.type}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modal: Add Task */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title="Create Study Task"
        description="Add a task to your daily/weekly planner. Tasks remain separate from official syllabus completion."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Description
            </label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Practice Hill Cipher matrix inversion problem"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Subject
              </label>
              <select
                value={taskSubject}
                onChange={(e) => setTaskSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="sub-cst401-ai">CST401 — AI</option>
                <option value="sub-ect425-bmi">ECT425 — BMI</option>
                <option value="sub-cst433-sic">CST433 — SIC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setTaskModalOpen(false)}>
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
