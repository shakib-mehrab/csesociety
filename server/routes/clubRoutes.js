const express = require('express');
const router = express.Router();

const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { 
  createClub,
  getAllClubs,
  getClubById,
  updateClub,
  deleteClub,
  sendJoinRequest,
  processJoinRequest,
  getClubMembers,
  getAllJoinRequests,
} = require('../controllers/clubController');
// Get all join requests (super admin)
router.get('/requests', protect, authorizeRoles('super_admin','coordinator'), getAllJoinRequests);

router.post('/', protect, authorizeRoles('super_admin'), createClub);
router.get('/', getAllClubs);
router.get('/:id', getClubById);
router.put('/:id', protect, authorizeRoles('super_admin', 'admin', 'coordinator'), updateClub);
router.delete('/:id', protect, authorizeRoles('super_admin'), deleteClub);
router.post('/:id/join', protect, authorizeRoles('member'), sendJoinRequest);
router.put('/requests/:requestId', protect, authorizeRoles('admin', 'super_admin', 'coordinator'), processJoinRequest);
router.get('/:id/members', protect, authorizeRoles('admin', 'super_admin', 'coordinator'), getClubMembers);

module.exports = router;
