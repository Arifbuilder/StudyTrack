import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { localDb, realtimeChannel } from '../services/localDatabase';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Topic, OverallProgressSummary, UserTopicProgress } from '../types';
import confetti from 'canvas-confetti';
import { UnlockPasswordModal } from '../components/auth/UnlockPasswordModal';

interface ProgressContextType {
  completedTopicIds: Set<string>;
  progressMap: Map<string, UserTopicProgress>;
  overallSummary: OverallProgressSummary;
  readiness: {
    score: number;
    label: string;
    breakdown: {
      coverage: number;
      highPriorityCoverage: number;
      revisionScore: number;
    };
  };
  isLoading: boolean;
  isReadOnly: boolean;
  canEdit: boolean;
  unlockModalOpen: boolean;
  setUnlockModalOpen: (open: boolean) => void;
  toggleTopic: (topicId: string, currentCompletedState: boolean) => Promise<void>;
  updateRevision: (
    topicId: string,
    updates: {
      revisionState?: UserTopicProgress['revisionState'];
      confidenceLevel?: number;
      incrementRevision?: boolean;
      notes?: string;
    }
  ) => Promise<void>;
  isTopicCompleted: (topicId: string) => boolean;
  getParentTopicStatus: (topic: Topic) => 'completed' | 'incomplete' | 'partial';
  refreshProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isReadOnly, canEdit } = useAuth();
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set());
  const [progressMap, setProgressMap] = useState<Map<string, UserTopicProgress>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    const activeUserId = user?.id || localDb.getCurrentUserId();
    if (!activeUserId) {
      setCompletedTopicIds(new Set());
      setProgressMap(new Map());
      setIsLoading(false);
      return;
    }

    try {
      const records = await api.progress.getUserProgress(activeUserId);
      const completedSet = new Set<string>();
      const map = new Map<string, UserTopicProgress>();

      records.forEach((r) => {
        map.set(r.topicId, r);
        if (r.isCompleted) {
          completedSet.add(r.topicId);
        }
      });

      setCompletedTopicIds(completedSet);
      setProgressMap(map);
    } catch (e) {
      console.error('Failed to load user progress:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProgress();

    // 1. Same-device multi-tab BroadcastChannel
    const channel = realtimeChannel;
    let localHandler: ((e: MessageEvent) => void) | null = null;
    if (channel) {
      localHandler = (e: MessageEvent) => {
        if (e.data?.type === 'PROGRESS_UPDATED') {
          loadProgress();
        }
      };
      channel.addEventListener('message', localHandler);
    }

    // 2. Cross-device Cloud Realtime Subscription (Desktop <-> Mobile)
    let supabaseChannel: any = null;
    if (isSupabaseConfigured && supabase) {
      try {
        supabaseChannel = supabase
          .channel('public:user_topic_progress')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'user_topic_progress',
            },
            (payload) => {
              console.log('[Cloud Realtime Sync] Received progress update from another device:', payload);
              loadProgress();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn('[Supabase Realtime] Subscription error:', err);
      }
    }

    return () => {
      if (channel && localHandler) {
        channel.removeEventListener('message', localHandler);
      }
      if (supabaseChannel && supabase) {
        supabase.removeChannel(supabaseChannel);
      }
    };
  }, [loadProgress]);

  // Overall summary calculated from real records
  const overallSummary = useMemo(() => {
    const activeUserId = user?.id || localDb.getCurrentUserId();
    if (!activeUserId) {
      return {
        completedLeafCount: 0,
        totalLeafCount: 0,
        percentage: 0,
        subjectSummaries: [],
      };
    }
    return api.progress.calculateOverall(activeUserId);
  }, [user, completedTopicIds]);

  const readiness = useMemo(() => {
    const activeUserId = user?.id || localDb.getCurrentUserId();
    if (!activeUserId) {
      return {
        score: 0,
        label: 'Not Started',
        breakdown: { coverage: 0, highPriorityCoverage: 0, revisionScore: 0 },
      };
    }
    return api.progress.calculateReadiness(activeUserId);
  }, [user, completedTopicIds, progressMap]);

  // Optimistic Topic Toggle with instant feedback & rollback safeguard
  const toggleTopic = async (topicId: string, currentCompletedState: boolean) => {
    // SECURITY CHECK: If in view-only mode, prompt for password instead of toggling!
    if (isReadOnly || !canEdit) {
      setUnlockModalOpen(true);
      return;
    }

    const activeUserId = user?.id || localDb.getCurrentUserId();
    if (!activeUserId) return;

    const nextState = !currentCompletedState;

    // 1. Optimistic UI update
    setCompletedTopicIds((prev) => {
      const updated = new Set(prev);
      if (nextState) updated.add(topicId);
      else updated.delete(topicId);
      return updated;
    });

    // Milestone celebration effect
    if (nextState) {
      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.85 },
          colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // ignore animation if canvas not ready
      }
    }

    // 2. Persist to DB
    try {
      const updatedRecord = await api.progress.toggleTopic(activeUserId, topicId, nextState);
      setProgressMap((prev) => {
        const nextMap = new Map(prev);
        nextMap.set(topicId, updatedRecord);
        return nextMap;
      });
    } catch (err) {
      console.warn('Persist to API had warning/error, saving to local state:', err);
      try {
        const updatedRecord = localDb.toggleTopicCompletion(activeUserId, topicId, nextState);
        setProgressMap((prev) => {
          const nextMap = new Map(prev);
          nextMap.set(topicId, updatedRecord);
          return nextMap;
        });
      } catch (fallbackErr) {
        console.error('Failed to toggle topic, rolling back optimistic state:', fallbackErr);
        // Rollback only if local persistence also fails
        setCompletedTopicIds((prev) => {
          const rollback = new Set(prev);
          if (currentCompletedState) rollback.add(topicId);
          else rollback.delete(topicId);
          return rollback;
        });
      }
    }
  };

  const updateRevision = async (
    topicId: string,
    updates: {
      revisionState?: UserTopicProgress['revisionState'];
      confidenceLevel?: number;
      incrementRevision?: boolean;
      notes?: string;
    }
  ) => {
    // SECURITY CHECK: If in view-only mode, prompt for password!
    if (isReadOnly || !canEdit) {
      setUnlockModalOpen(true);
      return;
    }

    const activeUserId = user?.id || localDb.getCurrentUserId();
    if (!activeUserId) return;
    try {
      const res = await api.progress.updateRevision(activeUserId, topicId, updates);
      setProgressMap((prev) => {
        const nextMap = new Map(prev);
        nextMap.set(topicId, res);
        return nextMap;
      });
      if (res.isCompleted && !completedTopicIds.has(topicId)) {
        setCompletedTopicIds((prev) => new Set(prev).add(topicId));
      }
    } catch (e) {
      console.error('Failed to update revision state:', e);
    }
  };

  const isTopicCompleted = useCallback(
    (topicId: string): boolean => {
      return completedTopicIds.has(topicId);
    },
    [completedTopicIds]
  );

  const getParentTopicStatus = useCallback(
    (topic: Topic): 'completed' | 'incomplete' | 'partial' => {
      if (!topic.subtopics || topic.subtopics.length === 0) {
        return completedTopicIds.has(topic.id) ? 'completed' : 'incomplete';
      }

      const totalSubtopics = topic.subtopics.length;
      let completedSubtopics = 0;

      topic.subtopics.forEach((st) => {
        if (completedTopicIds.has(st.id)) {
          completedSubtopics += 1;
        }
      });

      if (completedSubtopics === 0) return 'incomplete';
      if (completedSubtopics === totalSubtopics) return 'completed';
      return 'partial';
    },
    [completedTopicIds]
  );

  return (
    <ProgressContext.Provider
      value={{
        completedTopicIds,
        progressMap,
        overallSummary,
        readiness,
        isLoading,
        isReadOnly,
        canEdit,
        unlockModalOpen,
        setUnlockModalOpen,
        toggleTopic,
        updateRevision,
        isTopicCompleted,
        getParentTopicStatus,
        refreshProgress: loadProgress,
      }}
    >
      {children}
      <UnlockPasswordModal
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onSuccess={() => {
          loadProgress();
        }}
      />
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
