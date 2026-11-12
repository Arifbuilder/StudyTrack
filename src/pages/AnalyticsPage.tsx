import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle,
  Clock,
  Target,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import officialSyllabus from '../data/officialSyllabus.json';

export const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const { overallSummary, readiness, progressMap } = useProgress();

  // Subject completion data for Bar chart
  const subjectChartData = overallSummary.subjectSummaries.map((s) => ({
    name: s.code,
    subject: s.name,
    completed: s.completedLeafCount,
    remaining: s.totalLeafCount - s.completedLeafCount,
    percentage: s.percentage,
  }));

  // 15-module data for radar or comparison
  const moduleData = officialSyllabus.subjects.flatMap((s) =>
    s.modules.map((m) => {
      const summary = overallSummary.subjectSummaries
        .find((sub) => sub.subjectId === s.id)
        ?.modules.find((mod) => mod.moduleId === m.id);
      return {
        module: `${s.code} M${m.moduleNumber}`,
        percentage: summary ? summary.percentage : 0,
      };
    })
  );

  // Activity Heatmap Simulation for the last 4 weeks (28 days) based on real database completed timestamps
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const dateStr = d.toISOString().split('T')[0];

    // Count topics completed on this day
    let count = 0;
    progressMap.forEach((p) => {
      if (p.completedAt && p.completedAt.startsWith(dateStr)) {
        count += 1;
      }
    });

    return {
      date: dateStr,
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      count,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60">
              Syllabus Analytics
            </span>
            <Badge variant="outline" size="sm">Actual Database Records</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Study Analytics & Readiness Insights
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Transparent statistics calculated strictly from completed leaf syllabus records. No hardcoded or simulated percentages.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Overall Completion</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              {overallSummary.percentage}%
            </span>
          </div>
          <ProgressBar value={overallSummary.percentage} size="sm" color="indigo" />
          <p className="text-[10px] text-slate-400">
            {overallSummary.completedLeafCount} of {overallSummary.totalLeafCount} leaf topics
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Exam Readiness Heuristic</span>
            <Award className="w-4 h-4 text-violet-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-violet-600 dark:text-violet-400 font-mono">
              {readiness.score}/100
            </span>
            <Badge variant="purple" size="sm">{readiness.label}</Badge>
          </div>
          <ProgressBar value={readiness.score} size="sm" color="violet" />
          <p className="text-[10px] text-slate-400">
            Multi-factor: Coverage + High Yield + Revisions
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>High-Priority Coverage</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {readiness.breakdown.highPriorityCoverage}%
            </span>
          </div>
          <ProgressBar value={readiness.breakdown.highPriorityCoverage} size="sm" color="amber" />
          <p className="text-[10px] text-slate-400">
            Very High & High university priorities
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Remaining Workload</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
              ~{Math.ceil((overallSummary.totalLeafCount - overallSummary.completedLeafCount) * 0.5)}h
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {overallSummary.totalLeafCount - overallSummary.completedLeafCount} topics remaining
          </p>
          <p className="text-[10px] text-slate-400">
            Estimated at 30 mins per leaf topic
          </p>
        </Card>
      </div>

      {/* Subject-Wise Completion Recharts Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              Subject-Wise Completed vs Remaining
            </CardTitle>
            <CardDescription>
              Leaf topic distribution across AI (CST401), BMI (ECT425), and SIC (CST433).
            </CardDescription>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="completed" fill="#6366f1" name="Completed Topics" radius={[4, 4, 0, 0]} />
                <Bar dataKey="remaining" fill="#cbd5e1" name="Remaining Topics" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 15-Module Radar Chart */}
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              15-Module Balance Radar
            </CardTitle>
            <CardDescription>
              Ensure balanced preparation across all 5 modules per subject.
            </CardDescription>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={moduleData}>
                <PolarGrid opacity={0.3} />
                <PolarAngleAxis dataKey="module" stroke="#94a3b8" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                <Radar name="Completion %" dataKey="percentage" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.95)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Study Consistency Heatmap (28-day streak tracker) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" />
            Study Consistency Calendar (Past 4 Weeks)
          </CardTitle>
          <CardDescription>
            Visualizing days with completed topic checkpoints. Does not penalize for rest days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {heatmapDays.map((day) => {
              let bg = 'bg-slate-100 dark:bg-slate-800 text-slate-400';
              if (day.count >= 5) bg = 'bg-indigo-600 text-white font-bold';
              else if (day.count >= 3) bg = 'bg-indigo-500 text-white font-semibold';
              else if (day.count >= 1) bg = 'bg-indigo-300 dark:bg-indigo-800 text-slate-900 dark:text-white';

              return (
                <div
                  key={day.date}
                  className={`w-9 h-9 rounded-xl flex flex-col items-center justify-center text-[10px] transition-transform hover:scale-110 cursor-pointer ${bg}`}
                  title={`${day.date}: ${day.count} topics completed`}
                >
                  <span className="text-[9px] uppercase opacity-75">{day.day}</span>
                  <span>{day.count > 0 ? day.count : '•'}</span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <span>Less active</span>
            <span className="w-3 h-3 rounded bg-slate-100 dark:bg-slate-800" />
            <span className="w-3 h-3 rounded bg-indigo-300 dark:bg-indigo-800" />
            <span className="w-3 h-3 rounded bg-indigo-500" />
            <span className="w-3 h-3 rounded bg-indigo-600" />
            <span>Highly active</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
