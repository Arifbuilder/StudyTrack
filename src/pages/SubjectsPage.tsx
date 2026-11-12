import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import {
  Cpu,
  Activity,
  Lock,
  ArrowRight,
  BookOpen,
  Award,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import officialSyllabus from '../data/officialSyllabus.json';

export const SubjectsPage: React.FC = () => {
  const { overallSummary } = useProgress();
  const navigate = useNavigate();

  const iconMap: Record<string, any> = {
    'sub-cst401-ai': Cpu,
    'sub-ect425-bmi': Activity,
    'sub-cst433-sic': Lock,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            KTU S7 Subjects & Modules
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            2019 Scheme • 3 Examination Subjects • 15 Modules Total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="primary" size="md">
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            B.Tech Semester 7
          </Badge>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {officialSyllabus.subjects.map((subject) => {
          const summary = overallSummary.subjectSummaries.find((s) => s.subjectId === subject.id);
          const percentage = summary ? summary.percentage : 0;
          const completedCount = summary ? summary.completedLeafCount : 0;
          const totalCount = summary ? summary.totalLeafCount : 0;
          const Icon = iconMap[subject.id] || BookOpen;

          return (
            <Card key={subject.id} hoverEffect className="flex flex-col justify-between">
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" size="sm">{subject.category}</Badge>
                </div>

                {/* Title & Code */}
                <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-0.5">
                  {subject.code}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2">
                  {subject.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {subject.description}
                </p>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-600 dark:text-slate-300">Completion</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{percentage}%</span>
                  </div>
                  <ProgressBar value={percentage} color={subject.color} size="md" />
                </div>

                {/* Metadata tags */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>5 Modules</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    <span>{subject.credits} Credits</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px]">
                    <span>{completedCount} of {totalCount} topics finished</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <Button
                variant="primary"
                size="md"
                className="w-full justify-between mt-2"
                onClick={() => navigate(`/subjects/${subject.id}`)}
              >
                <span>Explore Subject Modules</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
