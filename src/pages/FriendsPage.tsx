import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  UserPlus,
  Share2,
  Check,
  X,
  Search,
  ArrowRight,
  Shield,
  Copy,
  Sparkles,
  Award,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';

export const FriendsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchUsername, setSearchUsername] = useState('');
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const friends = user ? api.friends.getFriends(user.id) : [];
  const pendingRequests = user ? api.friends.getRequests(user.id) : [];

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !searchUsername.trim()) return;
    setRequestError('');
    setRequestSuccess('');

    try {
      await api.friends.sendRequest(user.id, searchUsername.trim());
      setRequestSuccess(`Friend request sent to @${searchUsername}!`);
      setSearchUsername('');
    } catch (err: any) {
      setRequestError(err.message || 'Failed to send friend request');
    }
  };

  const handleCopyInviteLink = () => {
    if (!user) return;
    const inviteUrl = `${window.location.origin}/register?invitedBy=${user.username}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60">
              Real-Time Collaboration
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync Enabled
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Friends & Study Partners
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track authorized classmates' study progress live. When your friend checks a topic, it updates here immediately.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleCopyInviteLink}>
          {copiedLink ? <Check className="w-4 h-4 mr-1.5 text-emerald-500" /> : <Share2 className="w-4 h-4 mr-1.5" />}
          <span>{copiedLink ? 'Link Copied!' : 'Copy Study Invitation Link'}</span>
        </Button>
      </div>

      {/* Grid: Search Friend & Pending Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Search / Add Friend Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-500" />
              Add Classmate by Username
            </CardTitle>
            <CardDescription>
              Connect with university batchmates preparing for KTU S7 examinations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendRequest} className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">@</span>
                  <input
                    type="text"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    placeholder="e.g. kailas_s7, arif_ktu, lini_s7"
                    className="w-full pl-7 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <Button type="submit" variant="primary" size="sm">
                  Send Request
                </Button>
              </div>

              {requestError && <p className="text-xs text-rose-500">{requestError}</p>}
              {requestSuccess && <p className="text-xs text-emerald-600">{requestSuccess}</p>}

              <p className="text-[11px] text-slate-400">
                Try adding demo users: <strong>kailas_s7</strong>, <strong>arif_ktu</strong>, or <strong>lini_s7</strong>
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>Incoming Friend Requests</span>
              <Badge variant="primary" size="sm">{pendingRequests.length}</Badge>
            </CardTitle>
            <CardDescription>
              Approve partners to share mutual progress tracking.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingRequests.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                No pending requests. Share your username or invite link!
              </p>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={req.senderProfile?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                      alt={req.senderProfile?.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {req.senderProfile?.displayName}
                      </p>
                      <p className="text-[10px] text-slate-400">@{req.senderProfile?.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={async () => {
                        await api.friends.respondToRequest(req.id, true);
                      }}
                      className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                      title="Accept friend request"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={async () => {
                        await api.friends.respondToRequest(req.id, false);
                      }}
                      className="p-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition-colors"
                      title="Decline request"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Authorized Friends Progress List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Connected Friends ({friends.length})
          </h2>
          <span className="text-xs text-slate-500">Live percentages computed from database records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {friends.map(({ friend, progress }) => {
            const aiPct = progress.subjectSummaries.find((s) => s.code === 'CST401')?.percentage || 0;
            const bmiPct = progress.subjectSummaries.find((s) => s.code === 'ECT425')?.percentage || 0;
            const sicPct = progress.subjectSummaries.find((s) => s.code === 'CST433')?.percentage || 0;

            return (
              <Card key={friend.id} hoverEffect className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={friend.avatarUrl}
                        alt={friend.displayName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/30"
                      />
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                          {friend.displayName}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">@{friend.username}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-[170px]">
                          {friend.collegeName?.split(',')[0]}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {progress.percentage}%
                    </span>
                  </div>

                  <ProgressBar value={progress.percentage} size="sm" color="indigo" className="mb-4" />

                  {/* 3-Subject Breakdown */}
                  <div className="space-y-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Artificial Intelligence (CST401)</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{aiPct}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Biomedical Instrumentation (ECT425)</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{bmiPct}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Security in Computing (CST433)</span>
                      <span className="font-mono font-bold text-violet-600 dark:text-violet-400">{sicPct}%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => navigate(`/friends/${friend.id}`)}
                  >
                    <span>Compare Study Progress</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
