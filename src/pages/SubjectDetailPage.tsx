import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import {
  ArrowLeft,
  BookOpen,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  GraduationCap,
  FileText,
  Target,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { api } from '../services/api';
import officialSyllabus from '../data/officialSyllabus.json';

export const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { overallSummary, completedTopicIds } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();

  const subject = officialSyllabus.subjects.find((s) => s.id === id || s.code.toLowerCase() === id?.toLowerCase());

  if (!subject) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Subject Not Found</h2>
        <Button onClick={() => navigate('/subjects')}>Back to All Subjects</Button>
      </div>
    );
  }

  const subjectSummary = overallSummary.subjectSummaries.find((s) => s.subjectId === subject.id);
  const percentage = subjectSummary ? subjectSummary.percentage : 0;
  const completedCount = subjectSummary ? subjectSummary.completedLeafCount : 0;
  const totalCount = subjectSummary ? subjectSummary.totalLeafCount : 0;
  const remainingCount = totalCount - completedCount;

  // Estimated remaining study hours (approx 30 mins per remaining leaf topic)
  const remainingHours = Math.ceil(remainingCount * 0.5);

  // High-priority count in this subject
  let highPriorityCount = 0;
  subject.modules.forEach((m) => {
    m.topics.forEach((t) => {
      if (t.priority === 'VERY_HIGH' || t.priority === 'HIGH') highPriorityCount += 1;
      if (t.subtopics) {
        t.subtopics.forEach((st) => {
          if (st.priority === 'VERY_HIGH' || st.priority === 'HIGH') highPriorityCount += 1;
        });
      }
    });
  });

  // Find first incomplete topic for "Continue Where I Left Off"
  let continueItem: { moduleId: string; moduleNumber: number; title: string } | null = null;
  for (const mod of subject.modules) {
    for (const t of mod.topics) {
      if (t.subtopics && t.subtopics.length > 0) {
        for (const st of t.subtopics) {
          if (!completedTopicIds.has(st.id)) {
            continueItem = { moduleId: mod.id, moduleNumber: mod.moduleNumber, title: st.title };
            break;
          }
        }
      } else {
        if (!completedTopicIds.has(t.id)) {
          continueItem = { moduleId: mod.id, moduleNumber: mod.moduleNumber, title: t.title };
          break;
        }
      }
      if (continueItem) break;
    }
    if (continueItem) break;
  }

  // Related PYQs for this subject
  const subjectPYQs = api.pyq.getQuestions().filter((q) => q.subjectId === subject.id);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/subjects')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          All Subjects
        </Button>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-xs font-semibold text-slate-500">{subject.code}</span>
      </div>

      {/* Subject Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-md">
                {subject.code}
              </span>
              <Badge variant="primary" size="sm">{subject.category}</Badge>
              <Badge variant="outline" size="sm">{subject.credits} Credits</Badge>
              <Badge variant="outline" size="sm">{subject.lectureHours} Lecture Hours</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {subject.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {subject.description}
            </p>
            {subject.textbook && (
              <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                <strong>Prescribed Textbook:</strong> {subject.textbook}
              </p>
            )}
          </div>

          {/* Large percentage metric */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shrink-0 min-w-[160px]">
            <span className="font-mono text-4xl font-black text-indigo-600 dark:text-indigo-400">
              {percentage}%
            </span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
              Subject Mastery
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {completedCount} / {totalCount} topics
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <ProgressBar value={percentage} color={subject.color} size="lg" />
        </div>

        {/* Action Bar: Continue Where I Left Off */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Est. Remaining Workload: <strong>~{remainingHours} hrs</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Related PYQs: <strong>{subjectPYQs.length} verified</strong></span>
            </div>
          </div>

          {continueItem ? (
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/subjects/${subject.id}/modules/${continueItem!.moduleId}`)}
              className="shadow-md shadow-indigo-500/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Continue: M{continueItem.moduleNumber} ({continueItem.title.slice(0, 24)}...)</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Badge variant="success" size="md">
              All topics in this subject completed!
            </Badge>
          )}
        </div>
      </div>

      {/* 5 Module Breakdown Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Five Module Breakdown
          </h2>
          <span className="text-xs text-slate-500">Click any module to open interactive checklist</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {subject.modules.map((module) => {
            const modSummary = subjectSummary?.modules.find((m) => m.moduleId === module.id);
            const modPercentage = modSummary ? modSummary.percentage : 0;
            const modCompleted = modSummary ? modSummary.completedLeafCount : 0;
            const modTotal = modSummary ? modSummary.totalLeafCount : 0;

            return (
              <div
                key={module.id}
                onClick={() => navigate(`/subjects/${subject.id}/modules/${module.id}`)}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        Module {module.moduleNumber}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.lectureHours} lecture hours
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      {module.description}
                    </p>
                  </div>

                  {/* Right: Progress and Action */}
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="w-32 sm:w-44 text-right">
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-500">{modCompleted}/{modTotal} topics</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                          {modPercentage}%
                        </span>
                      </div>
                      <ProgressBar value={modPercentage} color={subject.color} size="sm" />
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
