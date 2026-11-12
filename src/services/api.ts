// ==============================================================================
// SYLLABUSSYNC UNIFIED API LAYER
// ==============================================================================

import { isSupabaseConfigured, supabase } from './supabase';
import { localDb, calculateUserProgress, calculateExamReadiness } from './localDatabase';
import rawSyllabus from '../data/officialSyllabus.json';
import {
  UserProfile,
  UserSettings,
  UserTopicProgress,
  CustomTopic,
  StudyTask,
  FriendRequest,
  StudyGroup,
  GroupMember,
  AuditLog,
  QuestionPaper,
  PYQQuestion,
  OverallProgressSummary,
  Subject,
  Module,
  SyllabusData
} from '../types';

const syllabusData = rawSyllabus as unknown as SyllabusData;

export const api = {
  isCloudConnected: isSupabaseConfigured,

  // --- AUTH & PROFILES ---
  auth: {
    async getCurrentUser(): Promise<UserProfile | null> {
      if (isSupabaseConfigured && supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) return profile as UserProfile;
      }
      return localDb.getCurrentUser();
    },

    async signIn(usernameOrEmail: string, _password?: string): Promise<UserProfile> {
      if (isSupabaseConfigured && supabase && _password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: usernameOrEmail,
          password: _password,
        });
        if (error) throw error;
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        return profile as UserProfile;
      }

      const allUsers = localDb.getAllUsers();
      const user = allUsers.find(
        (u) =>
          u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
          u.email.toLowerCase() === usernameOrEmail.toLowerCase()
      );
      if (!user) {
        throw new Error(`Account '${usernameOrEmail}' not found. Please register or select an account.`);
      }
      localDb.setCurrentUserId(user.id);
      return user;
    },

    async register(data: { email: string; username: string; displayName: string; password?: string; role?: 'super_admin' | 'admin' | 'user' }): Promise<UserProfile> {
      if (isSupabaseConfigured && supabase && data.password) {
        const { data: authData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              username: data.username,
              display_name: data.displayName,
            },
          },
        });
        if (error) throw error;
        if (authData.user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
          if (profile) return profile as UserProfile;
        }
      }

      return localDb.registerUser(data);
    },

    async signOut(): Promise<void> {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      localDb.setCurrentUserId('usr-arif');
    },

    async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
        if (error) throw error;
        return data as UserProfile;
      }
      return localDb.updateUserProfile(userId, updates);
    },

    async getSettings(userId: string): Promise<UserSettings> {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.from('user_settings').select('*').eq('user_id', userId).single();
        if (data) return data as UserSettings;
      }
      return localDb.getUserSettings(userId);
    },

    async updateSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('user_settings').upsert({ user_id: userId, ...updates }).select().single();
        if (error) throw error;
        return data as UserSettings;
      }
      return localDb.updateUserSettings(userId, updates);
    },
  },

  // --- SYLLABUS READ ---
  syllabus: {
    getOfficialSyllabus(): SyllabusData {
      return syllabusData;
    },

    getSubject(subjectId: string): Subject | undefined {
      return syllabusData.subjects.find((s) => s.id === subjectId || s.code.toLowerCase() === subjectId.toLowerCase());
    },

    getModule(subjectId: string, moduleId: string): { subject: Subject; module: Module } | null {
      const subject = this.getSubject(subjectId);
      if (!subject) return null;
      const mod = subject.modules.find((m) => m.id === moduleId || m.moduleNumber.toString() === moduleId);
      if (!mod) return null;
      return { subject, module: mod };
    },
  },

  // --- PROGRESS ---
  progress: {
    getUserProgress(userId: string): UserTopicProgress[] {
      return localDb.getUserProgress(userId);
    },

    async toggleTopic(userId: string, topicId: string, isCompleted: boolean): Promise<UserTopicProgress> {
      if (isSupabaseConfigured && supabase) {
        await supabase
          .from('user_topic_progress')
          .upsert({
            user_id: userId,
            topic_id: topicId,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          });
      }
      return localDb.toggleTopicCompletion(userId, topicId, isCompleted);
    },

    async updateRevision(
      userId: string,
      topicId: string,
      updates: {
        revisionState?: UserTopicProgress['revisionState'];
        confidenceLevel?: number;
        incrementRevision?: boolean;
        notes?: string;
      }
    ): Promise<UserTopicProgress> {
      return localDb.updateRevisionState(userId, topicId, updates);
    },

    calculateOverall(userId: string): OverallProgressSummary {
      return calculateUserProgress(userId);
    },

    calculateReadiness(userId: string) {
      return calculateExamReadiness(userId);
    },
  },

  // --- CUSTOM TOPICS ---
  customTopics: {
    getCustomTopics(userId: string, moduleId?: string): CustomTopic[] {
      return localDb.getCustomTopics(userId, moduleId);
    },

    async addCustomTopic(topic: Omit<CustomTopic, 'id' | 'createdAt' | 'updatedAt' | 'isCompleted' | 'isArchived'>): Promise<CustomTopic> {
      return localDb.addCustomTopic(topic);
    },

    async toggleCustomTopic(id: string, isCompleted: boolean): Promise<CustomTopic> {
      return localDb.toggleCustomTopic(id, isCompleted);
    },

    async deleteCustomTopic(id: string): Promise<void> {
      localDb.deleteCustomTopic(id);
    },
  },

  // --- FRIENDS & COLLABORATION ---
  friends: {
    getFriends(userId: string): { friend: UserProfile; progress: OverallProgressSummary }[] {
      return localDb.getFriends(userId);
    },

    async sendRequest(senderId: string, targetUsername: string): Promise<FriendRequest> {
      return localDb.sendFriendRequest(senderId, targetUsername);
    },

    getRequests(userId: string): FriendRequest[] {
      return localDb.getFriendRequests(userId);
    },

    async respondToRequest(requestId: string, accept: boolean): Promise<void> {
      localDb.respondToFriendRequest(requestId, accept);
    },

    async removeFriend(userId: string, friendId: string): Promise<void> {
      localDb.removeFriend(userId, friendId);
    },
  },

  // --- STUDY GROUPS ---
  groups: {
    getGroups(userId: string): StudyGroup[] {
      return localDb.getStudyGroups(userId);
    },

    async createGroup(name: string, description: string, ownerId: string): Promise<StudyGroup> {
      return localDb.createStudyGroup(name, description, ownerId);
    },

    async joinByCode(inviteCode: string, userId: string): Promise<StudyGroup> {
      return localDb.joinStudyGroupByCode(inviteCode, userId);
    },

    getGroupDetails(groupId: string) {
      return localDb.getGroupDetails(groupId);
    },
  },

  // --- STUDY PLANNER ---
  planner: {
    getTasks(userId: string): StudyTask[] {
      return localDb.getTasks(userId);
    },

    async addTask(task: Omit<StudyTask, 'id' | 'createdAt' | 'isCompleted'>): Promise<StudyTask> {
      return localDb.addTask(task);
    },

    async toggleTask(id: string, isCompleted: boolean): Promise<void> {
      localDb.toggleTask(id, isCompleted);
    },

    async deleteTask(id: string): Promise<void> {
      localDb.deleteTask(id);
    },
  },

  // --- NOTES ---
  notes: {
    async getNote(userId: string, topicId: string) {
      return localDb.getNote(userId, topicId);
    },

    async saveNote(userId: string, topicId: string, content: string) {
      return localDb.saveNote(userId, topicId, content);
    },
  },

  // --- PYQS ---
  pyq: {
    getPapers(): QuestionPaper[] {
      return localDb.getQuestionPapers();
    },

    getQuestions(): PYQQuestion[] {
      return localDb.getPYQQuestions();
    },

    uploadPaper(paper: QuestionPaper, questions: PYQQuestion[]): void {
      localDb.addQuestionPaper(paper, questions);
    },
  },

  // --- ADMINISTRATION & AUDIT ---
  admin: {
    getAllUsers(): UserProfile[] {
      return localDb.getAllUsers();
    },

    async deleteUser(targetUserId: string, actorId: string): Promise<void> {
      localDb.deleteUserAccount(targetUserId, actorId);
    },

    async bulkDeleteUsers(targetUserIds: string[], actorId: string): Promise<number> {
      return localDb.bulkDeleteUsers(targetUserIds, actorId);
    },

    async deleteAllUsers(actorId: string, confirmationPhrase: string): Promise<number> {
      return localDb.deleteAllUsersSafely(actorId, confirmationPhrase);
    },

    getAuditLogs(): AuditLog[] {
      return localDb.getAuditLogs();
    },
  },
};
