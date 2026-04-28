import { Response } from 'express';
import WorkoutPlan from '../models/WorkoutPlan';
import { AuthRequest } from '../middleware/auth';

export const getPlans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { level, category } = req.query;
    const filter: Record<string, unknown> = {
      $or: [{ isDefault: true }, { user: req.userId }],
    };
    if (level) filter.level = level;
    if (category) filter.category = category;
    const plans = await WorkoutPlan.find(filter).select('-days');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const getPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const plan = await WorkoutPlan.findOne({
      _id: req.params.id,
      $or: [{ isDefault: true }, { user: req.userId }],
    });
    if (!plan) {
      res.status(404).json({ message: 'Plan not found' });
      return;
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const createPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const plan = await WorkoutPlan.create({ ...req.body, user: req.userId, isDefault: false });
    res.status(201).json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const updatePlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const plan = await WorkoutPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.userId, isDefault: false },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) {
      res.status(404).json({ message: 'Plan not found or not editable' });
      return;
    }
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const deletePlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const plan = await WorkoutPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
      isDefault: false,
    });
    if (!plan) {
      res.status(404).json({ message: 'Plan not found or not deletable' });
      return;
    }
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
