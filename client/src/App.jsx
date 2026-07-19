import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './components/ui';
import { useAuth } from './hooks/useAuth';

import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Workspaces = lazy(() => import('./pages/workspaces/Workspaces'));
const WorkspaceDetail = lazy(() => import('./pages/workspaces/WorkspaceDetail'));
const ApiBuilder = lazy(() => import('./pages/ApiBuilder'));
const Environments = lazy(() => import('./pages/Environments'));
const History = lazy(() => import('./pages/History'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Activity = lazy(() => import('./pages/Activity'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppContent = () => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-primary-bg"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route element={
          <ProtectedRoute>
            <WorkspaceProvider>
              <SocketProvider>
                <Layout />
              </SocketProvider>
            </WorkspaceProvider>
          </ProtectedRoute>
        }>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspaces" element={<Workspaces />} />
          <Route path="/workspaces/:id" element={<WorkspaceDetail />} />
          <Route path="/api-builder" element={<ApiBuilder />} />
          <Route path="/collections" element={<ApiBuilder />} />
          <Route path="/environments" element={<Environments />} />
          <Route path="/history" element={<History />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
