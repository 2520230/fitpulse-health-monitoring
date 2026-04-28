import mongoose, { Document, Schema } from 'mongoose';

export interface IGoal extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  type: 'weight_loss' | 'weight_gain' | 'muscle_gain' | 'endurance' | 'steps' | 'custom';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  targetDate: Date;
  status: 'active' | 'completed' | 'abandoned';
  notes?: string;
}

const GoalSchema = new Schema<IGoal>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'endurance', 'steps', 'custom'],
      required: true,
    },
    targetValue: { type: Number, required: true },
    currentValue: { type: Number, default: 0 },
    unit: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

GoalSchema.index({ user: 1, status: 1 });

export default mongoose.model<IGoal>('Goal', GoalSchema);
