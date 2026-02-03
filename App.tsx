import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Events } from './pages/Events';
import { InstagramManager } from './pages/Instagram';
import { Reports } from './pages/Reports';
import { Files } from './pages/Files';
import { MyHondaCampaigns } from './pages/MyHonda';
import { Settings } from './pages/Settings';
import { DavidTasks } from './pages/DavidTasks';
import { Login } from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useApp();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
                <ProtectedRoute>
                    <Layout><Dashboard /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/events" element={
                <ProtectedRoute>
                    <Layout><Events /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/instagram" element={
                <ProtectedRoute>
                    <Layout><InstagramManager /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/reports" element={
                <ProtectedRoute>
                    <Layout><Reports /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/files" element={
                <ProtectedRoute>
                    <Layout><Files /></Layout>
                </ProtectedRoute>
            } />
            <Route path="/myhonda" element={
                <ProtectedRoute>
                    <Layout><MyHondaCampaigns /></Layout>
                </ProtectedRoute>
            } />
             <Route path="/settings" element={
                <ProtectedRoute>
                    <Layout><Settings /></Layout>
                </ProtectedRoute>
            } />
             <Route path="/david-tasks" element={
                <ProtectedRoute>
                    <Layout><DavidTasks /></Layout>
                </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;