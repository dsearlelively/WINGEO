import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ModuleView from './pages/ModuleView';
import DensityTesting from './pages/DensityTesting';
import Sampling from './pages/Sampling';
import Activities from './pages/Activities';
import Admin from './pages/Admin';
import LIMS from './pages/LIMS';
import Review from './pages/Review';
import { getCurrentUser } from './services/auth';
import { User } from './types';
import { MODULES } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleLogin = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
          />
          
          <Route 
            path="/" 
            element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
          />

          {/* Specific Routes */}
          <Route
            path="/density"
            element={user ? <DensityTesting /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/sampling"
            element={user ? <Sampling /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/activities"
            element={user ? <Activities /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/admin"
            element={user ? <Admin /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/lims"
            element={user ? <LIMS /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/review"
            element={user ? <Review /> : <Navigate to="/login" replace />}
          />

          {/* Generic Routes for other modules */}
          {MODULES
            .filter(m => !['density', 'sampling', 'activities', 'admin', 'lims', 'review'].includes(m.id))
            .map((module) => (
              <Route
                key={module.id}
                path={module.path}
                element={user ? <ModuleView /> : <Navigate to="/login" replace />}
              />
          ))}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;