const express = require('express');
const router = express.Router();
const {
  recordPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
} = require('../controllers/paymentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, authorizeRoles('super_admin'), recordPayment);
router.get('/', protect, authorizeRoles('super_admin'), getAllPayments);
router.get('/:id', protect, authorizeRoles('super_admin'), getPaymentById);
router.put('/:id', protect, authorizeRoles('super_admin'), updatePaymentStatus);

module.exports = router;
