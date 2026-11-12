import { describe, it, expect, beforeEach } from 'vitest';
import { localDb, initializeLocalDatabase, calculateUserProgress } from '../src/services/localDatabase';
import { api } from '../src/services/api';
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
});
