import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthMetric extends Document {
  user: mongoose.Types.ObjectId;
  date: Date;
  heartRate?: number;
  steps?: number;
  caloriesBurned?: number;
  caloriesConsumed?: number;
  weight?: number;
  sleepHours?: number;
  waterIntake?: number;
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'intense';
}

const HealthMetricSchema = new Schema<IHealthMetric>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    heartRate: { type: Number, min: 30, max: 250 },
    steps: { type: Number, min: 0 },
    caloriesBurned: { type: Number, min: 0 },
    caloriesConsumed: { type: Number, min: 0 },
    weight: { type: Number, min: 20, max: 500 },
    sleepHours: { type: Number, min: 0, max: 24 },
    waterIntake: { type: Number, min: 0 },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'intense'],
    },
  },
  { timestamps: true }
);

HealthMetricSchema.index({ user: 1, date: -1 });

export default mongoose.model<IHealthMetric>('HealthMetric', HealthMetricSchema);
