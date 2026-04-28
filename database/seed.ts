import mongoose from 'mongoose';
import dotenv from 'dotenv';
import WorkoutPlan from '../backend/src/models/WorkoutPlan';

dotenv.config({ path: '../backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitpulse';

const plans = [
  {
    title: 'Beginner Full Body Workout',
    description: 'A 4-week program for fitness beginners. Build foundational strength and improve cardiovascular fitness with simple, effective exercises.',
    level: 'beginner',
    durationWeeks: 4,
    daysPerWeek: 3,
    category: 'general',
    isDefault: true,
    days: [
      {
        dayNumber: 1,
        title: 'Full Body Day A',
        isRestDay: false,
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: 12, restSeconds: 60, description: 'Stand with feet shoulder-width apart, lower until thighs are parallel to floor' },
          { name: 'Push-ups', sets: 3, reps: 10, restSeconds: 60, description: 'Keep body straight, lower chest to floor' },
          { name: 'Dumbbell Rows', sets: 3, reps: 10, restSeconds: 60, description: 'Bend over, row dumbbell to hip' },
          { name: 'Plank', sets: 3, duration: 30, restSeconds: 60, description: 'Hold straight body position' },
          { name: 'Walking', duration: 20, description: 'Brisk walking to cool down' },
        ],
      },
      { dayNumber: 2, title: 'Rest Day', isRestDay: true, exercises: [] },
      {
        dayNumber: 3,
        title: 'Full Body Day B',
        isRestDay: false,
        exercises: [
          { name: 'Lunges', sets: 3, reps: 10, restSeconds: 60, description: 'Alternate legs, lower knee to ground' },
          { name: 'Dumbbell Shoulder Press', sets: 3, reps: 10, restSeconds: 60 },
          { name: 'Lat Pulldowns', sets: 3, reps: 12, restSeconds: 60 },
          { name: 'Bicycle Crunches', sets: 3, reps: 15, restSeconds: 45 },
          { name: 'Jump Rope', duration: 10, description: 'Light cardio finisher' },
        ],
      },
      { dayNumber: 4, title: 'Rest Day', isRestDay: true, exercises: [] },
      {
        dayNumber: 5,
        title: 'Full Body Day A (Repeat)',
        isRestDay: false,
        exercises: [
          { name: 'Bodyweight Squats', sets: 3, reps: 15 },
          { name: 'Push-ups', sets: 3, reps: 12 },
          { name: 'Dumbbell Rows', sets: 3, reps: 12 },
          { name: 'Plank', sets: 3, duration: 40 },
        ],
      },
      { dayNumber: 6, title: 'Rest Day', isRestDay: true, exercises: [] },
      { dayNumber: 7, title: 'Rest Day', isRestDay: true, exercises: [] },
    ],
  },
  {
    title: 'Intermediate Strength Builder',
    description: 'A 6-week program to build strength and muscle. Uses progressive overload with compound movements and accessory work.',
    level: 'intermediate',
    durationWeeks: 6,
    daysPerWeek: 4,
    category: 'strength',
    isDefault: true,
    days: [
      {
        dayNumber: 1,
        title: 'Push Day (Chest / Shoulders / Triceps)',
        isRestDay: false,
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 8 },
          { name: 'Overhead Press', sets: 3, reps: 10 },
          { name: 'Incline Dumbbell Press', sets: 3, reps: 10 },
          { name: 'Lateral Raises', sets: 3, reps: 15 },
          { name: 'Tricep Dips', sets: 3, reps: 12 },
        ],
      },
      {
        dayNumber: 2,
        title: 'Pull Day (Back / Biceps)',
        isRestDay: false,
        exercises: [
          { name: 'Pull-ups', sets: 4, reps: 8 },
          { name: 'Barbell Rows', sets: 4, reps: 8 },
          { name: 'Seated Cable Rows', sets: 3, reps: 12 },
          { name: 'Face Pulls', sets: 3, reps: 15 },
          { name: 'Bicep Curls', sets: 3, reps: 12 },
        ],
      },
      { dayNumber: 3, title: 'Rest Day', isRestDay: true, exercises: [] },
      {
        dayNumber: 4,
        title: 'Legs Day',
        isRestDay: false,
        exercises: [
          { name: 'Barbell Squats', sets: 4, reps: 8 },
          { name: 'Romanian Deadlift', sets: 3, reps: 10 },
          { name: 'Leg Press', sets: 3, reps: 12 },
          { name: 'Leg Curls', sets: 3, reps: 12 },
          { name: 'Calf Raises', sets: 4, reps: 15 },
        ],
      },
      {
        dayNumber: 5,
        title: 'Upper Body Hypertrophy',
        isRestDay: false,
        exercises: [
          { name: 'Dumbbell Bench Press', sets: 4, reps: 12 },
          { name: 'Dumbbell Rows', sets: 4, reps: 12 },
          { name: 'Arnold Press', sets: 3, reps: 12 },
          { name: 'Hammer Curls', sets: 3, reps: 12 },
          { name: 'Skull Crushers', sets: 3, reps: 12 },
        ],
      },
      { dayNumber: 6, title: 'Rest Day', isRestDay: true, exercises: [] },
      { dayNumber: 7, title: 'Rest Day', isRestDay: true, exercises: [] },
    ],
  },
  {
    title: 'Couch to 5K Running Plan',
    description: 'A 9-week progressive running program designed to take complete beginners from couch to running 5km continuously.',
    level: 'beginner',
    durationWeeks: 9,
    daysPerWeek: 3,
    category: 'cardio',
    isDefault: true,
    days: [
      {
        dayNumber: 1,
        title: 'Week 1 – Walk/Run Intervals',
        isRestDay: false,
        exercises: [
          { name: 'Brisk Walk Warm-up', duration: 5, description: 'Brisk 5-minute walk' },
          { name: 'Run/Walk Intervals', duration: 20, description: 'Alternate 60 sec running and 90 sec walking for 20 min' },
          { name: 'Cool-down Walk', duration: 5, description: '5-minute cool-down walk' },
        ],
      },
      { dayNumber: 2, title: 'Rest or Cross-training', isRestDay: false, exercises: [{ name: 'Light Stretching or Cycling', duration: 20 }] },
      {
        dayNumber: 3,
        title: 'Week 2 – Extended Runs',
        isRestDay: false,
        exercises: [
          { name: 'Warm-up Walk', duration: 5 },
          { name: 'Run/Walk Intervals', duration: 25, description: 'Alternate 90 sec running and 2 min walking' },
          { name: 'Cool-down Walk', duration: 5 },
        ],
      },
      { dayNumber: 4, title: 'Rest Day', isRestDay: true, exercises: [] },
      {
        dayNumber: 5,
        title: 'Long Run Day',
        isRestDay: false,
        exercises: [
          { name: 'Warm-up Walk', duration: 5 },
          { name: 'Continuous Run (build up)', duration: 30, description: 'Aim for more continuous running each session' },
          { name: 'Cool-down Walk', duration: 5 },
        ],
      },
      { dayNumber: 6, title: 'Rest Day', isRestDay: true, exercises: [] },
      { dayNumber: 7, title: 'Rest Day', isRestDay: true, exercises: [] },
    ],
  },
  {
    title: 'Advanced HIIT Fat Burn',
    description: 'A high-intensity interval training program for experienced athletes. Maximize calorie burn and boost metabolism with intense circuits.',
    level: 'advanced',
    durationWeeks: 4,
    daysPerWeek: 5,
    category: 'weight_loss',
    isDefault: true,
    days: [
      {
        dayNumber: 1,
        title: 'Upper Body HIIT',
        isRestDay: false,
        exercises: [
          { name: 'Burpees', sets: 4, reps: 20, restSeconds: 30 },
          { name: 'Push-up Variations', sets: 4, reps: 20, restSeconds: 30 },
          { name: 'Mountain Climbers', sets: 4, duration: 45, restSeconds: 15 },
          { name: 'Jump Squats', sets: 4, reps: 20, restSeconds: 30 },
          { name: 'Battle Ropes', sets: 4, duration: 30, restSeconds: 30 },
        ],
      },
      {
        dayNumber: 2,
        title: 'Lower Body HIIT',
        isRestDay: false,
        exercises: [
          { name: 'Jump Lunges', sets: 4, reps: 20, restSeconds: 30 },
          { name: 'Box Jumps', sets: 4, reps: 15, restSeconds: 30 },
          { name: 'Squat Jumps', sets: 4, reps: 20, restSeconds: 30 },
          { name: 'Sprint Intervals', duration: 30, sets: 8, restSeconds: 30 },
          { name: 'High Knees', sets: 4, duration: 45, restSeconds: 15 },
        ],
      },
      { dayNumber: 3, title: 'Active Recovery', isRestDay: false, exercises: [{ name: 'Yoga / Foam Rolling / Stretching', duration: 30 }] },
      {
        dayNumber: 4,
        title: 'Full Body Circuit',
        isRestDay: false,
        exercises: [
          { name: 'Kettlebell Swings', sets: 5, reps: 20, restSeconds: 20 },
          { name: 'Pull-ups', sets: 5, reps: 10, restSeconds: 20 },
          { name: 'Dumbbell Thrusters', sets: 5, reps: 15, restSeconds: 20 },
          { name: 'Box Step-ups', sets: 5, reps: 20, restSeconds: 20 },
        ],
      },
      {
        dayNumber: 5,
        title: 'Cardio Finisher',
        isRestDay: false,
        exercises: [
          { name: 'Warm-up Jog', duration: 5 },
          { name: 'Tempo Run', duration: 25, description: '5 min easy, 15 min tempo, 5 min easy' },
          { name: 'Abs Circuit', sets: 3, reps: 20, duration: 10 },
        ],
      },
      { dayNumber: 6, title: 'Rest Day', isRestDay: true, exercises: [] },
      { dayNumber: 7, title: 'Rest Day', isRestDay: true, exercises: [] },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await WorkoutPlan.countDocuments({ isDefault: true });
    if (existing > 0) {
      console.log(`${existing} default plans already exist. Skipping seed.`);
    } else {
      await WorkoutPlan.insertMany(plans);
      console.log(`Seeded ${plans.length} default workout plans`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDatabase();
