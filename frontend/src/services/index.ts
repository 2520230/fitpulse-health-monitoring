import api from './api';
import { User } from '../types';

export const authService = {
  register: async (data: {
    name: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    fitnessGoal?: string;
    fitnessLevel?: string;
  }) => {
    const res = await api.post('/auth/register', data);
    return res.data as { token: string; user: User };
  },

  login: async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data as { token: string; user: User };
  },

  getProfile: async () => {
    const res = await api.get('/auth/profile');
    return res.data as User;
  },

  updateProfile: async (data: Partial<User>) => {
    const res = await api.put('/auth/profile', data);
    return res.data as User;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await api.put('/auth/password', { currentPassword, newPassword });
    return res.data;
  },
};

export const workoutService = {
  getAll: async (page = 1, limit = 10, type?: string) => {
    const params: Record<string, unknown> = { page, limit };
    if (type) params.type = type;
    const res = await api.get('/workouts', { params });
    return res.data;
  },

  create: async (data: object) => {
    const res = await api.post('/workouts', data);
    return res.data;
  },

  update: async (id: string, data: object) => {
    const res = await api.put(`/workouts/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/workouts/${id}`);
    return res.data;
  },

  getHistory: async (startDate?: string, endDate?: string) => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const res = await api.get('/workouts/history', { params });
    return res.data;
  },
};

export const metricsService = {
  getDashboard: async () => {
    const res = await api.get('/metrics/dashboard');
    return res.data;
  },

  logHeartRate: async (heartRate: number) => {
    const res = await api.post('/metrics/heart-rate', { heartRate });
    return res.data;
  },

  logSteps: async (steps: number) => {
    const res = await api.post('/metrics/steps', { steps });
    return res.data;
  },

  getDailyMetrics: async (date?: string) => {
    const res = await api.get('/metrics/daily', { params: date ? { date } : {} });
    return res.data;
  },

  logDailyMetrics: async (data: object) => {
    const res = await api.post('/metrics/daily', data);
    return res.data;
  },
};

export const goalsService = {
  getAll: async (status?: string) => {
    const res = await api.get('/goals', { params: status ? { status } : {} });
    return res.data;
  },

  create: async (data: object) => {
    const res = await api.post('/goals', data);
    return res.data;
  },

  update: async (id: string, data: object) => {
    const res = await api.put(`/goals/${id}`, data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
  },

  getProgress: async () => {
    const res = await api.get('/goals/progress');
    return res.data;
  },
};

export const statsService = {
  getWeekly: async () => {
    const res = await api.get('/stats/weekly');
    return res.data;
  },

  getMonthly: async () => {
    const res = await api.get('/stats/monthly');
    return res.data;
  },

  getOverall: async () => {
    const res = await api.get('/stats/overall');
    return res.data;
  },
};

export const plansService = {
  getAll: async (level?: string, category?: string) => {
    const params: Record<string, string> = {};
    if (level) params.level = level;
    if (category) params.category = category;
    const res = await api.get('/plans', { params });
    return res.data;
  },

  getById: async (id: string) => {
    const res = await api.get(`/plans/${id}`);
    return res.data;
  },

  create: async (data: object) => {
    const res = await api.post('/plans', data);
    return res.data;
  },

  delete: async (id: string) => {
    const res = await api.delete(`/plans/${id}`);
    return res.data;
  },
};
