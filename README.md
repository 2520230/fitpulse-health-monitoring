# ⚡ FitPulse – Personal Health & Workout Monitoring System

A full-stack web application to track your fitness activities, health metrics, and wellness goals.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Secure JWT-based register/login with bcrypt password hashing |
| 👤 **User Profiles** | Age, gender, weight, height, fitness goal, fitness level |
| 💪 **Workout Tracking** | Log exercises with sets/reps/weight, duration, calories; edit/delete history |
| ❤️ **Health Metrics** | Daily logging of heart rate, steps, calories, weight, sleep, water intake |
| 📊 **BMI Calculator** | Auto-calculated from profile weight and height with category label |
| 🎯 **Goals** | Set fitness goals (weight loss, muscle gain, steps…), track progress visually |
| 📋 **Workout Plans** | Pre-built beginner/intermediate/advanced plans, custom plan creation |
| 📈 **Statistics** | Weekly/monthly/overall charts (Recharts) for calories, steps, weight history |
| 🏠 **Dashboard** | Overview of today's metrics, recent workouts, active goal progress, quick actions |

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 · TypeScript · React Router v6 · Recharts |
| Backend | Node.js · Express 4 · TypeScript |
| Database | MongoDB · Mongoose ODM |
| Auth | JSON Web Tokens · bcryptjs |
| Real-time | Socket.io (notifications scaffold) |
| Styling | Inline CSS with consistent design system |

## 📁 Project Structure

```
fitpulse-health-monitoring/
├── backend/
│   ├── src/
│   │   ├── controllers/    # authController, workoutController, metricsController,
│   │   │                   # goalsController, statsController, plansController
│   │   ├── middleware/     # auth.ts (JWT), errorHandler.ts
│   │   ├── models/         # User, Workout, HealthMetric, Goal, WorkoutPlan
│   │   ├── routes/         # auth, workouts, metrics, goals, stats, plans
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/layout/   # Navbar, Layout
│   │   ├── pages/               # Dashboard, Login, Register, Workouts,
│   │   │                        # HealthMetrics, Goals, WorkoutPlans,
│   │   │                        # Statistics, Profile
│   │   ├── services/            # api.ts (axios), index.ts (service wrappers)
│   │   ├── store/               # AuthContext (React Context + localStorage)
│   │   └── types/               # Shared TypeScript interfaces
│   └── package.json
├── database/
│   └── seed.ts      # Seed default workout plans
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone & Install

```bash
# Backend
cd backend
npm install
cp .env.example .env   # edit MONGODB_URI and JWT_SECRET

# Frontend
cd ../frontend
npm install
```

### 2. Start Backend

```bash
cd backend
npm run dev          # development with hot-reload
# or
npm run build && npm start   # production
```

The API will be available at `http://localhost:5000`.

### 3. Seed Default Workout Plans (optional)

```bash
cd database
ts-node seed.ts
```

### 4. Start Frontend

```bash
cd frontend
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables (backend/.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitpulse
JWT_SECRET=your-strong-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login |
| GET | `/api/auth/profile` | Yes | Get profile |
| PUT | `/api/auth/profile` | Yes | Update profile |
| PUT | `/api/auth/password` | Yes | Change password |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workouts` | List workouts (paginated, filterable by type) |
| POST | `/api/workouts` | Log new workout |
| GET | `/api/workouts/:id` | Get workout |
| PUT | `/api/workouts/:id` | Update workout |
| DELETE | `/api/workouts/:id` | Delete workout |
| GET | `/api/workouts/history` | Full history (date range filter) |

### Health Metrics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/metrics/dashboard` | Today's overview + recent workouts + BMI |
| POST | `/api/metrics/heart-rate` | Log heart rate |
| POST | `/api/metrics/steps` | Log steps |
| GET | `/api/metrics/daily` | Get daily metrics |
| POST | `/api/metrics/daily` | Log/update daily metrics |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/goals` | List goals (filter by status) |
| POST | `/api/goals` | Create goal |
| PUT | `/api/goals/:id` | Update goal / progress |
| DELETE | `/api/goals/:id` | Delete goal |
| GET | `/api/goals/progress` | Active goals with % complete |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/weekly` | Last 7 days summary + daily breakdown |
| GET | `/api/stats/monthly` | Last 30 days summary + weekly breakdown |
| GET | `/api/stats/overall` | All-time totals, type breakdown, weight history |

### Workout Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/plans` | List plans (filter by level/category) |
| POST | `/api/plans` | Create custom plan |
| GET | `/api/plans/:id` | Get plan with full day details |
| PUT | `/api/plans/:id` | Update custom plan |
| DELETE | `/api/plans/:id` | Delete custom plan |

## 📸 Key Pages

- **Dashboard** – Today at a glance: vitals, BMI, recent workouts, goal progress, quick actions
- **Workouts** – Log exercises with sets/reps/weight, filter by type, pagination
- **Health Metrics** – Log and view all daily health indicators with BMI calculator
- **Goals** – Create goals, track progress bars, update current values
- **Workout Plans** – Browse pre-built plans (beginner→advanced) or create custom ones
- **Statistics** – Interactive bar/line charts for weekly, monthly, and overall progress
- **Profile** – Edit personal info, view dynamic BMI scale, change password
