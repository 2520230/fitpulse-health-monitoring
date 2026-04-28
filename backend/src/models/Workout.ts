import mongoose, { Document, Schema } from 'mongoose';

export interface IExercise {
  name: string;
  duration?: number;
  sets?: number;
  reps?: number;
  weight?: number;
  caloriesBurned?: number;
}

export interface IWorkout extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
  exercises: IExercise[];
  totalDuration: number;
  totalCaloriesBurned: number;
  notes?: string;
  date: Date;
}

const ExerciseSchema = new Schema<IExercise>({
  name: { type: String, required: true },
  duration: { type: Number },
  sets: { type: Number },
  reps: { type: Number },
  weight: { type: Number },
  caloriesBurned: { type: Number },
});

const WorkoutSchema = new Schema<IWorkout>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['cardio', 'strength', 'flexibility', 'sports', 'other'],
      required: true,
    },
    exercises: [ExerciseSchema],
    totalDuration: { type: Number, required: true, min: 0 },
    totalCaloriesBurned: { type: Number, default: 0 },
    notes: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

WorkoutSchema.index({ user: 1, date: -1 });

export default mongoose.model<IWorkout>('Workout', WorkoutSchema);
