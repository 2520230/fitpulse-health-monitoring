export interface User {
  id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  fitnessGoal?: string;
  fitnessLevel?: string;
}

export interface Exercise {
  name: string;
  duration?: number;
  sets?: number;
  reps?: number;
  weight?: number;
  caloriesBurned?: number;
}

export interface Workout {
  _id: string;
  title: string;
  type: string;
  exercises: Exercise[];
  totalDuration: number;
  totalCaloriesBurned: number;
  notes?: string;
  date: string;
}

export interface HealthMetric {
  _id?: string;
  date: string;
  heartRate?: number;
  steps?: number;
  caloriesBurned?: number;
  caloriesConsumed?: number;
  weight?: number;
  sleepHours?: number;
  waterIntake?: number;
  activityLevel?: string;
}

export interface Goal {
  _id: string;
  title: string;
  type: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  targetDate: string;
  status: 'active' | 'completed' | 'abandoned';
  notes?: string;
}

export interface GoalProgress {
  id: string;
  title: string;
  type: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  percentComplete: number;
  daysRemaining: number;
  status: string;
}

export interface WorkoutPlan {
  _id: string;
  title: string;
  description: string;
  level: string;
  durationWeeks: number;
  daysPerWeek: number;
  category: string;
  isDefault: boolean;
  days?: PlanDay[];
}

export interface PlanDay {
  dayNumber: number;
  title: string;
  isRestDay: boolean;
  exercises: PlanExercise[];
}

export interface PlanExercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number;
  restSeconds?: number;
  description?: string;
}

export interface WeeklyStats {
  summary: {
    workoutCount: number;
    totalCaloriesBurned: number;
    totalDuration: number;
    totalSteps: number;
    avgHeartRate: number | null;
  };
  daily: { date: string; calories: number; duration: number; steps: number }[];
}

export interface MonthlyStats {
  summary: {
    workoutCount: number;
    totalCaloriesBurned: number;
    totalDuration: number;
    totalSteps: number;
  };
  weekly: { week: string; calories: number; duration: number; workouts: number }[];
}
