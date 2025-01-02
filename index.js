import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';
import 'dotenv/config'
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';
import { Server } from 'socket.io';
import http from 'http';


// app config
const app = express()
const port = 4000

// middleware
app.use(express.json());
app.use(cors({
    origin: "https://ebs-4rqt.onrender.com",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));


//db connection
connectDB();


// Use authentication routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);



app.get("/", (req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
})

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

// Start Server
server.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

export { io }; // Export the instance to use in your controllers