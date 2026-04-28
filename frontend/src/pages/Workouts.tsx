import React, { useEffect, useState } from 'react';
import { workoutService } from '../services';
import { Workout } from '../types';

const card = { backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' };
const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: '500' as const, color: '#374151', marginBottom: '0.25rem' };

const workoutTypes = ['cardio', 'strength', 'flexibility', 'sports', 'other'];

const defaultForm = {
  title: '', type: 'strength', totalDuration: '', totalCaloriesBurned: '', notes: '', date: new Date().toISOString().split('T')[0],
  exercises: [{ name: '', duration: '', sets: '', reps: '', weight: '', caloriesBurned: '' }],
};

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('');
  const [error, setError] = useState('');

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const data = await workoutService.getAll(page, 10, filterType || undefined);
      setWorkouts(data.workouts);
      setTotal(data.total);
    } catch {
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWorkouts(); }, [page, filterType]); // eslint-disable-line

  const handleExerciseChange = (index: number, field: string, value: string) => {
    const exercises = [...form.exercises];
    exercises[index] = { ...exercises[index], [field]: value };
    setForm({ ...form, exercises });
  };

  const addExercise = () => {
    setForm({ ...form, exercises: [...form.exercises, { name: '', duration: '', sets: '', reps: '', weight: '', caloriesBurned: '' }] });
  };

  const removeExercise = (index: number) => {
    setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        totalDuration: Number(form.totalDuration),
        totalCaloriesBurned: Number(form.totalCaloriesBurned) || 0,
        exercises: form.exercises
          .filter((ex) => ex.name)
          .map((ex) => ({
            name: ex.name,
            duration: ex.duration ? Number(ex.duration) : undefined,
            sets: ex.sets ? Number(ex.sets) : undefined,
            reps: ex.reps ? Number(ex.reps) : undefined,
            weight: ex.weight ? Number(ex.weight) : undefined,
            caloriesBurned: ex.caloriesBurned ? Number(ex.caloriesBurned) : undefined,
          })),
      };
      if (editId) {
        await workoutService.update(editId, payload);
      } else {
        await workoutService.create(payload);
      }
      setShowForm(false);
      setForm(defaultForm);
      setEditId(null);
      fetchWorkouts();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to save workout');
    }
  };

  const handleEdit = (workout: Workout) => {
    setForm({
      title: workout.title,
      type: workout.type,
      totalDuration: workout.totalDuration.toString(),
      totalCaloriesBurned: workout.totalCaloriesBurned?.toString() || '',
      notes: workout.notes || '',
      date: new Date(workout.date).toISOString().split('T')[0],
      exercises: workout.exercises.length > 0
        ? workout.exercises.map((ex) => ({ name: ex.name, duration: ex.duration?.toString() || '', sets: ex.sets?.toString() || '', reps: ex.reps?.toString() || '', weight: ex.weight?.toString() || '', caloriesBurned: ex.caloriesBurned?.toString() || '' }))
        : [{ name: '', duration: '', sets: '', reps: '', weight: '', caloriesBurned: '' }],
    });
    setEditId(workout._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this workout?')) return;
    try {
      await workoutService.delete(id);
      fetchWorkouts();
    } catch {
      setError('Failed to delete workout');
    }
  };

  const typeColor: Record<string, string> = { cardio: '#3b82f6', strength: '#8b5cf6', flexibility: '#10b981', sports: '#f59e0b', other: '#6b7280' };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>💪 Workouts</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(defaultForm); }} style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
          + Log Workout
        </button>
      </div>

      {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>{error}</div>}

      {/* Filter */}
      <div style={{ ...card, marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Filter by type:</span>
          <button onClick={() => setFilterType('')} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #d1d5db', backgroundColor: !filterType ? '#1d4ed8' : 'white', color: !filterType ? 'white' : '#374151', cursor: 'pointer', fontSize: '0.875rem' }}>All</button>
          {workoutTypes.map((t) => (
            <button key={t} onClick={() => setFilterType(t)} style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', border: '1px solid #d1d5db', backgroundColor: filterType === t ? typeColor[t] : 'white', color: filterType === t ? 'white' : '#374151', cursor: 'pointer', fontSize: '0.875rem', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Workout Form */}
      {showForm && (
        <div style={{ ...card, marginBottom: '1.5rem', border: '2px solid #1d4ed8' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#111827' }}>{editId ? 'Edit Workout' : 'Log New Workout'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={inputStyle} placeholder="Morning Run" />
              </div>
              <div>
                <label style={labelStyle}>Type *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                  {workoutTypes.map((t) => <option key={t} value={t} style={{ textTransform: 'capitalize' }}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Duration (minutes) *</label>
                <input type="number" value={form.totalDuration} onChange={(e) => setForm({ ...form, totalDuration: e.target.value })} required min="1" style={inputStyle} placeholder="30" />
              </div>
              <div>
                <label style={labelStyle}>Calories Burned</label>
                <input type="number" value={form.totalCaloriesBurned} onChange={(e) => setForm({ ...form, totalCaloriesBurned: e.target.value })} min="0" style={inputStyle} placeholder="250" />
              </div>
              <div>
                <label style={labelStyle}>Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Exercises</label>
                <button type="button" onClick={addExercise} style={{ fontSize: '0.75rem', color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Exercise</button>
              </div>
              {form.exercises.map((ex, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr auto', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <input value={ex.name} onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)} style={inputStyle} placeholder="Exercise name" />
                  <input type="number" value={ex.sets} onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)} style={inputStyle} placeholder="Sets" min="0" />
                  <input type="number" value={ex.reps} onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)} style={inputStyle} placeholder="Reps" min="0" />
                  <input type="number" value={ex.weight} onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)} style={inputStyle} placeholder="kg" min="0" />
                  <input type="number" value={ex.duration} onChange={(e) => handleExerciseChange(idx, 'duration', e.target.value)} style={inputStyle} placeholder="min" min="0" />
                  <input type="number" value={ex.caloriesBurned} onChange={(e) => handleExerciseChange(idx, 'caloriesBurned', e.target.value)} style={inputStyle} placeholder="kcal" min="0" />
                  {form.exercises.length > 1 && (
                    <button type="button" onClick={() => removeExercise(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1rem' }}>✕</button>
                  )}
                </div>
              ))}
              <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Sets · Reps · Weight (kg) · Duration (min) · Calories</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }} placeholder="Any notes..." />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" style={{ backgroundColor: '#1d4ed8', color: 'white', padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                {editId ? 'Update Workout' : 'Save Workout'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(defaultForm); }} style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.625rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Workouts List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>Loading...</div>
      ) : workouts.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No workouts yet</p>
          <p>Start by logging your first workout!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {workouts.map((w) => (
            <div key={w._id} style={{ ...card, padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: `${typeColor[w.type]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  {w.type === 'cardio' ? '🏃' : w.type === 'strength' ? '🏋️' : w.type === 'flexibility' ? '🧘' : w.type === 'sports' ? '⚽' : '💪'}
                </div>
                <div>
                  <p style={{ fontWeight: '600', color: '#111827', marginBottom: '0.125rem' }}>{w.title}</p>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', color: typeColor[w.type], fontWeight: '500', textTransform: 'capitalize' }}>{w.type}</span>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>⏱ {w.totalDuration} min</span>
                    {w.totalCaloriesBurned > 0 && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>🔥 {w.totalCaloriesBurned} kcal</span>}
                    {w.exercises?.length > 0 && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{w.exercises.length} exercises</span>}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.875rem', color: '#9ca3af' }}>{new Date(w.date).toLocaleDateString()}</span>
                <button onClick={() => handleEdit(w)} style={{ fontSize: '0.75rem', color: '#1d4ed8', background: 'none', border: '1px solid #93c5fd', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(w._id)} style={{ fontSize: '0.75rem', color: '#dc2626', background: 'none', border: '1px solid #fca5a5', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > 10 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: page === 1 ? 'not-allowed' : 'pointer', backgroundColor: 'white', opacity: page === 1 ? 0.5 : 1 }}>Prev</button>
          <span style={{ padding: '0.5rem 1rem', color: '#374151' }}>Page {page} of {Math.ceil(total / 10)}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)} style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', cursor: page >= Math.ceil(total / 10) ? 'not-allowed' : 'pointer', backgroundColor: 'white', opacity: page >= Math.ceil(total / 10) ? 0.5 : 1 }}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Workouts;
