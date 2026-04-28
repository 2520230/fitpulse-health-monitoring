import { Response } from 'express';
import Goal from '../models/Goal';
import { AuthRequest } from '../middleware/auth';

export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const filter: Record<string, unknown> = { user: req.userId };
    if (status) filter.status = status;
    const goals = await Goal.find(filter).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const createGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.create({ ...req.body, user: req.userId });
    res.status(201).json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    // Auto-complete if target reached
    if (goal.currentValue >= goal.targetValue && goal.status === 'active') {
      goal.status = 'completed';
      await goal.save();
    }
    res.json(goal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!goal) {
      res.status(404).json({ message: 'Goal not found' });
      return;
    }
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};

export const getGoalProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const goals = await Goal.find({ user: req.userId, status: 'active' });
    const progress = goals.map((goal) => ({
      id: goal._id,
      title: goal.title,
      type: goal.type,
      targetValue: goal.targetValue,
      currentValue: goal.currentValue,
      unit: goal.unit,
      percentComplete: Math.min(
        Math.round((goal.currentValue / goal.targetValue) * 100),
        100
      ),
      daysRemaining: Math.max(
        0,
        Math.ceil(
          (new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
      ),
      status: goal.status,
    }));
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
};
