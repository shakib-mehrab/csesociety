const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getTaskByClubID, 
  markTaskCompleted,
} = require('../controllers/clubTaskController');

// Only super_admin can assign tasks to clubs


// Get tasks by club ID
router.get('/club/:clubId', protect, getTaskByClubID);

// For club admins: get tasks assigned to their club
// router.get('/assigned', protect, getTaskByClubID); // controller will filter by club if not super_admin

// For club admins: mark a task as completed
router.patch('/:id/complete', protect,  markTaskCompleted);

router.post('/', protect, authorizeRoles('super_admin'), createTask);
router.get('/', protect, authorizeRoles('super_admin'), getAllTasks);
router.put('/:id', protect, authorizeRoles('super_admin'), updateTask);
router.delete('/:id', protect, authorizeRoles('super_admin'), deleteTask);

module.exports = router;
