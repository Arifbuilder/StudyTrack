import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Minus,
  Sparkles,
  FileText,
  StickyNote,
  ChevronDown,
  ChevronRight,
  Star,
  Plus,
  Clock,
} from 'lucide-react';
import { Topic, Subtopic, PriorityLevel } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface TopicItemProps {
  topic: Topic;
  subjectCode: string;
  moduleId: string;
  onOpenPYQ?: (topicId: string) => void;
}

export const TopicItem: React.FC<TopicItemProps> = ({ topic, subjectCode, moduleId, onOpenPYQ }) => {
  const { user } = useAuth();
  const {
    isTopicCompleted,
    toggleTopic,
    getParentTopicStatus,
    progressMap,
    updateRevision,
    refreshProgress,
  } = useProgress();

  const [expanded, setExpanded] = useState(true);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [addSubtopicModalOpen, setAddSubtopicModalOpen] = useState(false);

  const [noteContent, setNoteContent] = useState('');
  const [newSubtopicTitle, setNewSubtopicTitle] = useState('');

  const hasSubtopics = topic.subtopics && topic.subtopics.length > 0;
  const parentStatus = getParentTopicStatus(topic);
  const isLeafCompleted = !hasSubtopics ? isTopicCompleted(topic.id) : parentStatus === 'completed';

  const userProgress = progressMap.get(topic.id);
  const confidence = userProgress?.confidenceLevel || 0;
  const revisionCount = userProgress?.revisionCount || 0;

  // Check if topic is linked to PYQs
  const pyqs = api.pyq.getQuestions().filter((q) => q.topicId === topic.id);
  const pyqRepeatCount = pyqs.reduce((acc, q) => acc + (q.appearsIn?.length || 1), 0);

  const priorityVariants: Record<PriorityLevel, 'danger' | 'warning' | 'default' | 'outline'> = {
    VERY_HIGH: 'danger',
    HIGH: 'warning',
    MEDIUM: 'default',
    LOW: 'outline',
  };

  const priorityLabels: Record<PriorityLevel, string> = {
    VERY_HIGH: 'Very High Priority',
    HIGH: 'High Priority',
    MEDIUM: 'Medium Priority',
    LOW: 'Low Priority',
  };

  const handleParentCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasSubtopics) {
      toggleTopic(topic.id, isTopicCompleted(topic.id));
    } else {
      // Bulk check/uncheck all subtopics
      const shouldComplete = parentStatus !== 'completed';
      topic.subtopics.forEach((st) => {
        if (isTopicCompleted(st.id) !== shouldComplete) {
          toggleTopic(st.id, !shouldComplete);
        }
      });
    }
  };

  const handleOpenNote = async () => {
    if (user) {
      const note = await api.notes.getNote(user.id, topic.id);
      setNoteContent(note?.content || userProgress?.notes || '');
    }
    setNoteModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (user) {
      await api.notes.saveNote(user.id, topic.id, noteContent);
      await updateRevision(topic.id, { notes: noteContent });
      setNoteModalOpen(false);
    }
  };

  const handleAddCustomSubtopic = async () => {
    if (!user || !newSubtopicTitle.trim()) return;
    await api.customTopics.addCustomTopic({
      userId: user.id,
      moduleId,
      parentTopicId: topic.id,
      title: newSubtopicTitle.trim(),
      priority: 'HIGH',
      displayOrder: 99,
    });
    setNewSubtopicTitle('');
    setAddSubtopicModalOpen(false);
    refreshProgress();
  };

  return (
    <div className="border border-slate-200/80 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs transition-all overflow-hidden mb-3">
      {/* Topic Row */}
      <div
        className={`p-3.5 sm:p-4 flex items-start gap-3.5 transition-colors ${
          isLeafCompleted
            ? 'bg-slate-50/70 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400'
            : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
        }`}
      >
        {/* Parent Checkbox */}
        <button
          type="button"
          onClick={handleParentCheckboxClick}
          className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 shrink-0 ${
            parentStatus === 'completed' || (!hasSubtopics && isLeafCompleted)
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
              : parentStatus === 'partial'
              ? 'bg-indigo-100 border-indigo-500 text-indigo-700 dark:bg-indigo-950 dark:border-indigo-400'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-800'
          }`}
          title={
            hasSubtopics
              ? parentStatus === 'completed'
                ? 'All subtopics completed'
                : parentStatus === 'partial'
                ? 'Partially completed subtopics'
                : 'Click to mark all subtopics completed'
              : isLeafCompleted
              ? 'Mark incomplete'
              : 'Mark complete'
          }
        >
          {parentStatus === 'completed' || (!hasSubtopics && isLeafCompleted) ? (
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : parentStatus === 'partial' ? (
            <Minus className="w-3.5 h-3.5 stroke-[3]" />
          ) : null}
        </button>

        {/* Topic Content & Subtopic Toggle */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className={`text-sm font-semibold tracking-tight transition-all ${
                isLeafCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {topic.title}
            </span>

            {/* Exam Priority Badge */}
            <Badge variant={priorityVariants[topic.priority]} size="sm">
              {priorityLabels[topic.priority]}
            </Badge>

            {/* PYQ Repeat Badge */}
            {pyqRepeatCount > 0 && (
              <button
                onClick={() => onOpenPYQ && onOpenPYQ(topic.id)}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition-colors border border-amber-300/50"
                title={`${pyqRepeatCount} past KTU exam questions linked to this topic`}
              >
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>KTU PYQ ({pyqRepeatCount}x)</span>
              </button>
            )}

            {/* Revision Tag */}
            {revisionCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50">
                <Clock className="w-2.5 h-2.5" />
                Rev ×{revisionCount}
              </span>
            )}
          </div>

          {topic.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {topic.description}
            </p>
          )}

          {/* Action Row */}
          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
            {hasSubtopics && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors"
              >
                {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>
                  {topic.subtopics.length} Subtopics ({topic.subtopics.filter((st) => isTopicCompleted(st.id)).length} done)
                </span>
              </button>
            )}

            <button
              onClick={handleOpenNote}
              className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Add personal study notes"
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>{userProgress?.notes ? 'Edit Note' : 'Add Note'}</span>
            </button>

            <button
              onClick={() => setRevisionModalOpen(true)}
              className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Record revision status & confidence"
            >
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>{confidence > 0 ? `${confidence}/5 Stars` : 'Confidence'}</span>
            </button>

            <button
              onClick={() => setAddSubtopicModalOpen(true)}
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title="Add personal subtopic"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subtopic</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtopics Nested Tree */}
      <AnimatePresence>
        {hasSubtopics && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/60 divide-y divide-slate-100 dark:divide-slate-800/60 pl-6 sm:pl-10"
          >
            {topic.subtopics.map((subtopic) => {
              const subCompleted = isTopicCompleted(subtopic.id);
              return (
                <div
                  key={subtopic.id}
                  onClick={() => toggleTopic(subtopic.id, subCompleted)}
                  className="py-2.5 pr-4 flex items-start gap-3 text-xs hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer select-none"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTopic(subtopic.id, subCompleted);
                    }}
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-all shrink-0 ${
                      subCompleted
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-indigo-400'
                    }`}
                  >
                    {subCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`font-medium transition-all ${
                        subCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {subtopic.title}
                    </span>
                  </div>

                  <Badge variant={priorityVariants[subtopic.priority]} size="sm">
                    {subtopic.priority}
                  </Badge>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Personal Note */}
      <Modal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title={`Study Notes: ${topic.title}`}
        description="Private notes saved permanently to your personal database."
      >
        <div className="space-y-4">
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            rows={5}
            placeholder="Write key equations, algorithm steps, or exam tips for this topic..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveNote}>
              Save Note
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Revision & Confidence Tracker */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title={`Revision & Confidence: ${topic.title}`}
        description="Track your mastery level and schedule spaced repetition."
      >
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Confidence Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => updateRevision(topic.id, { confidenceLevel: star })}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= confidence
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-medium text-slate-500 ml-2">
                {confidence === 5 ? 'Mastered' : confidence >= 3 ? 'Good' : 'Needs Practice'}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Spaced Repetition Status
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Completed revisions: <span className="font-bold text-indigo-600 dark:text-indigo-400">{revisionCount}</span>
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => updateRevision(topic.id, { incrementRevision: true })}
            >
              + Record Revision Session Today
            </Button>
          </div>

          <div className="flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setRevisionModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Add Personal Subtopic */}
      <Modal
        isOpen={addSubtopicModalOpen}
        onClose={() => setAddSubtopicModalOpen(false)}
        title="Add Custom Subtopic"
        description={`Add a personal subtopic to '${topic.title}'. Saved in your personal syllabus layer.`}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newSubtopicTitle}
            onChange={(e) => setNewSubtopicTitle(e.target.value)}
            placeholder="Subtopic title (e.g. 2023 KTU Solved Problem 4)"
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setAddSubtopicModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleAddCustomSubtopic}>
              Add Personal Subtopic
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
