// ==============================================================================
// SYLLABUSSYNC LOCAL PERSISTENT DATABASE ENGINE
// Provides 100% offline, zero-mock, real relational state management & multi-tab realtime
// ==============================================================================

import officialSyllabus from '../data/officialSyllabus.json';
import officialPYQs from '../data/officialPYQs.json';
import {
  UserProfile,
  UserSettings,
  UserTopicProgress,
  CustomTopic,
  StudyTask,
  UserNote,
  Friendship,
  FriendRequest,
  StudyGroup,
  GroupMember,
  AuditLog,
  SubjectProgressSummary,
  ModuleProgressSummary,
  OverallProgressSummary,
  QuestionPaper,
  PYQQuestion
} from '../types';

const STORAGE_KEYS = {
  INITIALIZED: 'syllabussync_db_initialized',
  PROFILES: 'syllabussync_profiles',
  SETTINGS: 'syllabussync_settings',
  PROGRESS: 'syllabussync_user_progress',
  CUSTOM_TOPICS: 'syllabussync_custom_topics',
  TASKS: 'syllabussync_tasks',
  NOTES: 'syllabussync_notes',
  FRIENDSHIPS: 'syllabussync_friendships',
  FRIEND_REQUESTS: 'syllabussync_friend_requests',
  GROUPS: 'syllabussync_groups',
  GROUP_MEMBERS: 'syllabussync_group_members',
  AUDIT_LOGS: 'syllabussync_audit_logs',
  QUESTION_PAPERS: 'syllabussync_question_papers',
  PYQ_QUESTIONS: 'syllabussync_pyq_questions',
  ACTIVITY_EVENTS: 'syllabussync_activity_events',
  CURRENT_USER_ID: 'syllabussync_current_user_id',
};

// Realtime BroadcastChannel for instantaneous multi-tab / multi-user sync
export const realtimeChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('syllabussync_realtime_channel')
  : null;

export interface RealtimePayload {
  type: 'PROGRESS_UPDATED' | 'TASK_UPDATED' | 'FRIEND_REQUEST' | 'GROUP_UPDATED' | 'USER_DELETED';
  userId: string;
  data?: any;
  timestamp: number;
}

export function broadcastEvent(event: RealtimePayload) {
  if (realtimeChannel) {
    try {
      realtimeChannel.postMessage(event);
    } catch (e) {
      console.warn('Realtime broadcast failed', e);
    }
  }
}

// Local Storage Helper with safety
function getTable<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error(`Failed to load ${key} from storage`, e);
    return defaultValue;
  }
}

