import React, { useEffect, useState } from 'react';
import { statsService } from '../services';
import { WeeklyStats, MonthlyStats } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';

const card = { backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' };

const StatNumber: React.FC<{ label: string; value: string | number; icon: string; color: string }> = ({ label, value, icon, color }) => (
  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
    <div style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{icon}</div>
    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color }}>{value}</div>
    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{label}</div>
  </div>
);

const Statistics: React.FC = () => {
  const [weekly, setWeekly] = useState<WeeklyStats | null>(null);
  const [monthly, setMonthly] = useState<MonthlyStats | null>(null);
  const [overall, setOverall] = useState<{ totalWorkouts: number; totalCaloriesBurned: number; totalDuration: number; totalSteps: number; typeBreakdown: Record<string, number>; weightHistory: { date: string; weight: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'overall'>('weekly');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [w, m, o] = await Promise.all([
          statsService.getWeekly(),
          statsService.getMonthly(),
          statsService.getOverall(),
        ]);
        setWeekly(w);
        setMonthly(m);
        setOverall(o);
      } catch (err) {
        console.error('Stats load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading statistics...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>📊 Statistics</h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Track your fitness progress over time</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['weekly', 'monthly', 'overall'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: activeTab === tab ? '#1d4ed8' : 'white', color: activeTab === tab ? 'white' : '#374151', cursor: 'pointer', fontWeight: '500', textTransform: 'capitalize' }}>
            {tab}
          </button>
        ))}
      </div>

      {/* Weekly Stats */}
      {activeTab === 'weekly' && weekly && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <StatNumber label="Workouts" value={weekly.summary.workoutCount} icon="💪" color="#1d4ed8" />
            <StatNumber label="Calories Burned" value={weekly.summary.totalCaloriesBurned} icon="🔥" color="#f59e0b" />
            <StatNumber label="Total Duration" value={`${weekly.summary.totalDuration}min`} icon="⏱️" color="#8b5cf6" />
            <StatNumber label="Total Steps" value={weekly.summary.totalSteps.toLocaleString()} icon="👟" color="#10b981" />
            {weekly.summary.avgHeartRate && <StatNumber label="Avg Heart Rate" value={`${weekly.summary.avgHeartRate} bpm`} icon="❤️" color="#ef4444" />}
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Daily Calories Burned</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weekly.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { weekday: 'short' })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val} kcal`, 'Calories']} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
                <Bar dataKey="calories" fill="#1d4ed8" radius={[4, 4, 0, 0]} name="Calories" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Daily Steps</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weekly.daily}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { weekday: 'short' })} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`${val}`, 'Steps']} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
                <Bar dataKey="steps" fill="#10b981" radius={[4, 4, 0, 0]} name="Steps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Monthly Stats */}
      {activeTab === 'monthly' && monthly && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <StatNumber label="Workouts" value={monthly.summary.workoutCount} icon="💪" color="#1d4ed8" />
            <StatNumber label="Calories Burned" value={monthly.summary.totalCaloriesBurned} icon="🔥" color="#f59e0b" />
            <StatNumber label="Total Duration" value={`${monthly.summary.totalDuration}min`} icon="⏱️" color="#8b5cf6" />
            <StatNumber label="Total Steps" value={monthly.summary.totalSteps.toLocaleString()} icon="👟" color="#10b981" />
          </div>

          <div style={card}>
            <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Weekly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthly.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="calories" name="Calories" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="workouts" name="Workouts" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Overall Stats */}
      {activeTab === 'overall' && overall && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <StatNumber label="Total Workouts" value={overall.totalWorkouts} icon="💪" color="#1d4ed8" />
            <StatNumber label="Calories Burned" value={overall.totalCaloriesBurned} icon="🔥" color="#f59e0b" />
            <StatNumber label="Total Duration" value={`${Math.floor(overall.totalDuration / 60)}h`} icon="⏱️" color="#8b5cf6" />
            <StatNumber label="Total Steps" value={overall.totalSteps.toLocaleString()} icon="👟" color="#10b981" />
          </div>

          {/* Workout Type Breakdown */}
          {Object.keys(overall.typeBreakdown).length > 0 && (
            <div style={card}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Workout Type Breakdown</h3>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {Object.entries(overall.typeBreakdown).map(([type, count]) => (
                  <div key={type} style={{ backgroundColor: '#f3f4f6', padding: '0.75rem 1.25rem', borderRadius: '0.5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1d4ed8' }}>{count}</p>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'capitalize' }}>{type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weight History */}
          {overall.weightHistory.length > 1 && (
            <div style={card}>
              <h3 style={{ fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>Weight History</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={overall.weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(v) => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                  <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                  <Tooltip formatter={(val) => [`${val} kg`, 'Weight']} labelFormatter={(l) => new Date(l).toLocaleDateString()} />
                  <Line type="monotone" dataKey="weight" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} name="Weight (kg)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Statistics;
