const express = require('express');
const router = express.Router();
const {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
} = require('../controllers/noticeController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('super_admin', 'admin', 'coordinator'), createNotice);
router.get('/', getAllNotices);
router.get('/:id', getNoticeById);
router.put('/:id', protect, authorizeRoles('super_admin', 'admin', 'coordinator'), updateNotice);
router.delete('/:id', protect, authorizeRoles('super_admin', 'admin', 'coordinator'), deleteNotice);

module.exports = router;
