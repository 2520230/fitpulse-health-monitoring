import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workouts from './pages/Workouts';
import HealthMetrics from './pages/HealthMetrics';
import Goals from './pages/Goals';
import WorkoutPlans from './pages/WorkoutPlans';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading...</div>;
  return token ? <Layout>{element}</Layout> : <Navigate to="/login" replace />;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { token, isLoading } = useAuth();
  if (isLoading) return null;
  return token ? <Navigate to="/dashboard" replace /> : element;
};

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<PublicRoute element={<Login />} />} />
    <Route path="/register" element={<PublicRoute element={<Register />} />} />
    <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
    <Route path="/workouts" element={<PrivateRoute element={<Workouts />} />} />
    <Route path="/metrics" element={<PrivateRoute element={<HealthMetrics />} />} />
    <Route path="/goals" element={<PrivateRoute element={<Goals />} />} />
    <Route path="/plans" element={<PrivateRoute element={<WorkoutPlans />} />} />
    <Route path="/stats" element={<PrivateRoute element={<Statistics />} />} />
    <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;
