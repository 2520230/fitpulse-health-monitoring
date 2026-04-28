import mongoose, { Document, Schema } from 'mongoose';

export interface IPlanExercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restSeconds?: number;
  description?: string;
}

export interface IPlanDay {
  dayNumber: number;
  title: string;
  isRestDay: boolean;
  exercises: IPlanExercise[];
}

export interface IWorkoutPlan extends Document {
  user?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  daysPerWeek: number;
  days: IPlanDay[];
  isDefault: boolean;
  category: 'strength' | 'cardio' | 'flexibility' | 'weight_loss' | 'muscle_gain' | 'general';
}

const PlanExerciseSchema = new Schema<IPlanExercise>({
  name: { type: String, required: true },
  sets: Number,
  reps: Number,
  duration: Number,
  restSeconds: Number,
  description: String,
});

const PlanDaySchema = new Schema<IPlanDay>({
  dayNumber: { type: Number, required: true },
  title: { type: String, required: true },
  isRestDay: { type: Boolean, default: false },
  exercises: [PlanExerciseSchema],
});

const WorkoutPlanSchema = new Schema<IWorkoutPlan>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    durationWeeks: { type: Number, required: true },
    daysPerWeek: { type: Number, required: true },
    days: [PlanDaySchema],
    isDefault: { type: Boolean, default: false },
    category: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'weight_loss', 'muscle_gain', 'general'],
      default: 'general',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IWorkoutPlan>('WorkoutPlan', WorkoutPlanSchema);
