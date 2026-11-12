import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { AppLayout } from './components/layout/AppLayout';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { ModuleChecklistPage } from './pages/ModuleChecklistPage';
import { PYQPage } from './pages/PYQPage';
import { PriorityPage } from './pages/PriorityPage';
import { PlannerPage } from './pages/PlannerPage';
import { RevisionsPage } from './pages/RevisionsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { FriendsPage } from './pages/FriendsPage';
import { FriendComparePage } from './pages/FriendComparePage';
import { GroupsPage } from './pages/GroupsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <Routes>
            {/* Public Landing & Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Authenticated Workspace with Layout */}
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:id" element={<SubjectDetailPage />} />
              <Route path="/subjects/:id/modules/:moduleId" element={<ModuleChecklistPage />} />
              <Route path="/pyq" element={<PYQPage />} />
              <Route path="/priority" element={<PriorityPage />} />
              <Route path="/planner" element={<PlannerPage />} />
              <Route path="/revisions" element={<RevisionsPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/friends/:id" element={<FriendComparePage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Catch-all redirect to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
