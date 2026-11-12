import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Award,
  Layers,
  Sparkles,
  HeartHandshake,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { api } from '../services/api';
import officialSyllabus from '../data/officialSyllabus.json';

export const FriendComparePage: React.FC = () => {
  const { id: friendId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { overallSummary: myProgress } = useProgress();
  const navigate = useNavigate();

  // Get friend profile from local storage
  const allUsers = user ? api.friends.getFriends(user.id) : [];
  const friendRecord = allUsers.find((f) => f.friend.id === friendId);

  if (!friendRecord) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Friend Not Found</h2>
        <Button onClick={() => navigate('/friends')}>Back to Friends</Button>
      </div>
    );
  }

  const { friend: friendProfile, progress: friendProgress } = friendRecord;

  // Comparison metrics
  const overallDiff = myProgress.percentage - friendProgress.percentage;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/friends')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Friends
        </Button>
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-xs font-semibold text-slate-500">Compare with {friendProfile.displayName}</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="primary" size="sm">
              <HeartHandshake className="w-3.5 h-3.5 mr-1" />
              Collaborative Peer Study
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Progress Comparison
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Comparing your progress with <strong>{friendProfile.displayName}</strong> (@{friendProfile.username}).
            </p>
          </div>

          {/* Encouraging non-judgmental banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-200 max-w-sm">
            <p className="font-semibold mb-1">Pair Programming & Study Tip:</p>
            <p className="text-[11px] leading-relaxed">
              Every student masters modules at their own pace. Use this comparison to share notes on difficult algorithms and divide upcoming revision tasks!
            </p>
          </div>
        </div>

        {/* Big Side-by-Side Overall Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          {/* You */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user?.avatarUrl}
                  alt={user?.displayName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">You ({user?.displayName})</h3>
                  <span className="text-[10px] text-slate-400 font-mono">@{user?.username}</span>
                </div>
              </div>
              <span className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {myProgress.percentage}%
              </span>
            </div>
            <ProgressBar value={myProgress.percentage} color="indigo" size="md" />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{myProgress.completedLeafCount} topics done</span>
              <span>{myProgress.totalLeafCount - myProgress.completedLeafCount} remaining</span>
            </div>
          </div>

          {/* Friend */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={friendProfile.avatarUrl}
                  alt={friendProfile.displayName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{friendProfile.displayName}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">@{friendProfile.username}</span>
                </div>
              </div>
              <span className="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {friendProgress.percentage}%
              </span>
            </div>
            <ProgressBar value={friendProgress.percentage} color="emerald" size="md" />
            <div className="flex justify-between text-xs text-slate-500">
              <span>{friendProgress.completedLeafCount} topics done</span>
              <span>{friendProgress.totalLeafCount - friendProgress.completedLeafCount} remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Subject Side-by-Side Comparison */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Subject-by-Subject Breakdown
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {officialSyllabus.subjects.map((sub) => {
            const mySub = myProgress.subjectSummaries.find((s) => s.subjectId === sub.id);
            const friendSub = friendProgress.subjectSummaries.find((s) => s.subjectId === sub.id);
            const myPct = mySub?.percentage || 0;
            const frPct = friendSub?.percentage || 0;

            return (
              <Card key={sub.id} className="space-y-4">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {sub.code}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {sub.name}
                  </h3>
                </div>

                <div className="space-y-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-400">You</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{myPct}%</strong>
                    </div>
                    <ProgressBar value={myPct} size="sm" color="indigo" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-400">{friendProfile.displayName.split(' ')[0]}</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{frPct}%</strong>
                    </div>
                    <ProgressBar value={frPct} size="sm" color="emerald" />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between pt-1">
                  <span>Delta Difference:</span>
                  <strong className={myPct >= frPct ? 'text-indigo-600' : 'text-emerald-600'}>
                    {Math.abs(myPct - frPct)} percentage points
                  </strong>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Module-by-Module Detailed Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            Detailed 15-Module Comparison Table
          </CardTitle>
          <CardDescription>
            Identify which modules either of you can explain to help each other prepare.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Subject & Module</th>
                  <th className="py-2.5 px-3 font-semibold">Module Title</th>
                  <th className="py-2.5 px-3 font-semibold">Your Progress</th>
                  <th className="py-2.5 px-3 font-semibold">{friendProfile.displayName}'s Progress</th>
                  <th className="py-2.5 px-3 font-semibold">Collaboration Synergy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {officialSyllabus.subjects.flatMap((s) =>
                  s.modules.map((m) => {
                    const myMod = myProgress.subjectSummaries
                      .find((sub: any) => sub.subjectId === s.id)
                      ?.modules.find((mod: any) => mod.moduleId === m.id);
                    const frMod = friendProgress.subjectSummaries
                      .find((sub: any) => sub.subjectId === s.id)
                      ?.modules.find((mod: any) => mod.moduleId === m.id);
                    const myPct = myMod?.percentage || 0;
                    const frPct = frMod?.percentage || 0;

                    let synergy = 'Both practicing';
                    if (myPct >= 80 && frPct < 50) synergy = 'You can teach this module';
                    else if (frPct >= 80 && myPct < 50) synergy = `${friendProfile.displayName.split(' ')[0]} can guide you`;
                    else if (myPct >= 70 && frPct >= 70) synergy = 'Both exam ready';

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {s.code} • M{m.moduleNumber}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">
                          {m.title}
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {myPct}%
                        </td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {frPct}%
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge
                            variant={
                              synergy.includes('teach')
                                ? 'primary'
                                : synergy.includes('guide')
                                ? 'warning'
                                : synergy.includes('ready')
                                ? 'success'
                                : 'default'
                            }
                            size="sm"
                          >
                            {synergy}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
