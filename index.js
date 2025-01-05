import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';
import 'dotenv/config'
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';
// import Pusher from 'pusher';
// import http from 'http';
// import { Server } from 'socket.io';

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

// const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: "https://ebs-4rqt.onrender.com",
//         methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
//     }
// });

//db connection
connectDB();


// Use authentication routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventRouter);

// WebSocket Logic
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('seatBooked', (data) => {
//         io.emit('updateSeats', data);  // Emit update to all connected clients
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });

// // Export io for direct access in other files
// export { io };

// const pusher = new Pusher({
//     appId: process.env.PUSHER_APP_ID,
//     key: process.env.PUSHER_KEY,
//     secret: process.env.PUSHER_SECRET,
//     cluster: process.env.PUSHER_CLUSTER,
//     useTLS: true
// });

app.get("/", (req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`);
})

// export { pusher };