import { Response } from 'express';
import Workout from '../models/Workout';
import { AuthRequest } from '../middleware/auth';

export const getWorkouts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, type } = req.query;
    const filter: Record<string, unknown> = { user: req.userId };
    if (type) filter.type = type;
    const workouts = await Workout.find(filter)
      .sort({ date: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    const total = await Workout.countDocuments(filter);
    res.json({ workouts, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const createWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await Workout.create({ ...req.body, user: req.userId });
    res.status(201).json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const getWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.userId });
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const updateWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const deleteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!workout) {
      res.status(404).json({ message: 'Workout not found' });
      return;
    }
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const getWorkoutHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    const filter: Record<string, unknown> = { user: req.userId };
    if (startDate || endDate) {
      const dateFilter: Record<string, Date> = {};
      if (startDate) dateFilter.$gte = new Date(startDate as string);
      if (endDate) dateFilter.$lte = new Date(endDate as string);
      filter.date = dateFilter;
    }
    const workouts = await Workout.find(filter).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
