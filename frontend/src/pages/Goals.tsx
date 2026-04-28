import React, { useEffect, useState } from 'react';
import { goalsService } from '../services';
import { Goal, GoalProgress } from '../types';

const card = { backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' };
const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: '500' as const, color: '#374151', marginBottom: '0.25rem' };

const defaultForm = {
  title: '', type: 'custom', targetValue: '', currentValue: '0',
  unit: '', targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], notes: '',
};

const goalTypeIcons: Record<string, string> = {
  weight_loss: '⚖️', weight_gain: '📈', muscle_gain: '💪', endurance: '🏃', steps: '👟', custom: '🎯',
};

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [progress, setProgress] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [updateGoalId, setUpdateGoalId] = useState<string | null>(null);
  const [newCurrentValue, setNewCurrentValue] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const [allGoals, prog] = await Promise.all([
        goalsService.getAll(),
        goalsService.getProgress(),
      ]);
      setGoals(allGoals);
      setProgress(prog);
    } catch {
      setError('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGoals(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        targetValue: Number(form.targetValue),
        currentValue: Number(form.currentValue),
      };
      if (editId) {
        await goalsService.update(editId, payload);
      } else {
        await goalsService.create(payload);
      }
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
      fetchGoals();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save goal');
    }
  };

  const handleProgressUpdate = async (id: string) => {
    try {
      await goalsService.update(id, { currentValue: Number(newCurrentValue) });
      setUpdateGoalId(null);
      setNewCurrentValue('');
      fetchGoals();
    } catch {
      setError('Failed to update progress');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this goal?')) return;
    try {
      await goalsService.delete(id);
      fetchGoals();
    } catch {
      setError('Failed to delete goal');
    }
  };

  const filteredGoals = goals.filter((g) => g.status === activeTab || (activeTab === 'completed' && g.status === 'completed'));

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>🎯 Goals</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(defaultForm); }} style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
          + Add Goal
        </button>
      </div>

      {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>{error}</div>}

      {/* Progress Summary */}
      {progress.length > 0 && (
        <div style={{ ...card, marginBottom: '1.5rem', backgroundColor: '#eff6ff' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e40af', marginBottom: '1rem' }}>Active Goals Progress</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {progress.map((g) => (
              <div key={g.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#1e3a8a' }}>
                    {goalTypeIcons[g.type] || '🎯'} {g.title}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#1d4ed8', fontWeight: '600' }}>{g.percentComplete}%</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{g.daysRemaining}d left</span>
                  </div>
                </div>
                <div style={{ height: '8px', backgroundColor: '#bfdbfe', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: g.percentComplete >= 100 ? '#10b981' : '#1d4ed8', borderRadius: '9999px', width: `${g.percentComplete}%`, transition: 'width 0.3s' }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                  {g.currentValue} / {g.targetValue} {g.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goal Form */}
      {showForm && (
        <div style={{ ...card, marginBottom: '1.5rem', border: '2px solid #1d4ed8' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>{editId ? 'Edit Goal' : 'New Goal'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Goal Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle} placeholder="Lose 5kg in 2 months" />
              </div>
              <div>
                <label style={labelStyle}>Goal Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="weight_gain">Weight Gain</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="steps">Daily Steps</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Target Value *</label>
                <input type="number" value={form.targetValue} onChange={(e) => setForm({ ...form, targetValue: e.target.value })} required style={inputStyle} placeholder="70" min="0" step="any" />
              </div>
              <div>
                <label style={labelStyle}>Current Value</label>
                <input type="number" value={form.currentValue} onChange={(e) => setForm({ ...form, currentValue: e.target.value })} style={inputStyle} placeholder="0" min="0" step="any" />
              </div>
              <div>
                <label style={labelStyle}>Unit *</label>
                <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required style={inputStyle} placeholder="kg, steps, minutes..." />
              </div>
              <div>
                <label style={labelStyle}>Target Date *</label>
                <input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} required style={inputStyle} min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Any notes about this goal..." />
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                {editId ? 'Update Goal' : 'Save Goal'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['active', 'completed'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: activeTab === tab ? '#1d4ed8' : 'white', color: activeTab === tab ? 'white' : '#374151', cursor: 'pointer', fontWeight: '500', textTransform: 'capitalize' }}>
            {tab} ({goals.filter((g) => g.status === tab).length})
          </button>
        ))}
      </div>

      {/* Goals List */}
      {filteredGoals.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          <p>No {activeTab} goals. {activeTab === 'active' ? 'Set a new goal!' : ''}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filteredGoals.map((goal) => {
            const pct = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
            return (
              <div key={goal._id} style={{ ...card, padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{goalTypeIcons[goal.type] || '🎯'}</span>
                      <p style={{ fontWeight: '600', color: '#111827', fontSize: '1rem' }}>{goal.title}</p>
                      {goal.status === 'completed' && <span style={{ backgroundColor: '#dcfce7', color: '#16a34a', fontSize: '0.75rem', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontWeight: '500' }}>✓ Completed</span>}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Target: {goal.targetValue} {goal.unit} • Due: {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  </div>
                  {goal.status === 'active' && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => { setUpdateGoalId(updateGoalId === goal._id ? null : goal._id); setNewCurrentValue(goal.currentValue.toString()); }} style={{ fontSize: '0.75rem', color: '#16a34a', background: 'none', border: '1px solid #86efac', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>
                        Update
                      </button>
                      <button onClick={() => { setForm({ title: goal.title, type: goal.type, targetValue: goal.targetValue.toString(), currentValue: goal.currentValue.toString(), unit: goal.unit, targetDate: new Date(goal.targetDate).toISOString().split('T')[0], notes: goal.notes || '' }); setEditId(goal._id); setShowForm(true); }} style={{ fontSize: '0.75rem', color: '#1d4ed8', background: 'none', border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(goal._id)} style={{ fontSize: '0.75rem', color: '#dc2626', background: 'none', border: '1px solid #fca5a5', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                  )}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: pct >= 100 ? '#16a34a' : '#1d4ed8' }}>{pct}%</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#e5e7eb', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: pct >= 100 ? '#10b981' : '#1d4ed8', borderRadius: '9999px', width: `${pct}%`, transition: 'width 0.3s' }} />
                  </div>
                </div>
                {updateGoalId === goal._id && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
                    <input type="number" value={newCurrentValue} onChange={(e) => setNewCurrentValue(e.target.value)} style={{ ...inputStyle, width: '120px' }} placeholder="New value" step="any" />
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{goal.unit}</span>
                    <button onClick={() => handleProgressUpdate(goal._id)} style={{ backgroundColor: '#16a34a', color: 'white', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Save</button>
                    <button onClick={() => setUpdateGoalId(null)} style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.375rem 0.75rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.875rem' }}>Cancel</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;
