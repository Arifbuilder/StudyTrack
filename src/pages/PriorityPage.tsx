import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
  Flame,
  Target,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Clock,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import officialSyllabus from '../data/officialSyllabus.json';

export const PriorityPage: React.FC = () => {
  const { isTopicCompleted, toggleTopic } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Rule-based recommendation engine
  const recommendations = useMemo(() => {
    const questions = api.pyq.getQuestions();
    const topicPYQMap = new Map<string, number>();

    questions.forEach((q) => {
      if (q.topicId) {
        topicPYQMap.set(q.topicId, (topicPYQMap.get(q.topicId) || 0) + (q.repeatCount || 1));
      }
    });

    const list: Array<{
      subjectCode: string;
      subjectId: string;
      moduleId: string;
      moduleNumber: number;
      topicId: string;
      title: string;
      description?: string;
      priority: string;
      pyqRepeat: number;
      reason: string;
      weight: number;
    }> = [];

    officialSyllabus.subjects.forEach((s) => {
      s.modules.forEach((m) => {
        m.topics.forEach((t) => {
          const completed = isTopicCompleted(t.id);
          const pyqCount = topicPYQMap.get(t.id) || 0;

          if (!completed) {
            let weight = 0;
            const reasons: string[] = [];

            if (t.priority === 'VERY_HIGH') {
              weight += 40;
              reasons.push('Tagged Very High Exam Priority in KTU Curriculum');
            } else if (t.priority === 'HIGH') {
              weight += 25;
              reasons.push('High Priority core concept');
            }

            if (pyqCount >= 3) {
              weight += 50;
              reasons.push(`Repeated ${pyqCount} times in recent KTU S7 papers`);
            } else if (pyqCount > 0) {
              weight += 25;
              reasons.push(`Appeared in past university examinations`);
            }

            if (weight > 30) {
              list.push({
                subjectCode: s.code,
                subjectId: s.id,
                moduleId: m.id,
                moduleNumber: m.moduleNumber,
                topicId: t.id,
                title: t.title,
                description: t.description,
                priority: t.priority,
                pyqRepeat: pyqCount,
                reason: reasons.join(' • '),
                weight,
              });
            }
          }
        });
      });
    });

    return list.sort((a, b) => b.weight - a.weight);
  }, [isTopicCompleted]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60">
              Exam Optimization
            </span>
            <Badge variant="outline" size="sm">Rule-Based Heuristic Engine</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Smart High-Priority Study Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligently ranked topics based on incomplete status, official KTU priority, and verified PYQ repetition frequency.
          </p>
        </div>
      </div>

      {/* Explanatory banner */}
      <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-indigo-900 dark:text-indigo-200">
            How recommendations are computed:
          </p>
          <p className="text-indigo-700 dark:text-indigo-300 leading-relaxed">
            Topics in this queue are sorted strictly using evidence: curriculum weight (Very High / High) combined with distinct university question paper appearances across Dec 2022, May 2023, Dec 2023, and Jan 2024.
          </p>
        </div>
      </div>

      {/* Recommended Topics List */}
      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
            <Award className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              Outstanding! All high-priority exam topics completed!
            </h3>
            <p className="text-xs text-slate-500">
              You have completed all high-priority syllabus topics. Proceed to the Revision Tracker to lock in retention.
            </p>
          </div>
        ) : (
          recommendations.map((rec) => (
            <div
              key={rec.topicId}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                    {rec.subjectCode} • Module {rec.moduleNumber}
                  </span>
                  <Badge variant={rec.priority === 'VERY_HIGH' ? 'danger' : 'warning'} size="sm">
                    {rec.priority === 'VERY_HIGH' ? 'Very High Priority' : 'High Priority'}
                  </Badge>
                  {rec.pyqRepeat > 0 && (
                    <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full text-[10px] border border-amber-300/50">
                      <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                      Repeated {rec.pyqRepeat}x in KTU Exams
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {rec.title}
                </h3>

                {rec.description && (
                  <p className="text-xs text-slate-500 line-clamp-1">{rec.description}</p>
                )}

                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <strong>Why recommended:</strong> <span>{rec.reason}</span>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleTopic(rec.topicId, false)}
                  className="text-xs"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                  Mark Completed
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(`/subjects/${rec.subjectId}/modules/${rec.moduleId}`)}
                  className="text-xs"
                >
                  <span>Study Topic</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
