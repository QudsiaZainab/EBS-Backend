import Event from '../models/Event.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// Controller for creating an event
const createEvent = async (req, res) => {
  // Image file is handled by multer middleware before reaching this point
  const { title, description, location, date,  capacity } = req.body;

  // Check if image exists 
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const event = new Event({
      title,
      description,
      location,
      date,
      capacity,
      image: imageUrl, 
    });

    // Save event to the database
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
};


  
  
const getUpcomingEvents = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  // Get the current local date (server's local time)
  const currentDate = new Date();

  const currentDateISO = currentDate.toISOString(); 

  try {
    // Fetch events with eventDate greater than or equal to current local date, sorted by date ascending
    const events = await Event.find({ date: { $gte: currentDateISO } })
      .sort({ date: 1 })  // Sort by date in ascending order
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    // Count only upcoming events
    const total = await Event.countDocuments({ date: { $gte: currentDateISO } });

    res.status(200).json({
      message: 'Upcoming events fetched successfully',
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      events,
    });
  } catch (err) {
    console.error("Error fetching events:", err); // Log error for debugging
    res.status(500).json({ message: 'Error fetching events', error: err.message });
  }
};








  

  
const bookSeat = async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user.userId;  // Get userId from the authenticated token

  try {
      const event = await Event.findById(eventId);
      const user = await User.findById(userId);

      if (!event || !user) {
          return res.status(404).json({ message: 'Event or User not found' });
      }

      if (event.bookedSeats >= event.capacity) {
          return res.status(400).json({ message: 'Seats are fully booked' });
      }

      if (event.bookedUsers.includes(userId)) {
          return res.status(400).json({ message: 'User has already booked this event' });
      }

      // Update event
      event.bookedSeats += 1;
      event.bookedUsers.push(userId);
      await event.save();

      // Update user
      user.bookedEvents.push(eventId);
      await user.save();

      // Prepare email
      const transporter = nodemailer.createTransport({
          service: 'gmail', 
          auth: {
              user: process.env.EMAIL, 
              pass: process.env.EMAIL_PASSWORD, 
          },
          secure: true, // Use secure connection
          port: 465, // Port for secure connection
      });

      const mailOptions = {
          from: process.env.EMAIL,
          to: user.email,
          subject: `Seat Booked Successfully for ${event.title}`,
          text: `Hello ${user.username},\n\nYour seat for the event "${event.title}" has been successfully booked.\n\nEvent Details:\nDate: ${event.date}\nTime: ${event.time}\nLocation: ${event.location}\n\nThank you for booking with us!\n\nBest regards,\nEvent Booking Team`,
      };

      // Send email
      await transporter.sendMail(mailOptions);

      // Return success response
      res.status(200).json({ message: 'Seat booked successfully, and email sent', event });
  } catch (err) {
      res.status(500).json({ message: 'Error booking seat', error: err.message });
  }
};


 const getEventDetails = async (req, res) => {
    const { id } = req.params;
  
    try {
      const event = await Event.findById(id);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json({ event });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching event details', error: error.message });
    }
  };


export { createEvent, getUpcomingEvents, bookSeat, getEventDetails  };
