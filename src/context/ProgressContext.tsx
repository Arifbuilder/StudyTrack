import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { realtimeChannel } from '../services/localDatabase';
import { Topic, OverallProgressSummary, UserTopicProgress } from '../types';
import confetti from 'canvas-confetti';

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
  const { user } = useAuth();
  const [completedTopicIds, setCompletedTopicIds] = useState<Set<string>>(new Set());
  const [progressMap, setProgressMap] = useState<Map<string, UserTopicProgress>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const loadProgress = useCallback(async () => {
    if (!user) {
      setCompletedTopicIds(new Set());
      setProgressMap(new Map());
      setIsLoading(false);
      return;
    }

    try {
      const records = await api.progress.getUserProgress(user.id);
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

    // Listen to realtime progress updates from other tabs or friends
    const channel = realtimeChannel;
    if (channel) {
      const handler = (e: MessageEvent) => {
        if (e.data?.type === 'PROGRESS_UPDATED') {
          loadProgress();
        }
      };
      channel.addEventListener('message', handler);
      return () => {
        channel.removeEventListener('message', handler);
      };
    }
  }, [loadProgress]);

  // Overall summary calculated from real records
  const overallSummary = useMemo(() => {
    if (!user) {
      return {
        completedLeafCount: 0,
        totalLeafCount: 0,
        percentage: 0,
        subjectSummaries: [],
      };
    }
    return api.progress.calculateOverall(user.id);
  }, [user, completedTopicIds]);

  const readiness = useMemo(() => {
    if (!user) {
      return {
        score: 0,
        label: 'Not Started',
        breakdown: { coverage: 0, highPriorityCoverage: 0, revisionScore: 0 },
      };
    }
    return api.progress.calculateReadiness(user.id);
  }, [user, completedTopicIds, progressMap]);

  // Optimistic Topic Toggle with instant feedback & rollback safeguard
  const toggleTopic = async (topicId: string, currentCompletedState: boolean) => {
    if (!user) return;

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
      const updatedRecord = await api.progress.toggleTopic(user.id, topicId, nextState);
      setProgressMap((prev) => {
        const nextMap = new Map(prev);
        nextMap.set(topicId, updatedRecord);
        return nextMap;
      });
    } catch (err) {
      console.error('Failed to toggle topic, rolling back optimistic state:', err);
      // Rollback
      setCompletedTopicIds((prev) => {
        const rollback = new Set(prev);
        if (currentCompletedState) rollback.add(topicId);
        else rollback.delete(topicId);
        return rollback;
      });
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
    if (!user) return;
    try {
      const res = await api.progress.updateRevision(user.id, topicId, updates);
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
        toggleTopic,
        updateRevision,
        isTopicCompleted,
        getParentTopicStatus,
        refreshProgress: loadProgress,
      }}
    >
      {children}
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
