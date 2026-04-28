import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import workoutRoutes from './routes/workouts';
import metricsRoutes from './routes/metrics';
import goalsRoutes from './routes/goals';
import statsRoutes from './routes/stats';
import plansRoutes from './routes/plans';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/plans', plansRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'FitPulse API is running' });
});

// Error handler
app.use(errorHandler);

// Socket.io for notifications
io.on('connection', (socket) => {
  socket.on('join', (userId: string) => {
    socket.join(userId);
  });
  socket.on('disconnect', () => {});
});

export { io };

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitpulse';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    httpServer.listen(PORT, () => {
      console.log(`FitPulse server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
