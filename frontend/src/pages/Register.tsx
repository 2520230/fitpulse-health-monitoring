import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services';
import { useAuth } from '../store/AuthContext';

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.375rem',
  fontSize: '0.875rem',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const labelStyle = {
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: '500' as const,
  color: '#374151',
  marginBottom: '0.25rem',
};

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    age: '', gender: '', weight: '', height: '',
    fitnessGoal: '', fitnessLevel: 'beginner',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const data = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender || undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        fitnessGoal: formData.fitnessGoal || undefined,
        fitnessLevel: formData.fitnessLevel || undefined,
      });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 4px 6px rgba(0,0,0,0.07)', padding: '2rem', width: '100%', maxWidth: '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1d4ed8' }}>⚡ FitPulse</h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Start your fitness journey</p>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>Create Account</h2>
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '0.375rem', padding: '0.75rem', marginBottom: '1rem', color: '#dc2626', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="John Doe" />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
            </div>
            <div>
              <label style={labelStyle}>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required style={inputStyle} placeholder="Min 6 characters" />
            </div>
            <div>
              <label style={labelStyle}>Confirm Password *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={inputStyle} placeholder="Repeat password" />
            </div>
            <div>
              <label style={labelStyle}>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} style={inputStyle} placeholder="25" min="10" max="120" />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} style={inputStyle} placeholder="70" min="20" max="500" />
            </div>
            <div>
              <label style={labelStyle}>Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} style={inputStyle} placeholder="175" min="50" max="300" />
            </div>
            <div>
              <label style={labelStyle}>Fitness Goal</label>
              <select name="fitnessGoal" value={formData.fitnessGoal} onChange={handleChange} style={inputStyle}>
                <option value="">Select goal</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fitness Level</label>
              <select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} style={inputStyle}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', backgroundColor: loading ? '#93c5fd' : '#1d4ed8', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '1rem' }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1d4ed8', fontWeight: '500', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
