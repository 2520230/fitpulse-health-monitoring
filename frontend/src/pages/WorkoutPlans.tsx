import React, { useEffect, useState } from 'react';
import { plansService } from '../services';
import { WorkoutPlan, PlanDay } from '../types';

const card = { backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' };
const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: '500' as const, color: '#374151', marginBottom: '0.25rem' };

const levelColors: Record<string, string> = { beginner: '#10b981', intermediate: '#f59e0b', advanced: '#ef4444' };
const categoryIcons: Record<string, string> = { strength: '🏋️', cardio: '🏃', flexibility: '🧘', weight_loss: '⚖️', muscle_gain: '💪', general: '⭐' };

const WorkoutPlans: React.FC = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [error, setError] = useState('');

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await plansService.getAll(filterLevel || undefined, filterCategory || undefined);
      setPlans(data);
    } catch {
      setError('Failed to load workout plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlans(); }, [filterLevel, filterCategory]); // eslint-disable-line

  const handleViewPlan = async (id: string) => {
    try {
      const data = await plansService.getById(id);
      setSelectedPlan(data);
    } catch {
      setError('Failed to load plan details');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this plan?')) return;
    try {
      await plansService.delete(id);
      fetchPlans();
      if (selectedPlan?._id === id) setSelectedPlan(null);
    } catch {
      setError('Cannot delete default plans');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>📋 Workout Plans</h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Pre-built and custom workout routines</p>
      </div>

      {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>{error}</div>}

      {/* Filters */}
      <div style={{ ...card, marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ ...labelStyle, marginBottom: 0, marginRight: '0.5rem' }}>Level:</label>
            <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} style={{ ...inputStyle, width: 'auto', display: 'inline-block' }}>
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label style={{ ...labelStyle, marginBottom: 0, marginRight: '0.5rem' }}>Category:</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ ...inputStyle, width: 'auto', display: 'inline-block' }}>
              <option value="">All Categories</option>
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="muscle_gain">Muscle Gain</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedPlan ? '1fr 1fr' : 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {/* Plans Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {plans.length === 0 ? (
            <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>No plans found</div>
          ) : (
            plans.map((plan) => (
              <div key={plan._id} style={{ ...card, padding: '1.25rem', cursor: 'pointer', border: selectedPlan?._id === plan._id ? '2px solid #1d4ed8' : '2px solid transparent', transition: 'border 0.15s' }} onClick={() => handleViewPlan(plan._id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{categoryIcons[plan.category] || '⭐'}</span>
                      <h3 style={{ fontWeight: '600', color: '#111827', fontSize: '1rem' }}>{plan.title}</h3>
                      {plan.isDefault && <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontSize: '0.625rem', padding: '0.125rem 0.375rem', borderRadius: '9999px', fontWeight: '600' }}>DEFAULT</span>}
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{plan.description}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span style={{ backgroundColor: `${levelColors[plan.level]}20`, color: levelColors[plan.level], fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', fontWeight: '500', textTransform: 'capitalize' }}>{plan.level}</span>
                  <span style={{ backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>{plan.durationWeeks} weeks</span>
                  <span style={{ backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>{plan.daysPerWeek} days/week</span>
                  <span style={{ backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', textTransform: 'capitalize' }}>{plan.category}</span>
                </div>
                {!plan.isDefault && (
                  <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(plan._id); }} style={{ fontSize: '0.75rem', color: '#dc2626', background: 'none', border: '1px solid #fca5a5', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Delete</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Plan Details */}
        {selectedPlan && (
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#111827' }}>{selectedPlan.title}</h2>
              <button onClick={() => setSelectedPlan(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1.25rem' }}>✕</button>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>{selectedPlan.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ backgroundColor: `${levelColors[selectedPlan.level]}20`, color: levelColors[selectedPlan.level], fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px', textTransform: 'capitalize' }}>{selectedPlan.level}</span>
              <span style={{ backgroundColor: '#f3f4f6', color: '#374151', fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: '9999px' }}>{selectedPlan.durationWeeks}w • {selectedPlan.daysPerWeek}d/wk</span>
            </div>
            {selectedPlan.days && selectedPlan.days.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '60vh', overflowY: 'auto' }}>
                {selectedPlan.days.map((day: PlanDay) => (
                  <div key={day.dayNumber} style={{ border: '1px solid #e5e7eb', borderRadius: '0.5rem', padding: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem' }}>Day {day.dayNumber}: {day.title}</h4>
                      {day.isRestDay && <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', fontSize: '0.75rem', padding: '0.125rem 0.375rem', borderRadius: '9999px' }}>Rest Day</span>}
                    </div>
                    {!day.isRestDay && day.exercises.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                        {day.exercises.map((ex, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9fafb', padding: '0.375rem 0.5rem', borderRadius: '0.25rem' }}>
                            <span style={{ fontSize: '0.875rem', color: '#374151' }}>{ex.name}</span>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {ex.sets && ex.reps ? `${ex.sets}x${ex.reps}` : ex.duration ? `${ex.duration}min` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#9ca3af', textAlign: 'center' }}>No day details available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPlans;
