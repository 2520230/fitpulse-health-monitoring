import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { path: '/workouts', label: 'Workouts', icon: '💪' },
  { path: '/metrics', label: 'Health Metrics', icon: '❤️' },
  { path: '/goals', label: 'Goals', icon: '🎯' },
  { path: '/plans', label: 'Workout Plans', icon: '📋' },
  { path: '/stats', label: 'Statistics', icon: '📊' },
  { path: '/profile', label: 'Profile', icon: '👤' },
];

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 100 }}>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.25rem' }}>
        ⚡ FitPulse
      </Link>
      <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', overflowX: 'auto' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              color: location.pathname === item.path ? '#bfdbfe' : 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              padding: '0.375rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
              fontWeight: location.pathname === item.path ? '600' : '400',
              backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.15)' : 'transparent',
              whiteSpace: 'nowrap',
            }}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', opacity: 0.9 }}>Hi, {user?.name?.split(' ')[0]}</span>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
