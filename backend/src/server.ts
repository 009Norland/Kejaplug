import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import routes
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import userRoutes from './routes/users';
import notificationRoutes from './routes/notifications';
import landlordRoutes from './routes/landlord';
import applicationRoutes from './routes/applications';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json())

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kejaplug';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/applications', applicationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'KejaPlug API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
