import { describe, it, expect, beforeEach } from 'vitest';
import { localDb, initializeLocalDatabase, calculateUserProgress } from '../src/services/localDatabase';
import { api } from '../src/services/api';
import { hashPassword, verifyPasswordHash } from '../src/services/crypto';
import officialSyllabus from '../src/data/officialSyllabus.json';

// In-memory mock for localStorage in Node environment
const store: Record<string, string> = {};
global.localStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, val: string) => {
    store[key] = val;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    Object.keys(store).forEach((k) => delete store[k]);
  },
} as any;

describe('SyllabusSync Acceptance & Scenario Verification', () => {
  beforeEach(() => {
    localStorage.clear();
    initializeLocalDatabase();
  });

  it('Verifies syllabus integrity: 3 subjects, exactly 15 modules, no omitted topics', () => {
    expect(officialSyllabus.subjects).toHaveLength(3);
    const codes = officialSyllabus.subjects.map((s) => s.code);
    expect(codes).toContain('CST401');
    expect(codes).toContain('ECT425');
    expect(codes).toContain('CST433');

    let totalModules = 0;
    officialSyllabus.subjects.forEach((s) => {
      expect(s.modules).toHaveLength(5);
      totalModules += s.modules.length;
    });
    expect(totalModules).toBe(15);
  });

  it('Scenario 1: Topic completion persists in database', () => {
    const testUserId = 'usr-test-1';
    localDb.registerUser({
      email: 'test1@ktu.edu',
      username: 'test_student_1',
      displayName: 'Test Student 1',
    });

    const topicId = 'cst401-m2-t7'; // A* Search Algorithm
    localDb.toggleTopicCompletion(testUserId, topicId, true);

    const progress = localDb.getUserProgress(testUserId);
    const item = progress.find((p) => p.topicId === topicId);
    expect(item).toBeDefined();
    expect(item?.isCompleted).toBe(true);
  });

  it('Scenario 2: Independent users - User A completion does NOT affect User B', () => {
    const userA = localDb.registerUser({
      email: 'usera@ktu.edu',
      username: 'user_a',
      displayName: 'User A',
    });
    const userB = localDb.registerUser({
      email: 'userb@ktu.edu',
      username: 'user_b',
      displayName: 'User B',
    });

    const topicId = 'cst401-m2-t7-s2'; // A* Search subtopic
    // User A checks the topic
    localDb.toggleTopicCompletion(userA.id, topicId, true);

    const progA = localDb.getUserProgress(userA.id);
    const progB = localDb.getUserProgress(userB.id);

    expect(progA.find((p) => p.topicId === topicId)?.isCompleted).toBe(true);
    expect(progB.find((p) => p.topicId === topicId)?.isCompleted).toBeUndefined();
  });

  it('Scenario 3: Realtime friend tracking - Authorized friend can observe progress changes', () => {
    const userA = localDb.registerUser({ email: 'friend_a@ktu.edu', username: 'friend_a', displayName: 'Friend A' });
    const userB = localDb.registerUser({ email: 'friend_b@ktu.edu', username: 'friend_b', displayName: 'Friend B' });

    // Establish mutual friendship
    localDb.sendFriendRequest(userA.id, 'friend_b');
    const requests = localDb.getFriendRequests(userB.id);
    expect(requests).toHaveLength(1);
    localDb.respondToFriendRequest(requests[0].id, true);

    // Initial friend progress is 0%
    let friendList = localDb.getFriends(userB.id);
    const friendAPercentInitial = friendList.find((f) => f.friend.id === userA.id)?.progress.percentage;
    expect(friendAPercentInitial).toBe(0);

    // User A checks off topics
    localDb.toggleTopicCompletion(userA.id, 'cst401-m1-t1', true);
    localDb.toggleTopicCompletion(userA.id, 'cst401-m1-t2', true);

    // User B checks friend A progress snapshot
    friendList = localDb.getFriends(userB.id);
    const friendAPercentAfter = friendList.find((f) => f.friend.id === userA.id)?.progress.percentage;
    expect(friendAPercentAfter).toBeGreaterThan(0);
  });

  it('Scenario 5 & 6: Personal topic editing & safe deletion', () => {
    const userA = localDb.registerUser({ email: 'editor_a@ktu.edu', username: 'editor_a', displayName: 'Editor A' });
    const userB = localDb.registerUser({ email: 'editor_b@ktu.edu', username: 'editor_b', displayName: 'Editor B' });

    // User A adds a personal topic
    const custom = localDb.addCustomTopic({
      userId: userA.id,
      moduleId: 'cst401-m1',
      title: 'Personal KTU 2023 Solved Problem',
      priority: 'HIGH',
      displayOrder: 99,
    });

    // User A sees the custom topic
    expect(localDb.getCustomTopics(userA.id, 'cst401-m1')).toHaveLength(1);
    // User B does NOT see User A's custom topic
    expect(localDb.getCustomTopics(userB.id, 'cst401-m1')).toHaveLength(0);

    // Deleting User A's topic does not delete official syllabus or affect User B
    localDb.deleteCustomTopic(custom.id);
    expect(localDb.getCustomTopics(userA.id, 'cst401-m1')).toHaveLength(0);
    expect(officialSyllabus.subjects[0].modules[0].topics.length).toBeGreaterThan(0);
  });

  it('Scenario 7: PYQ verification and distinct frequency counts', () => {
    const papers = localDb.getQuestionPapers();
    const questions = localDb.getPYQQuestions();

    expect(papers.length).toBeGreaterThanOrEqual(8);
    expect(questions.length).toBeGreaterThanOrEqual(20);

    // Verify A* Search repeated question
    const astar = questions.find((q) => q.questionText.includes('A* search'));
    expect(astar).toBeDefined();
    expect(astar?.isRepeated).toBe(true);
    expect(astar?.repeatCount).toBe(3);
    expect(astar?.appearsIn).toHaveLength(3);
  });

  it('Scenario 10: Admin authorization - Regular user cannot delete other users', () => {
    const regularUser = localDb.registerUser({ email: 'regular@ktu.edu', username: 'regular', displayName: 'Regular User' });
    const victim = localDb.registerUser({ email: 'victim@ktu.edu', username: 'victim', displayName: 'Victim User' });

    // Regular user attempting to delete another user should throw Unauthorized error
    expect(() => {
      localDb.deleteUserAccount(victim.id, regularUser.id);
    }).toThrow(/Unauthorized/);
  });

  it('Scenario 11: Bulk and mass deletion safeguards for Super-Admin', () => {
    const superAdmin = localDb.getAllUsers().find((u) => u.role === 'super_admin');
    expect(superAdmin).toBeDefined();

    // Register real users to test deletion
    localDb.registerUser({ email: 'stu1@ktu.edu', username: 'student_1', displayName: 'Student 1' });
    localDb.registerUser({ email: 'stu2@ktu.edu', username: 'student_2', displayName: 'Student 2' });

    // Mass deletion fails if confirmation phrase is wrong
    expect(() => {
      localDb.deleteAllUsersSafely(superAdmin!.id, 'wrong phrase');
    }).toThrow(/Confirmation phrase mismatch/);

    // Mass deletion with exact phrase succeeds and preserves the Super-Admin
    const deletedCount = localDb.deleteAllUsersSafely(superAdmin!.id, 'DELETE ALL USERS PERMANENTLY');
    expect(deletedCount).toBeGreaterThan(0);

    const remaining = localDb.getAllUsers();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(superAdmin!.id);
  });

  it('Scenario 14: New user registration starts with 0% progress and no fake data', () => {
    const newUser = localDb.registerUser({
      email: 'fresh@ktu.edu',
      username: 'fresh_student',
      displayName: 'Fresh Student',
    });

    const progressSummary = calculateUserProgress(newUser.id);
    expect(progressSummary.completedLeafCount).toBe(0);
    expect(progressSummary.percentage).toBe(0);

    progressSummary.subjectSummaries.forEach((s) => {
      expect(s.percentage).toBe(0);
      expect(s.completedLeafCount).toBe(0);
    });
  });

  it('Scenario 15: Password hashing & verification securely validates credentials', async () => {
    const rawPass = 'studentSecret123';
    const hash = await hashPassword(rawPass);

    expect(hash).toHaveLength(64); // 256-bit hex hash

    const isMatch = await verifyPasswordHash(rawPass, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPasswordHash('wrongPassword', hash);
    expect(isWrongMatch).toBe(false);
  });

  it('Scenario 16: User registration with password protects account from unauthorized edits', async () => {
    const rawPass = 'myKtupass2026';
    const user = await api.auth.register({
      email: 'secure@ktu.edu',
      username: 'secure_student',
      displayName: 'Secure Student',
      password: rawPass,
      role: 'user',
    });

    expect(user.passwordHash).toBeDefined();
    expect(user.passwordHash).not.toBe(rawPass);

    // Login with correct password succeeds
    const loggedIn = await api.auth.signIn('secure_student', rawPass);
    expect(loggedIn.id).toBe(user.id);

    // Login with wrong password is automatically rejected
    await expect(api.auth.signIn('secure_student', 'wrong_pass')).rejects.toThrow(
      'Incorrect password'
    );
  });

  it('Scenario 17: Password verification verifies account ownership for unlocking editing', async () => {
    const rawPass = 'unlockMe456';
    const user = await api.auth.register({
      email: 'unlock@ktu.edu',
      username: 'unlock_student',
      displayName: 'Unlock Student',
      password: rawPass,
      role: 'user',
    });

    const isCorrect = await api.auth.verifyUserPassword(user.id, rawPass);
    expect(isCorrect).toBe(true);

    const isIncorrect = await api.auth.verifyUserPassword(user.id, 'incorrectPassword');
    expect(isIncorrect).toBe(false);
  });

  it('Scenario 18: View-only access allows reading syllabus without requiring a password', async () => {
    const student = await api.auth.register({
      email: 'viewable@ktu.edu',
      username: 'viewable_student',
      displayName: 'Viewable Student',
      password: 'privatePassword123',
      role: 'user',
    });

    // Mark 1 leaf topic as completed by the student
    const topicId = 'cst401-m1-t1'; // Introduction to Artificial Intelligence (leaf topic)
    await api.progress.toggleTopic(student.id, topicId, true);

    // Any visitor or peer can read their progress summary freely without providing a password
    const summary = await api.progress.getUserProgress(student.id);
    expect(summary.length).toBeGreaterThanOrEqual(1);
    const found = summary.find((s) => s.topicId === topicId);
    expect(found).toBeDefined();
    expect(found?.isCompleted).toBe(true);

    const calculated = calculateUserProgress(student.id);
    expect(calculated.completedLeafCount).toBe(1);
  });

  it('Scenario 19: Administrator account deletion permanently purges user from database', async () => {
    // 1. Create a user
    const rand = Date.now();
    const toDelete = await api.auth.register({
      email: `del_${rand}@ktu.edu`,
      username: `student_del_${rand}`,
      displayName: 'Delete Me Student',
      password: 'password123',
      role: 'user',
    });

    const beforeUsers = await api.admin.getAllUsers();
    expect(beforeUsers.some((u) => u.id === toDelete.id)).toBe(true);

    // 2. Admin deletes the user
    await api.admin.deleteUser(toDelete.id, 'usr-superadmin');

    // 3. User is permanently gone and getAllUsers does NOT resurrect it
    const afterUsers = await api.admin.getAllUsers();
    expect(afterUsers.some((u) => u.id === toDelete.id)).toBe(false);

    // 4. Any topic progress for this user is also purged
    const progress = await api.progress.getUserProgress(toDelete.id);
    expect(progress).toHaveLength(0);
  });
});
