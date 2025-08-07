const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
} = require('../controllers/clubTaskController');

// Only super_admin can assign tasks to clubs
router.post('/', protect, authorizeRoles('super_admin'), createTask);
router.get('/', protect, authorizeRoles('super_admin'), getAllTasks);
router.put('/:id', protect, authorizeRoles('super_admin'), updateTask);
router.delete('/:id', protect, authorizeRoles('super_admin'), deleteTask);

module.exports = router;
