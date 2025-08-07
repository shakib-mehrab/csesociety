const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  getEventRegistrations,
} = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('super_admin', 'admin'), createEvent);
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.put('/:id', protect, authorizeRoles('super_admin', 'admin'), updateEvent);
router.delete('/:id', protect, authorizeRoles('super_admin', 'admin'), deleteEvent);
router.post('/:id/register', protect, authorizeRoles('member'), registerForEvent);
router.get('/:id/registrations', protect, authorizeRoles('super_admin', 'admin'), getEventRegistrations);

module.exports = router;
