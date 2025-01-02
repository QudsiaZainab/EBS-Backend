import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import 'dotenv/config';
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import { Server } from 'socket.io';
import http from 'http';

// App configuration
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "https://ebs-4rqt.onrender.com",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);

app.get('/', (req, res) => {
  res.send('API Working');
});

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "https://ebs-4rqt.onrender.com",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

// Export the Socket.IO instance for use in other files
export { io };
