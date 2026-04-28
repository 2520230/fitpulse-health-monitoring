import { Response } from 'express';
import HealthMetric from '../models/HealthMetric';
import Workout from '../models/Workout';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayMetric, recentWorkouts, user] = await Promise.all([
      HealthMetric.findOne({ user: req.userId, date: { $gte: today, $lt: tomorrow } }).sort({
        createdAt: -1,
      }),
      Workout.find({ user: req.userId }).sort({ date: -1 }).limit(5),
      User.findById(req.userId).select('-password'),
    ]);

    // Calculate BMI
    let bmi = null;
    if (user?.weight && user?.height) {
      const heightM = user.height / 100;
      bmi = (user.weight / (heightM * heightM)).toFixed(1);
    }

    res.json({
      todayMetrics: todayMetric,
      recentWorkouts,
      bmi,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const logHeartRate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let metric = await HealthMetric.findOne({
      user: req.userId,
      date: { $gte: today, $lt: tomorrow },
    });
    if (metric) {
      metric.heartRate = req.body.heartRate;
      await metric.save();
    } else {
      metric = await HealthMetric.create({
        user: req.userId,
        heartRate: req.body.heartRate,
        date: new Date(),
      });
    }
    res.json(metric);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const logSteps = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let metric = await HealthMetric.findOne({
      user: req.userId,
      date: { $gte: today, $lt: tomorrow },
    });
    if (metric) {
      metric.steps = req.body.steps;
      await metric.save();
    } else {
      metric = await HealthMetric.create({
        user: req.userId,
        steps: req.body.steps,
        date: new Date(),
      });
    }
    res.json(metric);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const getDailyMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date as string) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const metric = await HealthMetric.findOne({
      user: req.userId,
      date: { $gte: targetDate, $lt: nextDay },
    });
    res.json(metric || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const logDailyMetrics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const metric = await HealthMetric.findOneAndUpdate(
      { user: req.userId, date: { $gte: today, $lt: tomorrow } },
      { ...req.body, user: req.userId },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(metric);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
