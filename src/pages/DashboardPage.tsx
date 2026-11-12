import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import {
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flame,
  Sparkles,
  BookOpen,
  Filter,
  CheckSquare,
  Square,
  Clock,
  Layers,
  ArrowRight,
  Database,
} from 'lucide-react';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import officialSyllabus from '../data/officialSyllabus.json';
import { Topic, Subtopic } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { overallSummary, isTopicCompleted, toggleTopic, getParentTopicStatus } = useProgress();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all'); // 'all' | 'sub-cst401-ai' | 'sub-ect425-bmi' | 'sub-cst433-sic'
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'high_priority'>('all');

  // Expanded Modules State (default expand first module of each or all)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    'cst401-m1': true,
    'ect425-m1': true,
    'cst433-m1': true,
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    officialSyllabus.subjects.forEach((s) => {
      s.modules.forEach((m) => {
        all[m.id] = true;
      });
    });
    setExpandedModules(all);
  };

  const collapseAll = () => {
    setExpandedModules({});
  };

  // Filtered Subjects & Modules
  const filteredSubjects = useMemo(() => {
    return officialSyllabus.subjects
      .filter((s) => selectedSubject === 'all' || s.id === selectedSubject)
      .map((subject) => {
        const filteredModules = subject.modules.map((mod) => {
          const filteredTopics = mod.topics.filter((topic) => {
            // Text search match
            const matchesQuery =
              !searchQuery.trim() ||
              topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              topic.subtopics?.some((st) => st.title.toLowerCase().includes(searchQuery.toLowerCase()));

            if (!matchesQuery) return false;

            // Status filter
            const hasSub = topic.subtopics && topic.subtopics.length > 0;
            const isCompleted = hasSub
              ? getParentTopicStatus(topic as unknown as Topic) === 'completed'
              : isTopicCompleted(topic.id);

            if (filterStatus === 'completed') return isCompleted;
            if (filterStatus === 'pending') return !isCompleted;
            if (filterStatus === 'high_priority') {
              return (
                topic.priority === 'VERY_HIGH' ||
                topic.priority === 'HIGH' ||
                topic.subtopics?.some((st) => st.priority === 'VERY_HIGH' || st.priority === 'HIGH')
              );
            }

            return true;
          });

          return { ...mod, topics: filteredTopics };
        });

        return { ...subject, modules: filteredModules };
      });
  }, [selectedSubject, searchQuery, filterStatus, isTopicCompleted, getParentTopicStatus]);

  // AI Study Insight calculation
  const aiInsight = useMemo(() => {
    const totalDone = overallSummary.completedLeafCount;
    if (totalDone === 0) {
      return {
        title: 'Start Here for Maximum KTU Marks',
        tip: 'Begin with CST401 Module 2 (Search: BFS, DFS, A*) or CST433 Module 2 (AES & Block Ciphers). These two modules carry 28+ marks in Part B university examinations.',
      };
    }
    if (totalDone < 30) {
      return {
        title: 'High-Yield Momentum',
        tip: 'Make sure you master the compulsory 14-mark diagrams: ECG Driven Right Leg (ECT425 Module 2) and Pacemaker Block Circuitry (ECT425 Module 4).',
      };
    }
    return {
      title: 'Revision & PYQ Polish',
      tip: 'You have solid coverage! Focus on repeated KTU Part A 3-mark definitions (PEAS, CIA Triad, Action Potentials) to secure full marks in Part A.',
    };
  }, [overallSummary.completedLeafCount]);

  // Frequently repeated PYQ highlights
  const topRepeatedPYQs = [
    { title: 'A* Search optimality & admissible heuristic proof', subject: 'CST401 (AI)', marks: '14 Marks', repeat: '3x Repeated' },
    { title: 'AES Round Stages: SubBytes, ShiftRows, MixColumns', subject: 'CST433 (SIC)', marks: '14 Marks', repeat: '3x Repeated' },
    { title: 'ECG Machine Block Diagram with Driven Right Leg (DRL)', subject: 'ECT425 (BMI)', marks: '14 Marks', repeat: '2x Repeated' },
    { title: 'Alpha-Beta Pruning algorithm with game tree example', subject: 'CST401 (AI)', marks: '14 Marks', repeat: '2x Repeated' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* 1. At-a-Glance Progress Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">KTU B.Tech S7</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                2019 Scheme
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
              Syllabus Progress Tracker
            </h1>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black font-mono text-slate-900 dark:text-white">
              {overallSummary.percentage}%
            </span>
            <p className="text-xs text-slate-500">
              {overallSummary.completedLeafCount} of {overallSummary.totalLeafCount} topics done
            </p>
          </div>
        </div>

        <ProgressBar value={overallSummary.percentage} size="md" color="indigo" className="mb-4" />

        {/* 3 Quick Subject Filter Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {overallSummary.subjectSummaries.map((s) => {
            const isSelected = selectedSubject === s.subjectId;
            return (
              <button
                key={s.subjectId}
                onClick={() => setSelectedSubject(isSelected ? 'all' : s.subjectId)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 ring-1 ring-slate-900 dark:ring-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{s.code}</span>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    {s.percentage}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mb-1.5">{s.name}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>5 Modules</span>
                  <span>{s.completedLeafCount}/{s.totalLeafCount}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Simple AI Study Insight */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs">
          <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
            AI Exam Guidance • {aiInsight.title}
          </span>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {aiInsight.tip}
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, algorithms, or keywords (e.g. A*, ECG, AES, RSA)..."
              className="w-full pl-9.5 pr-4 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:focus:ring-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Expand/Collapse */}
          <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-800 transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All 3 Subjects (15 Modules)' },
              { id: 'sub-cst401-ai', label: 'CST401 AI' },
              { id: 'sub-ect425-bmi', label: 'ECT425 BMI' },
              { id: 'sub-cst433-sic', label: 'CST433 SIC' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSubject(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedSubject === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Pills */}
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending', label: 'Pending' },
              { id: 'completed', label: 'Completed' },
              { id: 'high_priority', label: '🔥 High Priority' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id as any)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  filterStatus === f.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Complete Syllabus Checklist (All 15 Modules Inline) */}
      <div className="space-y-4">
        {filteredSubjects.map((subject) => {
          const subjectSummary = overallSummary.subjectSummaries.find((s) => s.subjectId === subject.id);

          return (
            <div key={subject.id} className="space-y-3">
              {/* Subject Group Title (when showing all) */}
              {selectedSubject === 'all' && (
                <div className="flex items-center justify-between pt-3 pb-1 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {subject.code} — {subject.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">({subject.credits || 4} Credits • {subject.lectureHours} hrs)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                    {subjectSummary?.percentage || 0}%
                  </span>
                </div>
              )}

              {/* Modules Accordion */}
              {subject.modules.map((mod) => {
                const modSummary = subjectSummary?.modules.find((m) => m.moduleId === mod.id);
                const isExpanded = Boolean(expandedModules[mod.id]);
                const totalModLeaves = modSummary?.totalLeafCount || 0;
                const completedModLeaves = modSummary?.completedLeafCount || 0;
                const modPercentage = modSummary?.percentage || 0;

                return (
                  <div
                    key={mod.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
                  >
                    {/* Module Accordion Header */}
                    <div
                      onClick={() => toggleModule(mod.id)}
                      className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                          M{mod.moduleNumber}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {mod.title}
                          </h3>
                          <span className="text-[11px] text-slate-400">
                            {mod.lectureHours} Lecture Hours • {completedModLeaves}/{totalModLeaves} completed
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                            {modPercentage}%
                          </span>
                          <div className="w-16 mt-0.5">
                            <ProgressBar value={modPercentage} size="sm" color="indigo" />
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </div>

                    {/* Module Topics Checklist */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 dark:border-slate-800/80 p-3.5 space-y-2 bg-slate-50/40 dark:bg-slate-950/20">
                        {mod.topics.length === 0 ? (
                          <p className="text-xs text-slate-400 py-2 text-center">
                            No topics matching the current filter.
                          </p>
                        ) : (
                          mod.topics.map((topic) => {
                            const hasSub = topic.subtopics && topic.subtopics.length > 0;
                            const parentStatus = hasSub ? getParentTopicStatus(topic as unknown as Topic) : null;
                            const isTopicChecked = !hasSub ? isTopicCompleted(topic.id) : parentStatus === 'completed';

                            return (
                              <div
                                key={topic.id}
                                className="p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors"
                              >
                                {/* Main Topic Row */}
                                <div className="flex items-start gap-2.5">
                                  {/* Checkbox */}
                                  <button
                                    onClick={() => {
                                      if (!hasSub) {
                                        toggleTopic(topic.id, isTopicCompleted(topic.id));
                                      } else {
                                        const shouldCheck = parentStatus !== 'completed';
                                        topic.subtopics?.forEach((st) => {
                                          if (isTopicCompleted(st.id) !== shouldCheck) {
                                            toggleTopic(st.id, !shouldCheck);
                                          }
                                        });
                                      }
                                    }}
                                    className="mt-0.5 shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
                                  >
                                    {hasSub ? (
                                      parentStatus === 'completed' ? (
                                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                                      ) : parentStatus === 'partial' ? (
                                        <div className="w-4 h-4 rounded border-2 border-indigo-500 bg-indigo-500/20 flex items-center justify-center">
                                          <div className="w-2 h-0.5 bg-indigo-600" />
                                        </div>
                                      ) : (
                                        <Square className="w-4 h-4" />
                                      )
                                    ) : isTopicCompleted(topic.id) ? (
                                      <CheckSquare className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                      <Square className="w-4 h-4" />
                                    )}
                                  </button>

                                  {/* Topic Title & Badges */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span
                                        className={`text-xs font-semibold ${
                                          isTopicChecked
                                            ? 'line-through text-slate-400 dark:text-slate-500'
                                            : 'text-slate-900 dark:text-slate-100'
                                        }`}
                                      >
                                        {topic.title}
                                      </span>
                                      {topic.priority === 'VERY_HIGH' && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                                          Very High Priority
                                        </span>
                                      )}
                                      {topic.priority === 'HIGH' && (
                                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                                          High Priority
                                        </span>
                                      )}
                                      {(topic as any).estimatedHours && (
                                        <span className="text-[10px] text-slate-400">
                                          {(topic as any).estimatedHours} hrs
                                        </span>
                                      )}
                                    </div>

                                    {topic.description && (
                                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                        {topic.description}
                                      </p>
                                    )}

                                    {/* Subtopics Checklist */}
                                    {hasSub && (
                                      <div className="mt-2.5 pl-3 border-l-2 border-slate-100 dark:border-slate-800 space-y-1.5">
                                        {topic.subtopics?.map((st) => {
                                          const isSubDone = isTopicCompleted(st.id);
                                          return (
                                            <div
                                              key={st.id}
                                              onClick={() => toggleTopic(st.id, isSubDone)}
                                              className="flex items-center gap-2 py-0.5 cursor-pointer select-none group"
                                            >
                                              <button className="shrink-0 text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                {isSubDone ? (
                                                  <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                                                ) : (
                                                  <Square className="w-3.5 h-3.5" />
                                                )}
                                              </button>
                                              <span
                                                className={`text-[11px] ${
                                                  isSubDone
                                                    ? 'line-through text-slate-400 dark:text-slate-500'
                                                    : 'text-slate-700 dark:text-slate-300'
                                                }`}
                                              >
                                                {st.title}
                                              </span>
                                              {st.priority === 'VERY_HIGH' && (
                                                <span className="text-[9px] font-bold text-rose-500">
                                                  [Important]
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* 5. Frequently Repeated PYQs (At-a-Glance) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Essential KTU S7 University Questions (Part B • 14 Marks)
            </h2>
          </div>
          <button
            onClick={() => navigate('/pyq')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
          >
            View Complete PYQ Bank <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {topRepeatedPYQs.map((q, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/pyq')}
              className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">{q.subject}</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono text-[10px]">
                  {q.repeat}
                </span>
              </div>
              <p className="font-medium text-slate-900 dark:text-slate-100 leading-snug">
                {q.title}
              </p>
              <span className="text-[10px] text-slate-400 mt-1 block">{q.marks}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
