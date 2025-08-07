const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');

// @desc    Record a payment
// @route   POST /api/payments
// @access  Private/Super_Admin
const recordPayment = asyncHandler(async (req, res) => {
  const { userId, eventId, amount, status, paymentDate, transactionId, notes } = req.body;

  const payment = new Payment({
    userId,
    eventId,
    amount,
    status,
    paymentDate,
    transactionId,
    notes,
    recordedBy: req.user._id,
  });

  const createdPayment = await payment.save();
  res.status(201).json(createdPayment);
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Super_Admin
const getAllPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({})
    .populate('userId', 'name email')
    .populate('eventId', 'title')
    .populate('recordedBy', 'name');
  res.json(payments);
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private/Super_Admin
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('userId', 'name email')
    .populate('eventId', 'title')
    .populate('recordedBy', 'name');
    
  if (payment) {
    res.json(payment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

// @desc    Update payment status
// @route   PUT /api/payments/:id
// @access  Private/Super_Admin
const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const payment = await Payment.findById(req.params.id);

  if (payment) {
    payment.status = status || payment.status;
    payment.notes = notes || payment.notes;
    const updatedPayment = await payment.save();
    res.json(updatedPayment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

module.exports = {
  recordPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
};
