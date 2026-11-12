// ==============================================================================
// SYLLABUSSYNC UNIFIED API LAYER
// ==============================================================================

import { isSupabaseConfigured, supabase } from './supabase';
import { localDb, calculateUserProgress, calculateExamReadiness } from './localDatabase';
import { hashPassword, verifyPasswordHash } from './crypto';
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
  get isCloudConnected(): boolean {
    return isSupabaseConfigured;
  },

  // --- AUTH & PROFILES ---
  auth: {
    async getCurrentUser(): Promise<UserProfile | null> {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
            if (profile) return profile as UserProfile;
          }
        } catch (e) {
          console.warn('[Supabase Auth Fallback]', e);
        }
      }
      return localDb.getCurrentUser();
    },

    async signIn(usernameOrEmail: string, password?: string): Promise<UserProfile> {
      let user = localDb.getAllUsers().find(
        (u) =>
          u.id === usernameOrEmail ||
          u.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
          u.email.toLowerCase() === usernameOrEmail.toLowerCase()
      );

      if (!user && isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .or(`username.ilike.${usernameOrEmail},email.ilike.${usernameOrEmail},id.eq.${usernameOrEmail}`)
            .limit(1)
            .single();
          if (data) {
            let pwHash = data.password_hash;
            let userBio = data.bio;
            if (!pwHash && userBio && userBio.startsWith('__hash:')) {
              pwHash = userBio.replace('__hash:', '');
              userBio = '';
            }

            user = {
              id: data.id,
              email: data.email || '',
              username: data.username,
              displayName: data.display_name,
              avatarUrl: data.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${data.username}`,
              bio: userBio,
              university: data.university,
              semester: data.semester,
              collegeName: data.college_name,
              studyGoal: data.study_goal,
              role: data.role || 'user',
              createdAt: data.created_at,
              passwordHash: pwHash,
            };
            localDb.syncProfileFromCloud(user);
          }
        } catch (e) {}
      }

      if (!user) {
        throw new Error(`Account '${usernameOrEmail}' not found. Please register or select an account.`);
      }

      // Password verification
      if (user.passwordHash) {
        if (!password) {
          throw new Error('This account requires a password to edit. Please enter your password.');
        }
        const isValid = await verifyPasswordHash(password, user.passwordHash);
        if (!isValid) {
          throw new Error('Incorrect password. Please try again.');
        }
      }

      localDb.setCurrentUserId(user.id);
      localDb.setAuthenticatedUserId(user.id);
      return user;
    },

    async register(data: { email: string; username: string; displayName: string; password?: string; role?: 'super_admin' | 'admin' | 'user' }): Promise<UserProfile> {
      let passwordHash: string | undefined;
      if (data.password) {
        passwordHash = await hashPassword(data.password);
      }

      const localUser = localDb.registerUser({
        ...data,
        passwordHash,
      });

      if (isSupabaseConfigured && supabase) {
        try {
          if (data.password) {
            try {
              await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                  data: {
                    username: data.username,
                    display_name: data.displayName,
                  },
                },
              });
            } catch (e) {}
          }

          // Always upsert to public.profiles table so all devices see this student
          const profilePayload: any = {
            id: localUser.id,
            email: localUser.email,
            username: localUser.username,
            display_name: localUser.displayName,
            avatar_url: localUser.avatarUrl,
            university: localUser.university,
            semester: localUser.semester,
            college_name: localUser.collegeName,
            study_goal: localUser.studyGoal,
            role: localUser.role,
            created_at: localUser.createdAt,
            updated_at: new Date().toISOString(),
          };

          if (passwordHash) {
            profilePayload.password_hash = passwordHash;
          }

          let res = await supabase.from('profiles').upsert(profilePayload);
          if (res.error && res.error.code === 'PGRST204') {
            // Column password_hash not in schema cache, fallback to storing in bio
            delete profilePayload.password_hash;
            if (passwordHash) {
              profilePayload.bio = `__hash:${passwordHash}`;
            }
            res = await supabase.from('profiles').upsert(profilePayload);
          }
          if (res.error) {
            console.error('[Supabase Register Error]', res.error);
          }
        } catch (e) {
          console.warn('[Supabase Register Fallback]', e);
        }
      }

      return localUser;
    },

    async verifyUserPassword(userId: string, passwordAttempt: string): Promise<boolean> {
      const user = localDb.getAllUsers().find((u) => u.id === userId);
      if (!user) return false;
      if (!user.passwordHash) {
        // Legacy account: set this as password
        const newHash = await hashPassword(passwordAttempt);
        user.passwordHash = newHash;
        localDb.syncProfileFromCloud(user);
        localDb.setAuthenticatedUserId(userId);
        if (isSupabaseConfigured && supabase) {
          supabase.from('profiles').update({ password_hash: newHash }).eq('id', userId);
        }
        return true;
      }
      const isValid = await verifyPasswordHash(passwordAttempt, user.passwordHash);
      if (isValid) {
        localDb.setAuthenticatedUserId(userId);
      }
      return isValid;
    },

    async signOut(): Promise<void> {
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.auth.signOut();
        } catch (e) {
          console.warn('[Supabase SignOut Fallback]', e);
        }
      }
      localDb.setAuthenticatedUserId(null);
    },

    async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('profiles').update(updates).eq('id', userId).select().single();
          if (!error && data) return data as UserProfile;
        } catch (e) {
          console.warn('[Supabase updateProfile fallback]', e);
        }
      }
      return localDb.updateUserProfile(userId, updates);
    },

    async getSettings(userId: string): Promise<UserSettings> {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.from('user_settings').select('*').eq('user_id', userId).single();
          if (data) return data as UserSettings;
        } catch (e) {
          console.warn('[Supabase getSettings fallback]', e);
        }
      }
      return localDb.getUserSettings(userId);
    },

    async updateSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('user_settings').upsert({ user_id: userId, ...updates }).select().single();
          if (!error && data) return data as UserSettings;
        } catch (e) {
          console.warn('[Supabase updateSettings fallback]', e);
        }
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
    async getUserProgress(userId: string): Promise<UserTopicProgress[]> {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('user_topic_progress')
            .select('*')
            .eq('user_id', userId);
          if (!error && data) {
            const mapped: UserTopicProgress[] = data.map((d: any) => ({
              id: d.id || `prog-${userId}-${d.topic_id}`,
              userId: d.user_id,
              topicId: d.topic_id,
              isCompleted: Boolean(d.is_completed),
              completedAt: d.completed_at,
              revisionState: d.revision_state || 'not_started',
              confidenceLevel: d.confidence_level || 0,
              revisionCount: d.revision_count || 0,
              lastRevisedAt: d.last_revised_at,
              notes: d.notes,
              updatedAt: d.updated_at,
            }));
            // Cache downloaded progress into localDb
            mapped.forEach((item) => {
              localDb.toggleTopicCompletion(userId, item.topicId, item.isCompleted);
            });
            return mapped;
          }
        } catch (e) {
          console.warn('[Supabase getUserProgress Fallback]', e);
        }
      }
      return localDb.getUserProgress(userId);
    },

    async toggleTopic(userId: string, topicId: string, isCompleted: boolean): Promise<UserTopicProgress> {
      const localResult = localDb.toggleTopicCompletion(userId, topicId, isCompleted);
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase
            .from('user_topic_progress')
            .upsert(
              {
                user_id: userId,
                topic_id: topicId,
                is_completed: isCompleted,
                completed_at: isCompleted ? new Date().toISOString() : null,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id,topic_id' }
            );
        } catch (err) {
          console.warn('[Supabase toggleTopic fallback to localDb]', err);
        }
      }
      return localResult;
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
    async getAllUsers(): Promise<UserProfile[]> {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
          if (!error && data) {
            const mapped: UserProfile[] = data.map((d: any) => {
              let pwHash = d.password_hash;
              let userBio = d.bio;
              if (!pwHash && userBio && userBio.startsWith('__hash:')) {
                pwHash = userBio.replace('__hash:', '');
                userBio = '';
              }
              return {
                id: d.id,
                email: d.email || '',
                username: d.username,
                displayName: d.display_name,
                avatarUrl: d.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${d.username}`,
                bio: userBio,
                university: d.university || 'APJ Abdul Kalam Technological University (KTU)',
                semester: d.semester || 'S7',
                collegeName: d.college_name,
                studyGoal: d.study_goal,
                role: d.role || 'user',
                createdAt: d.created_at || new Date().toISOString(),
                passwordHash: pwHash,
              };
            });

            // If empty, ensure super admin is present
            if (mapped.length === 0) {
              const defaultAdmin = localDb.getAllUsers().find((u) => u.role === 'super_admin');
              if (defaultAdmin) mapped.push(defaultAdmin);
            }

            localDb.setAllProfiles(mapped);
            return mapped;
          }
        } catch (e) {
          console.warn('[Supabase getAllUsers Fallback]', e);
        }
      }
      return localDb.getAllUsers();
    },

    async deleteUser(targetUserId: string, actorId: string): Promise<void> {
      // 1. Delete from local database (profiles, progress, tasks, notes, etc.)
      localDb.deleteUserAccount(targetUserId, actorId);

      // 2. Delete from Supabase cloud database
      if (isSupabaseConfigured && supabase) {
        try {
          await supabase.from('user_topic_progress').delete().eq('user_id', targetUserId);
          await supabase.from('user_settings').delete().eq('user_id', targetUserId);
          await supabase.from('study_tasks').delete().eq('user_id', targetUserId);
          await supabase.from('custom_topics').delete().eq('user_id', targetUserId);
          const { error } = await supabase.from('profiles').delete().eq('id', targetUserId);
          if (error) {
            console.error('[Supabase deleteUser error]', error);
          }
        } catch (err) {
          console.warn('[Supabase deleteUser fallback]', err);
        }
      }
    },

    async bulkDeleteUsers(targetUserIds: string[], actorId: string): Promise<number> {
      const count = localDb.bulkDeleteUsers(targetUserIds, actorId);

      if (isSupabaseConfigured && supabase && targetUserIds.length > 0) {
        try {
          await supabase.from('user_topic_progress').delete().in('user_id', targetUserIds);
          await supabase.from('user_settings').delete().in('user_id', targetUserIds);
          await supabase.from('study_tasks').delete().in('user_id', targetUserIds);
          await supabase.from('custom_topics').delete().in('user_id', targetUserIds);
          const { error } = await supabase.from('profiles').delete().in('id', targetUserIds);
          if (error) {
            console.error('[Supabase bulkDeleteUsers error]', error);
          }
        } catch (err) {
          console.warn('[Supabase bulkDeleteUsers fallback]', err);
        }
      }

      return count;
    },

    async deleteAllUsers(actorId: string, confirmationPhrase: string): Promise<number> {
      const count = localDb.deleteAllUsersSafely(actorId, confirmationPhrase);

      if (isSupabaseConfigured && supabase) {
        try {
          // Delete all records except the Super-Admin
          await supabase.from('user_topic_progress').delete().neq('user_id', actorId);
          await supabase.from('user_settings').delete().neq('user_id', actorId);
          await supabase.from('study_tasks').delete().neq('user_id', actorId);
          await supabase.from('custom_topics').delete().neq('user_id', actorId);
          const { error } = await supabase.from('profiles').delete().neq('id', actorId);
          if (error) {
            console.error('[Supabase deleteAllUsers error]', error);
          }
        } catch (err) {
          console.warn('[Supabase deleteAllUsers fallback]', err);
        }
      }

      return count;
    },

    getAuditLogs(): AuditLog[] {
      return localDb.getAuditLogs();
    },
  },
};
