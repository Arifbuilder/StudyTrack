import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  Search,
  Filter,
  Layers,
  Sparkles,
  Plus,
  Clock,
  List,
  AlignJustify,
  Target,
  RotateCcw,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { TopicItem } from '../components/checklist/TopicItem';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import officialSyllabus from '../data/officialSyllabus.json';
import { Topic } from '../types';

export const ModuleChecklistPage: React.FC = () => {
  const { id: subjectId, moduleId } = useParams<{ id: string; moduleId: string }>();
  const { overallSummary, completedTopicIds, toggleTopic, isTopicCompleted, refreshProgress } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeView, setActiveView] = useState<'checklist' | 'compact' | 'priority' | 'revision'>('checklist');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'incomplete'>('all');

  const [addTopicModalOpen, setAddTopicModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicDesc, setNewTopicDesc] = useState('');
  const [newTopicPriority, setNewTopicPriority] = useState<'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  const subject = api.syllabus.getSubject(subjectId || '');
  const moduleData = subject?.modules.find(
    (m) => m.id === moduleId || m.moduleNumber.toString() === moduleId
  );

  // Custom personal topics for this module
  const customTopics = user && moduleData ? api.customTopics.getCustomTopics(user.id, moduleData.id) : [];

  if (!subject || !moduleData) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Module Not Found</h2>
        <Button onClick={() => navigate('/subjects')}>Back to Subjects</Button>
      </div>
    );
  }

  // Calculate module statistics
  const subjectSummary = overallSummary.subjectSummaries.find((s) => s.subjectId === subject.id);
  const moduleSummary = subjectSummary?.modules.find((m) => m.moduleId === moduleData.id);
  const modPercentage = moduleSummary ? moduleSummary.percentage : 0;
  const completedCount = moduleSummary ? moduleSummary.completedLeafCount : 0;
  const totalCount = moduleSummary ? moduleSummary.totalLeafCount : 0;

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return moduleData.topics.filter((topic) => {
      // Search
      const matchesSearch =
        topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.subtopics?.some((st) => st.title.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // Priority
      if (filterPriority !== 'all' && topic.priority !== filterPriority) {
        return false;
      }

      // Status
      if (filterStatus === 'completed') {
        if (topic.subtopics && topic.subtopics.length > 0) {
          const allDone = topic.subtopics.every((st) => completedTopicIds.has(st.id));
          if (!allDone) return false;
        } else {
          if (!completedTopicIds.has(topic.id)) return false;
        }
      } else if (filterStatus === 'incomplete') {
        if (topic.subtopics && topic.subtopics.length > 0) {
          const allDone = topic.subtopics.every((st) => completedTopicIds.has(st.id));
          if (allDone) return false;
        } else {
          if (completedTopicIds.has(topic.id)) return false;
        }
      }

      return true;
    });
  }, [moduleData, searchQuery, filterPriority, filterStatus, completedTopicIds]);

  // Bulk complete all in module
  const handleBulkComplete = () => {
    moduleData.topics.forEach((t) => {
      if (t.subtopics && t.subtopics.length > 0) {
        t.subtopics.forEach((st) => {
          if (!isTopicCompleted(st.id)) toggleTopic(st.id, false);
        });
      } else {
        if (!isTopicCompleted(t.id)) toggleTopic(t.id, false);
      }
    });
  };

  const handleCreatePersonalTopic = async () => {
    if (!user || !newTopicTitle.trim()) return;
    await api.customTopics.addCustomTopic({
      userId: user.id,
      moduleId: moduleData.id,
      title: newTopicTitle.trim(),
      description: newTopicDesc.trim() || undefined,
      priority: newTopicPriority,
      displayOrder: 999,
    });
    setNewTopicTitle('');
    setNewTopicDesc('');
    setAddTopicModalOpen(false);
    refreshProgress();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/subjects/${subject.id}`)}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          {subject.code}
        </Button>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-xs font-semibold text-slate-500">Module {moduleData.moduleNumber}</span>
      </div>

      {/* Module Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-xs font-bold font-mono rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                {subject.code} • Module {moduleData.moduleNumber}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {moduleData.lectureHours} lecture hours
              </span>
              <Badge variant="outline" size="sm">Official KTU Syllabus</Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {moduleData.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {moduleData.description}
            </p>
          </div>

          {/* Module percentage card */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 shrink-0 min-w-[130px]">
            <span className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {modPercentage}%
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">
              {completedCount} / {totalCount} completed
            </span>
          </div>
        </div>

        <ProgressBar value={modPercentage} color={subject.color} size="md" />

        {/* View Switchers & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Views */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
            <button
              onClick={() => setActiveView('checklist')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeView === 'checklist'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Detailed Tree</span>
            </button>
            <button
              onClick={() => setActiveView('compact')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeView === 'compact'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Compact</span>
            </button>
            <button
              onClick={() => setActiveView('priority')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeView === 'priority'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-500" />
              <span>High Priority</span>
            </button>
            <button
              onClick={() => setActiveView('revision')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors font-medium ${
                activeView === 'revision'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-500" />
              <span>Revisions</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBulkComplete}
              className="text-xs"
              title="Mark all topics in this module as completed"
            >
              <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
              Mark All Done
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAddTopicModalOpen(true)}
              className="text-xs"
              title="Add a personal topic to this module"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Personal Topic
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter topics..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="VERY_HIGH">Very High Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All States</option>
            <option value="incomplete">Incomplete</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Interactive Topics List */}
      <div className="space-y-3">
        {filteredTopics.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No topics match filter</h3>
            <p className="text-xs text-slate-500">Try clearing the search query or status filter.</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              subjectCode={subject.code}
              moduleId={moduleData.id}
              onOpenPYQ={() => navigate('/pyq')}
            />
          ))
        )}

        {/* Custom Personal Topics in this module */}
        {customTopics.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Personal Syllabus Layer ({customTopics.length} Custom Topics)
            </h3>
            {customTopics.map((ct) => (
              <div
                key={ct.id}
                className="p-3.5 rounded-xl border border-indigo-200/60 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={async () => {
                      await api.customTopics.toggleCustomTopic(ct.id, !ct.isCompleted);
                      refreshProgress();
                    }}
                    className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                      ct.isCompleted
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}
                  >
                    {ct.isCompleted && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                  <div>
                    <p className={`text-sm font-semibold ${ct.isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                      {ct.title}
                    </p>
                    {ct.description && (
                      <p className="text-xs text-slate-500">{ct.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">Personal</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-rose-500 hover:text-rose-700"
                    onClick={async () => {
                      await api.customTopics.deleteCustomTopic(ct.id);
                      refreshProgress();
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add Personal Topic */}
      <Modal
        isOpen={addTopicModalOpen}
        onClose={() => setAddTopicModalOpen(false)}
        title="Add Personal Topic to Module"
        description="Add a personalized study topic or problem set to this module. Preserves syllabus layering without modifying official university standards."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Topic Title
            </label>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="e.g. Solving 2023 KTU Alpha-Beta Pruning Numerical Question"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Study Notes (Optional)
            </label>
            <textarea
              value={newTopicDesc}
              onChange={(e) => setNewTopicDesc(e.target.value)}
              rows={3}
              placeholder="Add personal reminders or textbook pages..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Exam Priority
            </label>
            <select
              value={newTopicPriority}
              onChange={(e) => setNewTopicPriority(e.target.value as any)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="VERY_HIGH">Very High Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Low Priority</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setAddTopicModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreatePersonalTopic}>
              Add to My Syllabus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
