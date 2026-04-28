import { Response } from 'express';
import Workout from '../models/Workout';
import HealthMetric from '../models/HealthMetric';
import { AuthRequest } from '../middleware/auth';

const getDateRange = (type: 'weekly' | 'monthly') => {
  const end = new Date();
  const start = new Date();
  if (type === 'weekly') {
    start.setDate(start.getDate() - 7);
  } else {
    start.setMonth(start.getMonth() - 1);
  }
  return { start, end };
};

export const getWeeklyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { start, end } = getDateRange('weekly');
    const [workouts, metrics] = await Promise.all([
      Workout.find({ user: req.userId, date: { $gte: start, $lte: end } }),
      HealthMetric.find({ user: req.userId, date: { $gte: start, $lte: end } }),
    ]);

    const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.totalCaloriesBurned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.totalDuration || 0), 0);
    const totalSteps = metrics.reduce((sum, m) => sum + (m.steps || 0), 0);
    const avgHeartRate =
      metrics.filter((m) => m.heartRate).length > 0
        ? Math.round(
            metrics.filter((m) => m.heartRate).reduce((sum, m) => sum + (m.heartRate || 0), 0) /
              metrics.filter((m) => m.heartRate).length
          )
        : null;

    // Daily breakdown
    const dailyData: Record<string, { calories: number; duration: number; steps: number }> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split('T')[0];
      dailyData[key] = { calories: 0, duration: 0, steps: 0 };
    }
    workouts.forEach((w) => {
      const key = new Date(w.date).toISOString().split('T')[0];
      if (dailyData[key]) {
        dailyData[key].calories += w.totalCaloriesBurned || 0;
        dailyData[key].duration += w.totalDuration || 0;
      }
    });
    metrics.forEach((m) => {
      const key = new Date(m.date).toISOString().split('T')[0];
      if (dailyData[key]) {
        dailyData[key].steps += m.steps || 0;
      }
    });

    res.json({
      summary: {
        workoutCount: workouts.length,
        totalCaloriesBurned,
        totalDuration,
        totalSteps,
        avgHeartRate,
      },
      daily: Object.entries(dailyData).map(([date, data]) => ({ date, ...data })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const getMonthlyStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { start, end } = getDateRange('monthly');
    const [workouts, metrics] = await Promise.all([
      Workout.find({ user: req.userId, date: { $gte: start, $lte: end } }),
      HealthMetric.find({ user: req.userId, date: { $gte: start, $lte: end } }),
    ]);

    const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.totalCaloriesBurned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.totalDuration || 0), 0);
    const totalSteps = metrics.reduce((sum, m) => sum + (m.steps || 0), 0);

    // Weekly breakdown
    const weeklyData: Record<number, { calories: number; duration: number; workouts: number }> = {};
    for (let w = 1; w <= 5; w++) weeklyData[w] = { calories: 0, duration: 0, workouts: 0 };
    workouts.forEach((workout) => {
      const weekNum = Math.ceil(
        (new Date(workout.date).getDate()) / 7
      );
      if (weeklyData[weekNum]) {
        weeklyData[weekNum].calories += workout.totalCaloriesBurned || 0;
        weeklyData[weekNum].duration += workout.totalDuration || 0;
        weeklyData[weekNum].workouts++;
      }
    });

    res.json({
      summary: {
        workoutCount: workouts.length,
        totalCaloriesBurned,
        totalDuration,
        totalSteps,
      },
      weekly: Object.entries(weeklyData).map(([week, data]) => ({
        week: `Week ${week}`,
        ...data,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const getOverallStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [workouts, metrics] = await Promise.all([
      Workout.find({ user: req.userId }),
      HealthMetric.find({ user: req.userId }),
    ]);

    const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.totalCaloriesBurned || 0), 0);
    const totalDuration = workouts.reduce((sum, w) => sum + (w.totalDuration || 0), 0);
    const totalSteps = metrics.reduce((sum, m) => sum + (m.steps || 0), 0);

    const typeBreakdown: Record<string, number> = {};
    workouts.forEach((w) => {
      typeBreakdown[w.type] = (typeBreakdown[w.type] || 0) + 1;
    });

    const weightHistory = metrics
      .filter((m) => m.weight)
      .map((m) => ({ date: m.date, weight: m.weight }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.json({
      totalWorkouts: workouts.length,
      totalCaloriesBurned,
      totalDuration,
      totalSteps,
      typeBreakdown,
      weightHistory,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