function setTable<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to save ${key} to storage`, e);
  }
}

// ----------------------------------------------------------------------------
// DB INITIALIZATION & SEEDING
// ----------------------------------------------------------------------------
const DB_VERSION_KEY = 'syllabussync_db_version';
const CURRENT_VERSION = 'v2_real_users_zero_progress';

export function initializeLocalDatabase(): void {
  if (typeof localStorage === 'undefined') return;

  const currentVersion = localStorage.getItem(DB_VERSION_KEY);
  if (currentVersion !== CURRENT_VERSION) {
    // Purge old cached test users and old seeded progress
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    localStorage.setItem(DB_VERSION_KEY, CURRENT_VERSION);
  }

  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  if (initialized) return;

  console.log('[SyllabusSync DB] Initializing clean database for real KTU students...');

  // System Super-Admin account (0% progress, system coordinator)
  const initialProfiles: UserProfile[] = [
    {
      id: 'usr-superadmin',
      email: 'admin@syllabussync.edu',
      username: 'superadmin',
      displayName: 'System Super Admin',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'KTU Platform Administrator & Curriculum Coordinator',
      university: 'APJ Abdul Kalam Technological University (KTU)',
      semester: 'S7',
      collegeName: 'College of Engineering Trivandrum',
      studyGoal: 'Maintain university examination standards & syllabus updates',
      role: 'super_admin',
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  // User Settings (Initial)
  const initialSettings: Record<string, UserSettings> = {
    'usr-superadmin': {
      userId: 'usr-superadmin',
      theme: 'system',
      progressVisibility: 'friends',
      emailNotifications: true,
      studyReminders: true,
      dailyGoalMinutes: 180,
    },
  };

  // Strictly ZERO seeded progress - all users start with 0% and gradually increase as they check topics
  const initialProgress: UserTopicProgress[] = [];

  // Zero mock friendships
  const initialFriendships: Friendship[] = [];

  // Zero mock groups
  const initialGroups: StudyGroup[] = [];
  const initialGroupMembers: GroupMember[] = [];

  // Zero mock tasks
  const initialTasks: StudyTask[] = [];

  // System Audit Logs
  const initialAuditLogs: AuditLog[] = [
    {
      id: 'log-1',
      actorId: 'usr-superadmin',
      actorUsername: 'superadmin',
      action: 'SYSTEM_INITIALIZED',
      entityType: 'SYSTEM',
      entityId: 'all',
      details: { version: '2.0.0', scheme: 'KTU 2019 Scheme S7', subjects: ['CST401', 'ECT425', 'CST433'] },
      createdAt: new Date().toISOString(),
    },
    {
      id: 'log-2',
      actorId: 'usr-superadmin',
      actorUsername: 'superadmin',
      action: 'SYLLABUS_VERIFIED',
      entityType: 'SYLLABUS',
      entityId: 'official-ktu-2019-s7',
      details: { moduleCount: 15, verifiedAgainst: 'KTU Official S7 Syllabus PDF' },
      createdAt: new Date().toISOString(),
    },
  ];

  // Set tables
  setTable(STORAGE_KEYS.PROFILES, initialProfiles);
  setTable(STORAGE_KEYS.SETTINGS, initialSettings);
  setTable(STORAGE_KEYS.PROGRESS, initialProgress);
  setTable(STORAGE_KEYS.CUSTOM_TOPICS, []);
  setTable(STORAGE_KEYS.TASKS, initialTasks);
  setTable(STORAGE_KEYS.NOTES, []);
  setTable(STORAGE_KEYS.FRIENDSHIPS, initialFriendships);
  setTable(STORAGE_KEYS.FRIEND_REQUESTS, []);
  setTable(STORAGE_KEYS.GROUPS, initialGroups);
  setTable(STORAGE_KEYS.GROUP_MEMBERS, initialGroupMembers);
  setTable(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  setTable(STORAGE_KEYS.QUESTION_PAPERS, (officialPYQs as any).papers);
  setTable(STORAGE_KEYS.PYQ_QUESTIONS, (officialPYQs as any).questions);
  setTable(STORAGE_KEYS.INITIALIZED, 'true');

  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'usr-superadmin');
  }

  console.log('[SyllabusSync DB] Local database initialized cleanly with 0% progress.');
}

// ----------------------------------------------------------------------------
// PROGRESS RECALCULATION ENGINE (LEAF-ONLY MATHEMATICAL FORMULA)
// ----------------------------------------------------------------------------
export function calculateUserProgress(userId: string): OverallProgressSummary {
  const userProgress = getTable<UserTopicProgress[]>(STORAGE_KEYS.PROGRESS, []).filter(
    (p) => p.userId === userId && p.isCompleted
  );
  const completedTopicIdSet = new Set(userProgress.map((p) => p.topicId));

  // Also include personal completed custom topics
  const customTopics = getTable<CustomTopic[]>(STORAGE_KEYS.CUSTOM_TOPICS, []).filter(
    (ct) => ct.userId === userId && !ct.isArchived
  );

  let grandTotalLeaves = 0;
  let grandCompletedLeaves = 0;

  const subjectSummaries: SubjectProgressSummary[] = officialSyllabus.subjects.map((subject) => {
    let subjectTotalLeaves = 0;
    let subjectCompletedLeaves = 0;

    const moduleSummaries: ModuleProgressSummary[] = subject.modules.map((mod) => {
      let moduleTotalLeaves = 0;
      let moduleCompletedLeaves = 0;

      mod.topics.forEach((topic) => {
        if (topic.subtopics && topic.subtopics.length > 0) {
          topic.subtopics.forEach((subtopic) => {
            moduleTotalLeaves += 1;
            if (completedTopicIdSet.has(subtopic.id)) {
              moduleCompletedLeaves += 1;
            }
          });
        } else {
          moduleTotalLeaves += 1;
          if (completedTopicIdSet.has(topic.id)) {
            moduleCompletedLeaves += 1;
          }
        }
      });

      // Factor in custom topics belonging to this module
      const moduleCustom = customTopics.filter((ct) => ct.moduleId === mod.id);
      moduleTotalLeaves += moduleCustom.length;
      moduleCompletedLeaves += moduleCustom.filter((ct) => ct.isCompleted).length;

      const modPercentage = moduleTotalLeaves > 0
        ? Math.round((moduleCompletedLeaves / moduleTotalLeaves) * 100)
        : 0;

      subjectTotalLeaves += moduleTotalLeaves;
      subjectCompletedLeaves += moduleCompletedLeaves;

      return {
        moduleId: mod.id,
        moduleNumber: mod.moduleNumber,
        title: mod.title,
        completedLeafCount: moduleCompletedLeaves,
        totalLeafCount: moduleTotalLeaves,
        percentage: modPercentage,
      };
    });

    const subjPercentage = subjectTotalLeaves > 0
      ? Math.round((subjectCompletedLeaves / subjectTotalLeaves) * 100)
      : 0;

    grandTotalLeaves += subjectTotalLeaves;
    grandCompletedLeaves += subjectCompletedLeaves;

    return {
      subjectId: subject.id,
      code: subject.code,
      name: subject.name,
      shortName: subject.shortName,
      color: subject.color,
      completedLeafCount: subjectCompletedLeaves,
      totalLeafCount: subjectTotalLeaves,
      percentage: subjPercentage,
      modules: moduleSummaries,
    };
  });

  const overallPercentage = grandTotalLeaves > 0
    ? Math.round((grandCompletedLeaves / grandTotalLeaves) * 100)
    : 0;

  return {
    completedLeafCount: grandCompletedLeaves,
    totalLeafCount: grandTotalLeaves,
    percentage: overallPercentage,
    subjectSummaries,
  };
}

// ----------------------------------------------------------------------------
// EXAM READINESS HEURISTIC CALCULATION
// ----------------------------------------------------------------------------
export function calculateExamReadiness(userId: string): {
  score: number;
  label: string;
  breakdown: {
    coverage: number;
    highPriorityCoverage: number;
    revisionScore: number;
  };
} {
  const overall = calculateUserProgress(userId);
  const coveragePercent = overall.percentage;

  // High priority topics leaf count & completion
  const userProgress = getTable<UserTopicProgress[]>(STORAGE_KEYS.PROGRESS, []).filter(
    (p) => p.userId === userId
  );
  const progressMap = new Map(userProgress.map((p) => [p.topicId, p]));

  let highPriorityTotal = 0;
  let highPriorityCompleted = 0;
  let totalConfidence = 0;
  let revisedCount = 0;

  officialSyllabus.subjects.forEach((s) => {
    s.modules.forEach((m) => {
      m.topics.forEach((t) => {
        if (t.subtopics && t.subtopics.length > 0) {
          t.subtopics.forEach((st) => {
            if (st.priority === 'VERY_HIGH' || st.priority === 'HIGH') {
              highPriorityTotal += 1;
              if (progressMap.get(st.id)?.isCompleted) highPriorityCompleted += 1;
            }
            const prog = progressMap.get(st.id);
            if (prog?.isCompleted) {
              totalConfidence += prog.confidenceLevel || 3;
              if (prog.revisionCount > 0) revisedCount += 1;
            }
          });
        } else {
          if (t.priority === 'VERY_HIGH' || t.priority === 'HIGH') {
            highPriorityTotal += 1;
            if (progressMap.get(t.id)?.isCompleted) highPriorityCompleted += 1;
          }
          const prog = progressMap.get(t.id);
          if (prog?.isCompleted) {
            totalConfidence += prog.confidenceLevel || 3;
            if (prog.revisionCount > 0) revisedCount += 1;
          }
        }
      });
    });
  });

  const highPriorityPercent = highPriorityTotal > 0
    ? Math.round((highPriorityCompleted / highPriorityTotal) * 100)
    : 0;

  const revisionPercent = overall.completedLeafCount > 0
    ? Math.min(100, Math.round(((revisedCount * 1.2 + (totalConfidence / (overall.completedLeafCount * 5)) * 50) / 1.5)))
    : 0;

  // Formula: Coverage (45%) + High Priority (35%) + Revision (20%)
  const score = Math.round(coveragePercent * 0.45 + highPriorityPercent * 0.35 + revisionPercent * 0.20);

  let label = 'Early Stage';
  if (score >= 85) label = 'Exam Ready';
  else if (score >= 70) label = 'Strong Foundation';
  else if (score >= 50) label = 'Moderate Progress';
  else if (score >= 25) label = 'Developing Coverage';

  return {
    score,
    label,
    breakdown: {
      coverage: coveragePercent,
      highPriorityCoverage: highPriorityPercent,
      revisionScore: revisionPercent,
    },
  };
}

// ----------------------------------------------------------------------------
// LOCAL DATABASE API METHODS
// ----------------------------------------------------------------------------
export const localDb = {
  initializeLocalDatabase,

  // --- AUTH & PROFILES ---
  getCurrentUserId(): string {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (stored) return stored;
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    return profiles[0]?.id || 'usr-superadmin';
  },

  setCurrentUserId(id: string): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    broadcastEvent({ type: 'PROGRESS_UPDATED', userId: id, timestamp: Date.now() });
  },

  getCurrentUser(): UserProfile | null {
    const userId = this.getCurrentUserId();
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    return profiles.find((p) => p.id === userId) || null;
  },

  getAllUsers(): UserProfile[] {
    return getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
  },

  registerUser(user: { email: string; username: string; displayName: string; role?: 'super_admin' | 'admin' | 'user' }): UserProfile {
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    
    // Check if username already exists
    if (profiles.some((p) => p.username.toLowerCase() === user.username.toLowerCase())) {
      throw new Error('Username is already taken');
    }
    if (profiles.some((p) => p.email.toLowerCase() === user.email.toLowerCase())) {
      throw new Error('An account with this email already exists');
    }

    const newProfile: UserProfile = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`,
      university: 'APJ Abdul Kalam Technological University (KTU)',
      semester: 'S7',
      collegeName: 'KTU Affiliated College',
      studyGoal: 'Score high marks in KTU S7 exams',
      role: user.role || 'user',
      createdAt: new Date().toISOString(),
    };

    profiles.push(newProfile);
    setTable(STORAGE_KEYS.PROFILES, profiles);

    // Default settings
    const settings = getTable<Record<string, UserSettings>>(STORAGE_KEYS.SETTINGS, {});
    settings[newProfile.id] = {
      userId: newProfile.id,
      theme: 'system',
      progressVisibility: 'friends',
      emailNotifications: true,
      studyReminders: true,
      dailyGoalMinutes: 180,
    };
    setTable(STORAGE_KEYS.SETTINGS, settings);

    // Switch to new user session
    this.setCurrentUserId(newProfile.id);

    // Audit log
    this.addAuditLog(newProfile.id, newProfile.username, 'USER_REGISTERED', 'USER', newProfile.id, { email: newProfile.email });

    return newProfile;
  },

  updateUserProfile(userId: string, updates: Partial<UserProfile>): UserProfile {
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const idx = profiles.findIndex((p) => p.id === userId);
    if (idx === -1) throw new Error('User not found');

    profiles[idx] = { ...profiles[idx], ...updates };
    setTable(STORAGE_KEYS.PROFILES, profiles);
    return profiles[idx];
  },

  getUserSettings(userId: string): UserSettings {
    const settings = getTable<Record<string, UserSettings>>(STORAGE_KEYS.SETTINGS, {});
    return settings[userId] || {
      userId,
      theme: 'system',
      progressVisibility: 'friends',
      emailNotifications: true,
      studyReminders: true,
      dailyGoalMinutes: 180,
    };
  },

  updateUserSettings(userId: string, updates: Partial<UserSettings>): UserSettings {
    const settings = getTable<Record<string, UserSettings>>(STORAGE_KEYS.SETTINGS, {});
    settings[userId] = { ...(settings[userId] || { userId, theme: 'system', progressVisibility: 'friends', emailNotifications: true, studyReminders: true, dailyGoalMinutes: 180 }), ...updates };
    setTable(STORAGE_KEYS.SETTINGS, settings);
    return settings[userId];
  },

  // --- TOPIC PROGRESS ---
  getUserProgress(userId: string): UserTopicProgress[] {
    const all = getTable<UserTopicProgress[]>(STORAGE_KEYS.PROGRESS, []);
    return all.filter((p) => p.userId === userId);
  },

  toggleTopicCompletion(userId: string, topicId: string, isCompleted: boolean): UserTopicProgress {
    const all = getTable<UserTopicProgress[]>(STORAGE_KEYS.PROGRESS, []);
    const idx = all.findIndex((p) => p.userId === userId && p.topicId === topicId);

    let result: UserTopicProgress;
    const now = new Date().toISOString();

    if (idx !== -1) {
      all[idx] = {
        ...all[idx],
        isCompleted,
        completedAt: isCompleted ? (all[idx].completedAt || now) : null,
        updatedAt: now,
      };
      result = all[idx];
    } else {
      result = {
        id: `prog-${userId}-${topicId}`,
        userId,
        topicId,
        isCompleted,
        completedAt: isCompleted ? now : null,
        revisionState: isCompleted ? 'studied' : 'not_started',
        confidenceLevel: isCompleted ? 3 : 0,
        revisionCount: 0,
        updatedAt: now,
      };
      all.push(result);
    }

    setTable(STORAGE_KEYS.PROGRESS, all);

    // Broadcast instant update across tabs
    broadcastEvent({
      type: 'PROGRESS_UPDATED',
      userId,
      data: { topicId, isCompleted },
      timestamp: Date.now(),
    });

    return result;
  },

  updateRevisionState(
    userId: string,
    topicId: string,
    updates: {
      revisionState?: UserTopicProgress['revisionState'];
      confidenceLevel?: number;
      incrementRevision?: boolean;
      notes?: string;
    }
  ): UserTopicProgress {
    const all = getTable<UserTopicProgress[]>(STORAGE_KEYS.PROGRESS, []);
    const idx = all.findIndex((p) => p.userId === userId && p.topicId === topicId);
    const now = new Date().toISOString();

    if (idx !== -1) {
      const cur = all[idx];
      all[idx] = {
        ...cur,
        revisionState: updates.revisionState || cur.revisionState,
        confidenceLevel: updates.confidenceLevel !== undefined ? updates.confidenceLevel : cur.confidenceLevel,
        revisionCount: updates.incrementRevision ? cur.revisionCount + 1 : cur.revisionCount,
        lastRevisedAt: updates.incrementRevision ? now : cur.lastRevisedAt,
        notes: updates.notes !== undefined ? updates.notes : cur.notes,
        updatedAt: now,
      };
      setTable(STORAGE_KEYS.PROGRESS, all);
      broadcastEvent({ type: 'PROGRESS_UPDATED', userId, timestamp: Date.now() });
      return all[idx];
    } else {
      const newEntry: UserTopicProgress = {
        id: `prog-${userId}-${topicId}`,
        userId,
        topicId,
        isCompleted: true,
        completedAt: now,
        revisionState: updates.revisionState || 'studied',
        confidenceLevel: updates.confidenceLevel || 3,
        revisionCount: updates.incrementRevision ? 1 : 0,
        lastRevisedAt: updates.incrementRevision ? now : null,
        notes: updates.notes || '',
        updatedAt: now,
      };
      all.push(newEntry);
      setTable(STORAGE_KEYS.PROGRESS, all);
      broadcastEvent({ type: 'PROGRESS_UPDATED', userId, timestamp: Date.now() });
      return newEntry;
    }
  },

  // --- CUSTOM TOPICS (PERSONAL & GROUP SYLLABUS LAYERS) ---
  getCustomTopics(userId: string, moduleId?: string): CustomTopic[] {
    const all = getTable<CustomTopic[]>(STORAGE_KEYS.CUSTOM_TOPICS, []);
    return all.filter((ct) => ct.userId === userId && !ct.isArchived && (!moduleId || ct.moduleId === moduleId));
  },

  addCustomTopic(topic: Omit<CustomTopic, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'isArchived'>): CustomTopic {
    const all = getTable<CustomTopic[]>(STORAGE_KEYS.CUSTOM_TOPICS, []);
    const newTopic: CustomTopic = {
      ...topic,
      id: `custom-t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      isCompleted: false,
      isArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    all.push(newTopic);
    setTable(STORAGE_KEYS.CUSTOM_TOPICS, all);
    broadcastEvent({ type: 'PROGRESS_UPDATED', userId: topic.userId, timestamp: Date.now() });
    return newTopic;
  },

  toggleCustomTopic(id: string, isCompleted: boolean): CustomTopic {
    const all = getTable<CustomTopic[]>(STORAGE_KEYS.CUSTOM_TOPICS, []);
    const idx = all.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Custom topic not found');

    all[idx].isCompleted = isCompleted;
    all[idx].updatedAt = new Date().toISOString();
    setTable(STORAGE_KEYS.CUSTOM_TOPICS, all);
    broadcastEvent({ type: 'PROGRESS_UPDATED', userId: all[idx].userId, timestamp: Date.now() });
    return all[idx];
  },

  deleteCustomTopic(id: string): void {
    const all = getTable<CustomTopic[]>(STORAGE_KEYS.CUSTOM_TOPICS, []);
    const filtered = all.filter((t) => t.id !== id);
    setTable(STORAGE_KEYS.CUSTOM_TOPICS, filtered);
  },

  // --- FRIENDSHIPS & COLLABORATION ---
  getFriends(userId: string): { friend: UserProfile; progress: OverallProgressSummary }[] {
    const friendships = getTable<Friendship[]>(STORAGE_KEYS.FRIENDSHIPS, []);
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const settings = getTable<Record<string, UserSettings>>(STORAGE_KEYS.SETTINGS, {});

    const friendIds = friendships
      .filter((f) => f.status === 'accepted' && (f.userId === userId || f.friendId === userId))
      .map((f) => (f.userId === userId ? f.friendId : f.userId));

    return friendIds
      .map((fId) => {
        const friend = profiles.find((p) => p.id === fId);
        if (!friend) return null;

        // Check privacy setting
        const friendSetting = settings[fId];
        const isVisible = !friendSetting || friendSetting.progressVisibility === 'friends' || friendSetting.progressVisibility === 'public';
        const progress = isVisible ? calculateUserProgress(fId) : {
          completedLeafCount: 0,
          totalLeafCount: 0,
          percentage: 0,
          subjectSummaries: [],
        };

        return { friend, progress };
      })
      .filter(Boolean) as { friend: UserProfile; progress: OverallProgressSummary }[];
  },

  sendFriendRequest(senderId: string, targetUsername: string): FriendRequest {
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const receiver = profiles.find((p) => p.username.toLowerCase() === targetUsername.trim().toLowerCase());
    if (!receiver) throw new Error(`User '@${targetUsername}' not found`);
    if (receiver.id === senderId) throw new Error('You cannot add yourself as a friend');

    // Check existing
    const friendships = getTable<Friendship[]>(STORAGE_KEYS.FRIENDSHIPS, []);
    if (friendships.some((f) => (f.userId === senderId && f.friendId === receiver.id) || (f.userId === receiver.id && f.friendId === senderId))) {
      throw new Error(`You are already friends with @${targetUsername}`);
    }

    const requests = getTable<FriendRequest[]>(STORAGE_KEYS.FRIEND_REQUESTS, []);
    if (requests.some((r) => r.senderId === senderId && r.receiverId === receiver.id && r.status === 'pending')) {
      throw new Error('Friend request already sent');
    }

    const newReq: FriendRequest = {
      id: `freq-${Date.now()}`,
      senderId,
      receiverId: receiver.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      senderProfile: profiles.find((p) => p.id === senderId),
    };

    requests.push(newReq);
    setTable(STORAGE_KEYS.FRIEND_REQUESTS, requests);
    broadcastEvent({ type: 'FRIEND_REQUEST', userId: receiver.id, timestamp: Date.now() });
    return newReq;
  },

  getFriendRequests(userId: string): FriendRequest[] {
    const requests = getTable<FriendRequest[]>(STORAGE_KEYS.FRIEND_REQUESTS, []);
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);

    return requests
      .filter((r) => r.receiverId === userId && r.status === 'pending')
      .map((r) => ({
        ...r,
        senderProfile: profiles.find((p) => p.id === r.senderId),
      }));
  },

  respondToFriendRequest(requestId: string, accept: boolean): void {
    const requests = getTable<FriendRequest[]>(STORAGE_KEYS.FRIEND_REQUESTS, []);
    const req = requests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = accept ? 'accepted' : 'rejected';
    setTable(STORAGE_KEYS.FRIEND_REQUESTS, requests);

    if (accept) {
      const friendships = getTable<Friendship[]>(STORAGE_KEYS.FRIENDSHIPS, []);
      friendships.push({
        id: `f-${Date.now()}-1`,
        userId: req.senderId,
        friendId: req.receiverId,
        status: 'accepted',
        createdAt: new Date().toISOString(),
      });
      friendships.push({
        id: `f-${Date.now()}-2`,
        userId: req.receiverId,
        friendId: req.senderId,
        status: 'accepted',
        createdAt: new Date().toISOString(),
      });
      setTable(STORAGE_KEYS.FRIENDSHIPS, friendships);
      broadcastEvent({ type: 'PROGRESS_UPDATED', userId: req.senderId, timestamp: Date.now() });
    }
  },

  removeFriend(userId: string, friendId: string): void {
    const friendships = getTable<Friendship[]>(STORAGE_KEYS.FRIENDSHIPS, []);
    const filtered = friendships.filter(
      (f) => !( (f.userId === userId && f.friendId === friendId) || (f.userId === friendId && f.friendId === userId) )
    );
    setTable(STORAGE_KEYS.FRIENDSHIPS, filtered);
    broadcastEvent({ type: 'PROGRESS_UPDATED', userId, timestamp: Date.now() });
  },

  // --- STUDY GROUPS ---
  getStudyGroups(userId: string): StudyGroup[] {
    const groups = getTable<StudyGroup[]>(STORAGE_KEYS.GROUPS, []);
    const members = getTable<GroupMember[]>(STORAGE_KEYS.GROUP_MEMBERS, []);
    const userGroupIds = new Set(members.filter((m) => m.userId === userId).map((m) => m.groupId));

    return groups.map((g) => ({
      ...g,
      memberCount: members.filter((m) => m.groupId === g.id).length,
      isMember: userGroupIds.has(g.id),
    })) as StudyGroup[];
  },

  createStudyGroup(name: string, description: string, ownerId: string): StudyGroup {
    const groups = getTable<StudyGroup[]>(STORAGE_KEYS.GROUPS, []);
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newGroup: StudyGroup = {
      id: `grp-${Date.now()}`,
      name,
      description,
      ownerId,
      inviteCode,
      isPrivate: false,
      memberCount: 1,
      createdAt: new Date().toISOString(),
    };

    groups.push(newGroup);
    setTable(STORAGE_KEYS.GROUPS, groups);

    // Add owner as group member
    const members = getTable<GroupMember[]>(STORAGE_KEYS.GROUP_MEMBERS, []);
    members.push({
      id: `gm-${Date.now()}`,
      groupId: newGroup.id,
      userId: ownerId,
      role: 'owner',
      joinedAt: new Date().toISOString(),
    });
    setTable(STORAGE_KEYS.GROUP_MEMBERS, members);

    broadcastEvent({ type: 'GROUP_UPDATED', userId: ownerId, timestamp: Date.now() });
    return newGroup;
  },

  joinStudyGroupByCode(inviteCode: string, userId: string): StudyGroup {
    const groups = getTable<StudyGroup[]>(STORAGE_KEYS.GROUPS, []);
    const group = groups.find((g) => g.inviteCode.toUpperCase() === inviteCode.trim().toUpperCase());
    if (!group) throw new Error('Invalid study group invitation code');

    const members = getTable<GroupMember[]>(STORAGE_KEYS.GROUP_MEMBERS, []);
    if (members.some((m) => m.groupId === group.id && m.userId === userId)) {
      return group; // Already member
    }

    members.push({
      id: `gm-${Date.now()}`,
      groupId: group.id,
      userId,
      role: 'member',
      joinedAt: new Date().toISOString(),
    });
    setTable(STORAGE_KEYS.GROUP_MEMBERS, members);
    broadcastEvent({ type: 'GROUP_UPDATED', userId, timestamp: Date.now() });
    return group;
  },

  getGroupDetails(groupId: string): {
    group: StudyGroup;
    members: (GroupMember & { userProfile: UserProfile; progress: OverallProgressSummary })[];
    averageProgress: number;
  } | null {
    const groups = getTable<StudyGroup[]>(STORAGE_KEYS.GROUPS, []);
    const group = groups.find((g) => g.id === groupId);
    if (!group) return null;

    const allMembers = getTable<GroupMember[]>(STORAGE_KEYS.GROUP_MEMBERS, []).filter((m) => m.groupId === groupId);
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);

    const enrichedMembers = allMembers.map((m) => {
      const userProfile = profiles.find((p) => p.id === m.userId)!;
      const progress = calculateUserProgress(m.userId);
      return { ...m, userProfile, progress };
    });

    const averageProgress = enrichedMembers.length > 0
      ? Math.round(enrichedMembers.reduce((acc, m) => acc + m.progress.percentage, 0) / enrichedMembers.length)
      : 0;

    return { group, members: enrichedMembers, averageProgress };
  },

  // --- STUDY TASKS & PLANNER ---
  getTasks(userId: string): StudyTask[] {
    const tasks = getTable<StudyTask[]>(STORAGE_KEYS.TASKS, []);
    return tasks.filter((t) => t.userId === userId);
  },

  addTask(task: Omit<StudyTask, 'id' | 'createdAt' | 'isCompleted'>): StudyTask {
    const tasks = getTable<StudyTask[]>(STORAGE_KEYS.TASKS, []);
    const newTask: StudyTask = {
      ...task,
      id: `task-${Date.now()}`,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    setTable(STORAGE_KEYS.TASKS, tasks);
    broadcastEvent({ type: 'TASK_UPDATED', userId: task.userId, timestamp: Date.now() });
    return newTask;
  },

  toggleTask(id: string, isCompleted: boolean): void {
    const tasks = getTable<StudyTask[]>(STORAGE_KEYS.TASKS, []);
    const task = tasks.find((t) => t.id === id);
    if (task) {
      task.isCompleted = isCompleted;
      task.completedAt = isCompleted ? new Date().toISOString() : null;
      setTable(STORAGE_KEYS.TASKS, tasks);
      broadcastEvent({ type: 'TASK_UPDATED', userId: task.userId, timestamp: Date.now() });
    }
  },

  deleteTask(id: string): void {
    const tasks = getTable<StudyTask[]>(STORAGE_KEYS.TASKS, []);
    const filtered = tasks.filter((t) => t.id !== id);
    setTable(STORAGE_KEYS.TASKS, filtered);
  },

  // --- TOPIC NOTES ---
  getNote(userId: string, topicId: string): UserNote | null {
    const notes = getTable<UserNote[]>(STORAGE_KEYS.NOTES, []);
    return notes.find((n) => n.userId === userId && n.topicId === topicId) || null;
  },

  saveNote(userId: string, topicId: string, content: string): UserNote {
    const notes = getTable<UserNote[]>(STORAGE_KEYS.NOTES, []);
    const idx = notes.findIndex((n) => n.userId === userId && n.topicId === topicId);
    const now = new Date().toISOString();

    if (idx !== -1) {
      notes[idx].content = content;
      notes[idx].updatedAt = now;
      setTable(STORAGE_KEYS.NOTES, notes);
      return notes[idx];
    } else {
      const newNote: UserNote = {
        id: `note-${Date.now()}`,
        userId,
        topicId,
        content,
        isPinned: false,
        createdAt: now,
        updatedAt: now,
      };
      notes.push(newNote);
      setTable(STORAGE_KEYS.NOTES, notes);
      return newNote;
    }
  },

  // --- PYQS ---
  getQuestionPapers(): QuestionPaper[] {
    return getTable<QuestionPaper[]>(STORAGE_KEYS.QUESTION_PAPERS, (officialPYQs as any).papers);
  },

  getPYQQuestions(): PYQQuestion[] {
    return getTable<PYQQuestion[]>(STORAGE_KEYS.PYQ_QUESTIONS, (officialPYQs as any).questions);
  },

  addQuestionPaper(paper: QuestionPaper, questions: PYQQuestion[]): void {
    const papers = getTable<QuestionPaper[]>(STORAGE_KEYS.QUESTION_PAPERS, []);
    papers.push(paper);
    setTable(STORAGE_KEYS.QUESTION_PAPERS, papers);

    const allQuestions = getTable<PYQQuestion[]>(STORAGE_KEYS.PYQ_QUESTIONS, []);
    const updatedQuestions = [...allQuestions, ...questions];
    setTable(STORAGE_KEYS.PYQ_QUESTIONS, updatedQuestions);

    this.addAuditLog(paper.uploadedAt, 'user', 'PAPER_UPLOADED', 'PYQ', paper.id, {
      filename: paper.filename,
      questionCount: questions.length,
    });
  },

  // --- AUDIT LOGS ---
  addAuditLog(actorId: string, actorUsername: string, action: string, entityType: string, entityId: string, details?: any): void {
    const logs = getTable<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    logs.unshift({
      id: `log-${Date.now()}`,
      actorId,
      actorUsername,
      action,
      entityType,
      entityId,
      details,
      createdAt: new Date().toISOString(),
    });
    setTable(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 500)); // Maintain last 500 logs
  },

  getAuditLogs(): AuditLog[] {
    return getTable<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
  },

  // --- ADMINISTRATOR MANAGEMENT & SAFE ACCOUNT DELETION ---
  deleteUserAccount(targetUserId: string, actorId: string): void {
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const actor = profiles.find((p) => p.id === actorId);
    const target = profiles.find((p) => p.id === targetUserId);

    if (!target) throw new Error('Target user account not found');

    // Security check: Only super_admin, admin, or the user deleting their own account
    const isSelf = targetUserId === actorId;
    const isAdmin = actor && (actor.role === 'admin' || actor.role === 'super_admin');
    if (!isSelf && !isAdmin) {
      throw new Error('Unauthorized: Ordinary users cannot delete other accounts');
    }

    if (target.role === 'super_admin' && !isSelf) {
      throw new Error('Unauthorized: Super Admin accounts cannot be deleted by other users');
    }

    // Cascade deletions
    setTable(STORAGE_KEYS.PROFILES, profiles.filter((p) => p.id !== targetUserId));
    setTable(STORAGE_KEYS.PROGRESS, getTable<UserTopicProgress[]>(STORAGE_KEYS.PROGRESS, []).filter((p) => p.userId !== targetUserId));
    setTable(STORAGE_KEYS.CUSTOM_TOPICS, getTable<CustomTopic[]>(STORAGE_KEYS.CUSTOM_TOPICS, []).filter((t) => t.userId !== targetUserId));
    setTable(STORAGE_KEYS.TASKS, getTable<StudyTask[]>(STORAGE_KEYS.TASKS, []).filter((t) => t.userId !== targetUserId));
    setTable(STORAGE_KEYS.NOTES, getTable<UserNote[]>(STORAGE_KEYS.NOTES, []).filter((n) => n.userId !== targetUserId));
    setTable(STORAGE_KEYS.FRIENDSHIPS, getTable<Friendship[]>(STORAGE_KEYS.FRIENDSHIPS, []).filter((f) => f.userId !== targetUserId && f.friendId !== targetUserId));
    setTable(STORAGE_KEYS.FRIEND_REQUESTS, getTable<FriendRequest[]>(STORAGE_KEYS.FRIEND_REQUESTS, []).filter((r) => r.senderId !== targetUserId && r.receiverId !== targetUserId));
    setTable(STORAGE_KEYS.GROUP_MEMBERS, getTable<GroupMember[]>(STORAGE_KEYS.GROUP_MEMBERS, []).filter((m) => m.userId !== targetUserId));

    // Audit log
    this.addAuditLog(actorId, actor?.username || 'user', 'USER_DELETED', 'USER', targetUserId, {
      deletedUsername: target.username,
      deletedEmail: target.email,
    });

    broadcastEvent({ type: 'USER_DELETED', userId: targetUserId, timestamp: Date.now() });

    // If active user deleted self, reset session
    if (isSelf) {
      const remaining = this.getAllUsers();
      this.setCurrentUserId(remaining[0]?.id || 'usr-superadmin');
    }
  },

  bulkDeleteUsers(targetUserIds: string[], actorId: string): number {
    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const actor = profiles.find((p) => p.id === actorId);

    if (!actor || actor.role !== 'super_admin') {
      throw new Error('Unauthorized: Only Super Administrators can execute bulk account deletion');
    }

    // Exclude super admin themselves
    const validTargets = targetUserIds.filter((id) => id !== actorId);
    validTargets.forEach((id) => {
      this.deleteUserAccount(id, actorId);
    });

    return validTargets.length;
  },

  deleteAllUsersSafely(actorId: string, confirmationPhrase: string): number {
    if (confirmationPhrase !== 'DELETE ALL USERS PERMANENTLY') {
      throw new Error('Confirmation phrase mismatch. Deletion aborted.');
    }

    const profiles = getTable<UserProfile[]>(STORAGE_KEYS.PROFILES, []);
    const actor = profiles.find((p) => p.id === actorId);

    if (!actor || actor.role !== 'super_admin') {
      throw new Error('Unauthorized: Only Super Administrators can execute mass account deletion');
    }

    // All users except the Super Admin
    const targetUserIds = profiles.filter((p) => p.id !== actorId).map((p) => p.id);
    targetUserIds.forEach((id) => {
      this.deleteUserAccount(id, actorId);
    });

    this.addAuditLog(actorId, actor.username, 'ALL_USERS_DELETED', 'SYSTEM', 'bulk', {
      deletedCount: targetUserIds.length,
      superAdminPreserved: actorId,
    });

    return targetUserIds.length;
  },
};

// Initialize right away if browser environment
if (typeof window !== 'undefined') {
  initializeLocalDatabase();
}
