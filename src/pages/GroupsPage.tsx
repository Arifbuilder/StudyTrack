import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FolderKanban,
  Users,
  Plus,
  KeyRound,
  ShieldCheck,
  TrendingUp,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { StudyGroup } from '../types';

export const GroupsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('grp-ktu-s7-cse');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);

  const [groupName, setGroupName] = useState('');
  const [groupDesc, setGroupDesc] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  const groups = user ? api.groups.getGroups(user.id) : [];
  const activeDetails = user ? api.groups.getGroupDetails(selectedGroupId) : null;

  const handleCreateGroup = async () => {
    if (!user || !groupName.trim()) return;
    const newG = await api.groups.createGroup(groupName.trim(), groupDesc.trim(), user.id);
    setSelectedGroupId(newG.id);
    setGroupName('');
    setGroupDesc('');
    setCreateModalOpen(false);
  };

  const handleJoinByCode = async () => {
    if (!user || !joinCode.trim()) return;
    setJoinError('');
    try {
      const g = await api.groups.joinByCode(joinCode.trim(), user.id);
      setSelectedGroupId(g.id);
      setJoinCode('');
      setJoinModalOpen(false);
    } catch (err: any) {
      setJoinError(err.message || 'Invalid invite code');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400 border border-violet-200/60">
              Collaborative Hub
            </span>
            <Badge variant="outline" size="sm">KTU Peer Cohorts</Badge>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Collaborative Study Groups
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Form exam cohorts with classmates, compare collective progress, and share high-priority study milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setJoinModalOpen(true)}>
            <KeyRound className="w-3.5 h-3.5 mr-1.5" />
            Join with Code
          </Button>
          <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Create Study Group
          </Button>
        </div>
      </div>

      {/* Main Grid: Groups Sidebar & Group Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Your Groups List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Your Study Groups ({groups.length})
          </h2>
          {groups.map((g) => (
            <div
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedGroupId === g.id
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {g.name}
                </h3>
                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {g.inviteCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                {g.description}
              </p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {g.memberCount} Members
                </span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">View Cohort →</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Active Group Dashboard & Leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          {activeDetails ? (
            <>
              {/* Group Overview Banner */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary" size="sm">Cohort Leaderboard</Badge>
                      <span className="text-xs text-slate-400 font-mono">
                        Invite Code: <strong>{activeDetails.group.inviteCode}</strong>
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      {activeDetails.group.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {activeDetails.group.description}
                    </p>
                  </div>

                  {/* Cohort average progress */}
                  <div className="flex flex-col items-center justify-center p-3.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl border border-indigo-100 dark:border-indigo-900 shrink-0 min-w-[130px]">
                    <span className="font-mono text-3xl font-black text-indigo-600 dark:text-indigo-400">
                      {activeDetails.averageProgress}%
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                      Cohort Average
                    </span>
                  </div>
                </div>

                <ProgressBar value={activeDetails.averageProgress} color="indigo" size="md" />
              </div>

              {/* Member Leaderboard */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Member Syllabus Progress Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Real-time rankings based on completed leaf topics in KTU S7 AI, BMI, and SIC.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeDetails.members
                    .sort((a, b) => b.progress.percentage - a.progress.percentage)
                    .map((member, index) => {
                      const isMe = member.userId === user?.id;
                      const aiPct = member.progress.subjectSummaries.find((s) => s.code === 'CST401')?.percentage || 0;
                      const bmiPct = member.progress.subjectSummaries.find((s) => s.code === 'ECT425')?.percentage || 0;
                      const sicPct = member.progress.subjectSummaries.find((s) => s.code === 'CST433')?.percentage || 0;

                      return (
                        <div
                          key={member.id}
                          className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                            isMe
                              ? 'bg-indigo-50/40 dark:bg-indigo-950/30 border-indigo-300 dark:border-indigo-800'
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-bold text-sm text-slate-400 w-5">
                              #{index + 1}
                            </span>
                            <img
                              src={member.userProfile?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                              alt={member.userProfile?.displayName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                  {member.userProfile?.displayName} {isMe && '(You)'}
                                </span>
                                {member.role === 'owner' && (
                                  <Badge variant="primary" size="sm">Owner</Badge>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">@{member.userProfile?.username}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="text-center">
                              <span className="text-[10px] text-slate-400 block font-sans">AI</span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{aiPct}%</span>
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-slate-400 block font-sans">BMI</span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{bmiPct}%</span>
                            </div>
                            <div className="text-center">
                              <span className="text-[10px] text-slate-400 block font-sans">SIC</span>
                              <span className="font-bold text-violet-600 dark:text-violet-400">{sicPct}%</span>
                            </div>
                            <div className="text-right pl-3 border-l border-slate-200 dark:border-slate-700 min-w-[70px]">
                              <span className="text-lg font-black text-slate-900 dark:text-white">
                                {member.progress.percentage}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500">
              Select or create a study group to view member collaboration details.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Group */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Study Group"
        description="Form an exam preparation cohort for your university class."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g. KTU S7 CSE Section B Exam Squad"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>
            <textarea
              value={groupDesc}
              onChange={(e) => setGroupDesc(e.target.value)}
              rows={3}
              placeholder="e.g. Preparing for CST401, ECT425, and CST433. Daily check-ins."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateGroup}>
              Create Group
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal: Join Group */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join Study Group with Invite Code"
        description="Enter the 6-character code provided by your study group owner."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Invitation Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="e.g. KTUS7CSE or PYQCRUSH"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {joinError && <p className="text-xs text-rose-500">{joinError}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleJoinByCode}>
              Join Group
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
