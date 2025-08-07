const asyncHandler = require('express-async-handler');
const Event = require('../models/Event');
const Club = require('../models/Club');

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Super_Admin_Admin
const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, time, venue, type, clubId, registrationDeadline, fee, poster } = req.body;

  if (type === 'club') {
    if (!clubId) {
      res.status(400);
      throw new Error('Club ID is required for club events');
    }
    const club = await Club.findById(clubId);
    if (!club) {
        res.status(404);
        throw new Error('Club not found');
    }
    if (req.user.role === 'admin' && club.coordinator.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to create events for this club');
    }
  }

  const event = new Event({
    title,
    description,
    date,
    time,
    venue,
    type,
    clubId: type === 'club' ? clubId : null,
    organizer: req.user._id,
    registrationDeadline,
    fee,
    poster,
  });

  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({}).populate('organizer', 'name').populate('clubId', 'name');
  res.json(events);
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate('organizer', 'name').populate('clubId', 'name');
  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Super_Admin_Admin
const updateEvent = asyncHandler(async (req, res) => {
  const { title, description, date, time, venue, registrationDeadline, fee, poster } = req.body;

  const event = await Event.findById(req.params.id);

  if (event) {
    if (req.user.role === 'admin') {
        const club = await Club.findById(event.clubId);
        if (!club || club.coordinator.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this event');
        }
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.time = time || event.time;
    event.venue = venue || event.venue;
    event.registrationDeadline = registrationDeadline || event.registrationDeadline;
    event.fee = fee || event.fee;
    event.poster = poster || event.poster;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Super_Admin_Admin
const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event) {
    if (req.user.role === 'admin') {
        const club = await Club.findById(event.clubId);
        if (!club || club.coordinator.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this event');
        }
    }
    await event.remove();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

// @desc    Register for an event
// @route   POST /api/events/:id/register
// @access  Private/Member
const registerForEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        if (event.registeredUsers.includes(req.user._id)) {
            res.status(400);
            throw new Error('Already registered for this event');
        }
        event.registeredUsers.push(req.user._id);
        await event.save();
        res.status(201).json({ message: 'Registered for event successfully' });
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

// @desc    Get event registrations
// @route   GET /api/events/:id/registrations
// @access  Private/Super_Admin_Admin
const getEventRegistrations = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate('registeredUsers', 'name email studentId');
    if (event) {
        if (req.user.role === 'admin') {
            const club = await Club.findById(event.clubId);
            if (!club || club.coordinator.toString() !== req.user._id.toString()) {
                res.status(403);
                throw new Error('Not authorized to view registrations for this event');
            }
        }
        res.json(event.registeredUsers);
    } else {
        res.status(404);
        throw new Error('Event not found');
    }
});

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
};
