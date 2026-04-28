import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { authService } from '../services';
import { User } from '../types';

const card = { backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '1.5rem' };
const inputStyle = { width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', fontSize: '0.875rem', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block', fontSize: '0.875rem', fontWeight: '500' as const, color: '#374151', marginBottom: '0.25rem' };

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    age: user?.age?.toString() || '',
    gender: user?.gender || '',
    weight: user?.weight?.toString() || '',
    height: user?.height?.toString() || '',
    fitnessGoal: user?.fitnessGoal || '',
    fitnessLevel: user?.fitnessLevel || 'beginner',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await authService.updateProfile({
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender || undefined,
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
        fitnessGoal: form.fitnessGoal || undefined,
        fitnessLevel: form.fitnessLevel || undefined,
      } as Partial<User>);
      updateUser(updated);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setChangingPw(true);
    try {
      await authService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setSuccess('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  const bmi = form.weight && form.height
    ? (Number(form.weight) / Math.pow(Number(form.height) / 100, 2)).toFixed(1)
    : null;

  const bmiCategory = (b: number) => {
    if (b < 18.5) return { label: 'Underweight', color: '#3b82f6' };
    if (b < 25) return { label: 'Normal weight', color: '#10b981' };
    if (b < 30) return { label: 'Overweight', color: '#f59e0b' };
    return { label: 'Obese', color: '#ef4444' };
  };

  const bmiNum = bmi ? parseFloat(bmi) : null;
  const bmiInfo = bmiNum ? bmiCategory(bmiNum) : null;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#111827' }}>👤 Profile</h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Manage your personal information</p>
      </div>

      {/* Profile summary card */}
      <div style={{ ...card, marginBottom: '1.5rem', background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{user?.name}</h2>
            <p style={{ opacity: 0.8 }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {user?.fitnessLevel && <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', textTransform: 'capitalize' }}>{user.fitnessLevel}</span>}
              {user?.fitnessGoal && <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem', textTransform: 'capitalize' }}>{user.fitnessGoal?.replace('_', ' ')}</span>}
              {bmi && bmiInfo && <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.125rem 0.5rem', borderRadius: '9999px', fontSize: '0.75rem' }}>BMI: {bmi} ({bmiInfo.label})</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['profile', 'password'] as const).map((tab) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.375rem', border: '1px solid #d1d5db', backgroundColor: activeTab === tab ? '#1d4ed8' : 'white', color: activeTab === tab ? 'white' : '#374151', cursor: 'pointer', fontWeight: '500', textTransform: 'capitalize' }}>
            {tab === 'profile' ? '✏️ Edit Profile' : '🔒 Change Password'}
          </button>
        ))}
      </div>

      {success && <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#16a34a', fontSize: '0.875rem' }}>{success}</div>}
      {error && <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>{error}</div>}

      {activeTab === 'profile' && (
        <div style={card}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>Personal Information</h2>
          <form onSubmit={handleProfileSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} required />
              </div>
              <div>
                <label style={labelStyle}>Age</label>
                <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} style={inputStyle} placeholder="25" min="10" max="120" />
              </div>
              <div>
                <label style={labelStyle}>Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} style={inputStyle}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Weight (kg)</label>
                <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} style={inputStyle} placeholder="70" step="0.1" min="20" max="500" />
              </div>
              <div>
                <label style={labelStyle}>Height (cm)</label>
                <input type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} style={inputStyle} placeholder="175" min="50" max="300" />
              </div>
              <div>
                <label style={labelStyle}>Fitness Goal</label>
                <select value={form.fitnessGoal} onChange={(e) => setForm({ ...form, fitnessGoal: e.target.value })} style={inputStyle}>
                  <option value="">Select goal</option>
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="endurance">Endurance</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Fitness Level</label>
                <select value={form.fitnessLevel} onChange={(e) => setForm({ ...form, fitnessLevel: e.target.value })} style={inputStyle}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            {bmi && bmiInfo && (
              <div style={{ padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.875rem', color: '#374151' }}>
                  BMI Calculation: <strong style={{ color: bmiInfo.color }}>{bmi} – {bmiInfo.label}</strong>
                </p>
                <div style={{ height: '6px', backgroundColor: '#e5e7eb', borderRadius: '9999px', marginTop: '0.5rem', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min((bmiNum! / 40) * 100, 100)}%`, backgroundColor: bmiInfo.color, borderRadius: '9999px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                  <span>Underweight (&lt;18.5)</span><span>Normal (18.5-25)</span><span>Overweight (25-30)</span><span>Obese (&gt;30)</span>
                </div>
              </div>
            )}
            <button type="submit" disabled={saving} style={{ backgroundColor: saving ? '#93c5fd' : '#1d4ed8', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: '500' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'password' && (
        <div style={card}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>Change Password</h2>
          <form onSubmit={handlePasswordChange} style={{ maxWidth: '400px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Current Password</label>
              <input type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required style={inputStyle} placeholder="••••••••" />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>New Password</label>
              <input type="password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required style={inputStyle} placeholder="Min 6 characters" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={labelStyle}>Confirm New Password</label>
              <input type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required style={inputStyle} placeholder="Repeat new password" />
            </div>
            <button type="submit" disabled={changingPw} style={{ backgroundColor: changingPw ? '#93c5fd' : '#1d4ed8', color: 'white', padding: '0.625rem 1.5rem', borderRadius: '0.375rem', border: 'none', cursor: changingPw ? 'not-allowed' : 'pointer', fontWeight: '500' }}>
              {changingPw ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
