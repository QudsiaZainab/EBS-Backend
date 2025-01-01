import express from 'express';
import { createEvent, bookSeat, getUpcomingEvents, getEventDetails} from '../controllers/eventController.js';
import upload from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';

const eventRouter = express.Router();

// Middleware to add CORS headers for this router
eventRouter.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Frontend origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow cookies if needed
    if (req.method === 'OPTIONS') {
      return res.status(204).end(); // Handle preflight requests
    }
    next();
  });

// Route for creating an event
eventRouter.post('/create', upload.single('image'), createEvent);

// Route for booking a seat
eventRouter.post('/:eventId/book', authenticateToken, bookSeat);

eventRouter.get('/upcoming', getUpcomingEvents); 

eventRouter.get('/event-detail/:id', getEventDetails);

export default eventRouter;
