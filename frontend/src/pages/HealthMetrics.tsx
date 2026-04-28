import React, { useEffect, useState } from 'react';
import { metricsService } from '../services';
import { HealthMetric } from '../types';
import { useAuth } from '../store/AuthContext';

const card = { backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' };
const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: '500' as const, color: '#374151', marginBottom: '0.25rem' };

const HealthMetrics: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetric | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    heartRate: '', steps: '', caloriesBurned: '', caloriesConsumed: '',
    weight: '', sleepHours: '', waterIntake: '', activityLevel: '',
  });

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await metricsService.getDailyMetrics();
      setMetrics(data);
      if (data && Object.keys(data).length > 0) {
        setForm({
          heartRate: data.heartRate?.toString() || '',
          steps: data.steps?.toString() || '',
          caloriesBurned: data.caloriesBurned?.toString() || '',
          caloriesConsumed: data.caloriesConsumed?.toString() || '',
          weight: data.weight?.toString() || '',
          sleepHours: data.sleepHours?.toString() || '',
          waterIntake: data.waterIntake?.toString() || '',
          activityLevel: data.activityLevel || '',
        });
      }
    } catch {
      setError('Failed to load metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, []); // eslint-disable-line

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload: Record<string, unknown> = {};
      if (form.heartRate) payload.heartRate = Number(form.heartRate);
      if (form.steps) payload.steps = Number(form.steps);
      if (form.caloriesBurned) payload.caloriesBurned = Number(form.caloriesBurned);
      if (form.caloriesConsumed) payload.caloriesConsumed = Number(form.caloriesConsumed);
      if (form.weight) payload.weight = Number(form.weight);
      if (form.sleepHours) payload.sleepHours = Number(form.sleepHours);
      if (form.waterIntake) payload.waterIntake = Number(form.waterIntake);
      if (form.activityLevel) payload.activityLevel = form.activityLevel;
      const data = await metricsService.logDailyMetrics(payload);
      setMetrics(data);
      setSuccess('Metrics saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save metrics');
    } finally {
      setSaving(false);
    }
  };

  const bmi = user?.weight && user?.height
    ? (user.weight / Math.pow(user.height / 100, 2)).toFixed(1)
    : null;

  const bmiCategory = (b: number) => {
    if (b < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (b < 25) return { label: 'Normal', color: '#10b981' };
    if (b < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const bmiNum = bmi ? parseFloat(bmi) : null;
  const bmiInfo = bmiNum ? bmiCategory(bmiNum) : null;

  const metricCards = [
    { icon: '❤️', label: 'Heart Rate', value: metrics?.heartRate, unit: 'bpm', color: '#ef4444', range: 'Normal: 60-100 bpm', field: 'heartRate' },
    { icon: '👟', label: 'Steps', value: metrics?.steps, unit: 'steps', color: '#3b82f6', range: 'Goal: 10,000 steps', field: 'steps' },
    { icon: '🔥', label: 'Calories Burned', value: metrics?.caloriesBurned, unit: 'kcal', color: '#f59e0b', range: 'Today\'s burn', field: 'caloriesBurned' },
    { icon: '🍽️', label: 'Calories Consumed', value: metrics?.caloriesConsumed, unit: 'kcal', color: '#10b981', range: 'Today\'s intake', field: 'caloriesConsumed' },
    { icon: '⚖️', label: 'Weight', value: metrics?.weight, unit: 'kg', color: '#8b5cf6', range: 'Current weight', field: 'weight' },
    { icon: '😴', label: 'Sleep', value: metrics?.sleepHours, unit: 'hours', color: '#06b6d4', range: 'Goal: 7-9 hours', field: 'sleepHours' },
    { icon: '💧', label: 'Water Intake', value: metrics?.waterIntake, unit: 'ml', color: '#0ea5e9', range: 'Goal: 2000ml', field: 'waterIntake' },
  ];

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>❤️ Health Metrics</h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Track your daily health data</p>
      </div>

      {/* Today's Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {metricCards.map((m) => (
          <div key={m.field} style={{ ...card, borderTop: `3px solid ${m.color}`, padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{m.icon}</div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{m.label}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
              {m.value !== undefined && m.value !== null ? m.value : '--'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{m.unit}</p>
            <p style={{ fontSize: '0.625rem', color: '#d1d5db', marginTop: '0.25rem' }}>{m.range}</p>
          </div>
        ))}

        {/* BMI Card */}
        {bmi && bmiInfo && (
          <div style={{ ...card, borderTop: `3px solid ${bmiInfo.color}`, padding: '1rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>BMI</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>{bmi}</p>
            <p style={{ fontSize: '0.75rem', color: bmiInfo.color, fontWeight: '500' }}>{bmiInfo.label}</p>
            <p style={{ fontSize: '0.625rem', color: '#d1d5db', marginTop: '0.25rem' }}>Based on profile</p>
          </div>
        )}
      </div>

      {/* Activity Level Badge */}
      {metrics?.activityLevel && (
        <div style={{ ...card, marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#eff6ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏃</span>
            <div>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>Today's Activity Level</p>
              <p style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#1d4ed8', textTransform: 'capitalize' }}>{metrics.activityLevel}</p>
            </div>
          </div>
        </div>
      )}

      {/* Log Metrics Form */}
      <div style={card}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>
          📝 Log Today's Metrics
        </h2>
        {success && <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#16a34a', fontSize: '0.875rem' }}>{success}</div>}
        {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>{error}</div>}
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Heart Rate (bpm)</label>
              <input type="number" value={form.heartRate} onChange={(e) => setForm({ ...form, heartRate: e.target.value })} style={inputStyle} placeholder="72" min="30" max="250" />
            </div>
            <div>
              <label style={labelStyle}>Steps</label>
              <input type="number" value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} style={inputStyle} placeholder="8500" min="0" />
            </div>
            <div>
              <label style={labelStyle}>Calories Burned (kcal)</label>
              <input type="number" value={form.caloriesBurned} onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })} style={inputStyle} placeholder="350" min="0" />
            </div>
            <div>
              <label style={labelStyle}>Calories Consumed (kcal)</label>
              <input type="number" value={form.caloriesConsumed} onChange={(e) => setForm({ ...form, caloriesConsumed: e.target.value })} style={inputStyle} placeholder="1800" min="0" />
            </div>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} style={inputStyle} placeholder="70" min="20" max="500" step="0.1" />
            </div>
            <div>
              <label style={labelStyle}>Sleep (hours)</label>
              <input type="number" value={form.sleepHours} onChange={(e) => setForm({ ...form, sleepHours: e.target.value })} style={inputStyle} placeholder="7.5" min="0" max="24" step="0.5" />
            </div>
            <div>
              <label style={labelStyle}>Water Intake (ml)</label>
              <input type="number" value={form.waterIntake} onChange={(e) => setForm({ ...form, waterIntake: e.target.value })} style={inputStyle} placeholder="1500" min="0" />
            </div>
            <div>
              <label style={labelStyle}>Activity Level</label>
              <select value={form.activityLevel} onChange={(e) => setForm({ ...form, activityLevel: e.target.value })} style={inputStyle}>
                <option value="">Select level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="intense">Intense</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={saving} style={{ backgroundColor: saving ? '#93c5fd' : '#1d4ed8', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '500' }}>
            {saving ? 'Saving...' : '💾 Save Metrics'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthMetrics;
