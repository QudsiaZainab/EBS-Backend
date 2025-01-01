import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js';
import 'dotenv/config'
import authRouter from './routes/authRoutes.js';
import eventRouter from './routes/eventRoutes.js';


// app config
const app = express()
const port = 4000

// middleware
app.use(express.json());
app.use(cors({ origin: 'http://127.0.0.1:5500/backend/test.html' }));
app.use('/uploads', express.static('uploads'));


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