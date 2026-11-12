// ==============================================================================
// SYLLABUSSYNC CORE TYPE DEFINITIONS
// ==============================================================================

export type PriorityLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
export type PYQPriorityLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW_EVIDENCE' | 'NOT_YET_ANALYZED';
export type QuestionType = 'CONCEPT' | 'ALGORITHM' | 'DIAGRAM' | 'NUMERICAL' | 'LONG_ANSWER' | 'SHORT_ANSWER';
export type RevisionState = 'not_started' | 'in_progress' | 'studied' | 'revision_needed' | 'revised' | 'confident';
export type UserRole = 'super_admin' | 'admin' | 'user';
export type ProgressVisibility = 'private' | 'friends' | 'groups' | 'public';
export type GroupRole = 'owner' | 'moderator' | 'member';

export interface Subtopic {
  id: string;
  title: string;
  priority: PriorityLevel;
  order: number;
}

export interface Topic {
  id: string;
  moduleId?: string;
  parentTopicId?: string | null;
  title: string;
  description?: string;
  priority: PriorityLevel;
  order: number;
  subtopics: Subtopic[];
  isLeaf?: boolean;
  isArchived?: boolean;
}

export interface Module {
  id: string;
  subjectId?: string;
  moduleNumber: number;
  title: string;
  lectureHours: number;
  description: string;
  topics: Topic[];
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  shortName: string;
  category: string;
  credits: number;
  lectureHours: number;
  color: string;
  textbook: string;
  description: string;
  modules: Module[];
}

export interface SyllabusData {
  university: string;
  scheme: string;
  semester: string;
  subjects: Subject[];
}

export interface CustomTopic {
  id: string;
  userId: string;
  groupId?: string | null;
  moduleId: string;
  parentTopicId?: string | null;
  title: string;
  description?: string;
  priority: PriorityLevel;
  isCompleted: boolean;
  isArchived: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserTopicProgress {
  id: string;
  userId: string;
  topicId: string;
  isCompleted: boolean;
  completedAt?: string | null;
  revisionState: RevisionState;
  confidenceLevel: number; // 0 to 5
  revisionCount: number;
  lastRevisedAt?: string | null;
  nextRevisionAt?: string | null;
  notes?: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  university: string;
  semester: string;
  collegeName?: string;
  studyGoal: string;
  role: UserRole;
  createdAt: string;
  passwordHash?: string;
}

export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark' | 'system';
  progressVisibility: ProgressVisibility;
  emailNotifications: boolean;
  studyReminders: boolean;
  dailyGoalMinutes: number;
}

export interface QuestionPaper {
  id: string;
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  month: string;
  year: number;
  scheme: string;
  semester: string;
  totalMarks: number;
  durationHours: number;
  filename: string;
  fileUrl?: string;
  verified: boolean;
  uploadedAt: string;
}

export interface PYQQuestion {
  id: string;
  paperId: string;
  subjectId: string;
  moduleId: string;
  topicId?: string | null;
  subtopicId?: string | null;
  qNumber: string;
  part: 'A' | 'B';
  marks: number;
  questionText: string;
  questionType: QuestionType;
  pageNumber: number;
  groupId?: string;
  appearsIn: string[];
  isRepeated: boolean;
  repeatCount: number;
  priority: PYQPriorityLevel;
}

export interface Friendship {
  id: string;
  userId: string;
  friendId: string;
  status: 'accepted' | 'blocked';
  createdAt: string;
  friendProfile?: UserProfile;
  friendProgress?: SubjectProgressSummary[];
}

export interface FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  senderProfile?: UserProfile;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  inviteCode: string;
  isPrivate: boolean;
  memberCount?: number;
  members?: GroupMember[];
  createdAt: string;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  role: GroupRole;
  joinedAt: string;
  userProfile?: UserProfile;
  progressSummary?: SubjectProgressSummary[];
}

export interface StudyTask {
  id: string;
  userId: string;
  subjectId?: string | null;
  topicId?: string | null;
  title: string;
  notes?: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
}

export interface UserNote {
  id: string;
  userId: string;
  topicId: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorUsername: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  createdAt: string;
}

// Progress calculation interfaces
export interface ModuleProgressSummary {
  moduleId: string;
  moduleNumber: number;
  title: string;
  completedLeafCount: number;
  totalLeafCount: number;
  percentage: number;
}

export interface SubjectProgressSummary {
  subjectId: string;
  code: string;
  name: string;
  shortName: string;
  color: string;
  completedLeafCount: number;
  totalLeafCount: number;
  percentage: number;
  modules: ModuleProgressSummary[];
}

export interface OverallProgressSummary {
  completedLeafCount: number;
  totalLeafCount: number;
  percentage: number;
  subjectSummaries: SubjectProgressSummary[];
}

export interface ActivityHeatmapDay {
  date: string; // YYYY-MM-DD
  count: number;
}
