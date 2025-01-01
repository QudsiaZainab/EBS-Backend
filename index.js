import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import 'dotenv/config';
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

// DB connection
connectDB();

// Use authentication routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);

// Root route
app.get("/", (req, res) => {
    res.send("API Working");
});

// Export app for Vercel to handle serverless
export default app;