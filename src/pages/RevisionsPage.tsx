import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import {
  RotateCcw,
  Star,
  Clock,
  Sparkles,
  Calendar,
  CheckCircle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import officialSyllabus from '../data/officialSyllabus.json';

export const RevisionsPage: React.FC = () => {
  const { user } = useAuth();
  const { progressMap, updateRevision } = useProgress();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const revisionItems = Array.from(progressMap.values()).filter((p) => p.isCompleted);

  // Group into revision states
  const confidentList = revisionItems.filter((r) => r.confidenceLevel >= 4 || r.revisionState === 'confident');
  const needsRevisionList = revisionItems.filter((r) => r.revisionCount === 0 || r.confidenceLevel <= 2);
  const revisedList = revisionItems.filter((r) => r.revisionCount > 0);

  const getTopicDetails = (topicId: string) => {
    for (const s of officialSyllabus.subjects) {
      for (const m of s.modules) {
        for (const t of m.topics) {
          if (t.id === topicId) return { subject: s, module: m, topic: t };
          if (t.subtopics) {
            for (const st of t.subtopics) {
              if (st.id === topicId) return { subject: s, module: m, topic: t, subtopic: st };
            }
          }
        }
      }
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
              Spaced Repetition
            </span>
            <Badge variant="outline" size="sm">Memory Retention Engine</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Revision & Confidence Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Completing a syllabus topic once is not enough for university examinations. Track spaced review cycles (1d, 3d, 7d, 14d) and mastery ratings.
          </p>
        </div>
      </div>

      {/* Revision Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {needsRevisionList.length}
            </span>
            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Needs Revision
            </p>
            <span className="text-[10px] text-slate-400">Completed once, unreviewed</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 shrink-0">
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {revisedList.length}
            </span>
            <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
              Revised Topics
            </p>
            <span className="text-[10px] text-slate-400">1+ spaced revisions logged</span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {confidentList.length}
            </span>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              High Confidence
            </p>
            <span className="text-[10px] text-slate-400">4 & 5-star rating</span>
          </div>
        </Card>
      </div>

      {/* Revision Queue List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Active Revision Queue ({revisionItems.length} Completed Topics)
        </h2>

        <div className="space-y-3">
          {revisionItems.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <RotateCcw className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                No completed topics to revise yet
              </h3>
              <p className="text-xs text-slate-500">
                Check off topics in the syllabus checklist to automatically populate your revision queue.
              </p>
            </div>
          ) : (
            revisionItems.map((item) => {
              const details = getTopicDetails(item.topicId);
              if (!details) return null;

              const title = details.subtopic ? details.subtopic.title : details.topic.title;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                        {details.subject.code} • M{details.module.moduleNumber}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Revisions: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{item.revisionCount}x</strong>
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {title}
                    </h3>
                    {item.notes && (
                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        "{item.notes}"
                      </p>
                    )}
                  </div>

                  {/* Confidence Rating & Quick Record */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => updateRevision(item.topicId, { confidenceLevel: star })}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= item.confidenceLevel
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-200 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateRevision(item.topicId, { incrementRevision: true })}
                      className="text-xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1" />
                      + Log Review
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
