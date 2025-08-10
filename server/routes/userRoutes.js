const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserProfile,
  approveMemberRegistration,
} = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('super_admin'), getAllUsers);
router.get('/:id', protect, authorizeRoles('super_admin'), getUserById);
router.put('/:id/role', protect, authorizeRoles('super_admin'), updateUserRole);
router.put('/profile', protect, updateUserProfile);
router.put('/:id/approve', protect, authorizeRoles('super_admin'), approveMemberRegistration);
router.delete('/:id', protect, authorizeRoles('super_admin'), require('../controllers/userController').deleteUser);

module.exports = router;
