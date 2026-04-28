import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { metricsService, goalsService } from '../services';
import { useAuth } from '../store/AuthContext';
import { Workout, GoalProgress } from '../types';

interface DashboardData {
  todayMetrics: {
    heartRate?: number;
    steps?: number;
    caloriesBurned?: number;
    caloriesConsumed?: number;
    waterIntake?: number;
  } | null;
  recentWorkouts: Workout[];
  bmi: string | null;
  user: { weight?: number; height?: number };
}

const card = {
  backgroundColor: 'white',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  padding: '1.5rem',
};

const StatCard: React.FC<{ icon: string; label: string; value: string; unit?: string; color: string }> = ({ icon, label, value, unit, color }) => (
  <div style={{ ...card, borderLeft: `4px solid ${color}` }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>{label}</p>
        <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>{value}</p>
        {unit && <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{unit}</p>}
      </div>
      <span style={{ fontSize: '2rem' }}>{icon}</span>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [goals, setGoals] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dash, goalProgress] = await Promise.all([
          metricsService.getDashboard(),
          goalsService.getProgress(),
        ]);
        setDashData(dash);
        setGoals(goalProgress.slice(0, 3));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
        Loading dashboard...
      </div>
    );
  }

  const bmiCategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (bmi < 25) return { label: 'Normal', color: '#10b981' };
    if (bmi < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const bmiNum = dashData?.bmi ? parseFloat(dashData.bmi) : null;
  const bmiInfo = bmiNum ? bmiCategory(bmiNum) : null;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Today's Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon="❤️" label="Heart Rate" value={dashData?.todayMetrics?.heartRate?.toString() || '--'} unit="bpm" color="#ef4444" />
        <StatCard icon="👟" label="Steps Today" value={dashData?.todayMetrics?.steps?.toLocaleString() || '--'} unit="steps" color="#3b82f6" />
        <StatCard icon="🔥" label="Calories Burned" value={dashData?.todayMetrics?.caloriesBurned?.toString() || '--'} unit="kcal" color="#f59e0b" />
        <StatCard icon="💧" label="Water Intake" value={dashData?.todayMetrics?.waterIntake?.toString() || '--'} unit="ml" color="#06b6d4" />
        {dashData?.bmi && bmiInfo && (
          <div style={{ ...card, borderLeft: `4px solid ${bmiInfo.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>BMI</p>
                <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>{dashData.bmi}</p>
                <p style={{ fontSize: '0.75rem', color: bmiInfo.color, fontWeight: '500' }}>{bmiInfo.label}</p>
              </div>
              <span style={{ fontSize: '2rem' }}>⚖️</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Recent Workouts */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Recent Workouts</h2>
            <Link to="/workouts" style={{ fontSize: '0.875rem', color: '#1d4ed8', textDecoration: 'none' }}>View all →</Link>
          </div>
          {dashData?.recentWorkouts && dashData.recentWorkouts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {dashData.recentWorkouts.map((w) => (
                <div key={w._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: '500', color: '#111827', fontSize: '0.875rem' }}>{w.title}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{w.type} • {w.totalDuration} min</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{new Date(w.date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              <p>No workouts yet</p>
              <Link to="/workouts" style={{ color: '#1d4ed8', textDecoration: 'none', fontSize: '0.875rem' }}>Log your first workout →</Link>
            </div>
          )}
        </div>

        {/* Active Goals */}
        <div style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827' }}>Active Goals</h2>
            <Link to="/goals" style={{ fontSize: '0.875rem', color: '#1d4ed8', textDecoration: 'none' }}>View all →</Link>
          </div>
          {goals.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {goals.map((goal) => (
                <div key={goal.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>{goal.title}</span>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{goal.percentComplete}%</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: goal.percentComplete >= 100 ? '#10b981' : '#1d4ed8', borderRadius: '9999px', width: `${goal.percentComplete}%`, transition: 'width 0.3s' }} />
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                    {goal.currentValue} / {goal.targetValue} {goal.unit} • {goal.daysRemaining} days left
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
              <p>No active goals</p>
              <Link to="/goals" style={{ color: '#1d4ed8', textDecoration: 'none', fontSize: '0.875rem' }}>Set your first goal →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={card}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { to: '/workouts', label: '💪 Log Workout', bg: '#eff6ff', color: '#1d4ed8' },
            { to: '/metrics', label: '📊 Log Metrics', bg: '#f0fdf4', color: '#16a34a' },
            { to: '/goals', label: '🎯 Add Goal', bg: '#fff7ed', color: '#c2410c' },
            { to: '/plans', label: '📋 View Plans', bg: '#faf5ff', color: '#7c3aed' },
            { to: '/stats', label: '📈 See Stats', bg: '#f0f9ff', color: '#0369a1' },
          ].map((action) => (
            <Link
              key={action.to}
              to={action.to}
              style={{ padding: '0.75rem 1.25rem', borderRadius: '0.5rem', backgroundColor: action.bg, color: action.color, textDecoration: 'none', fontWeight: '500', fontSize: '0.875rem', border: '1px solid transparent' }}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
