const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Super_Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Super_Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Super_Admin
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.role = req.body.role || user.role;
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    user.phone = req.body.phone || user.phone;
    user.batch = req.body.batch || user.batch;
    user.department = req.body.department || user.department;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      phone: updatedUser.phone,
      batch: updatedUser.batch,
      department: updatedUser.department,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Approve member registration
// @route   PUT /api/users/:id/approve
// @access  Private/Super_Admin
const approveMemberRegistration = asyncHandler(async (req, res) => {
    // This is a conceptual endpoint. In this schema, users are members by default.
    // This could be adapted if there was a 'status' field on the User model.
    // For now, we can just confirm the user exists.
    const user = await User.findById(req.params.id);

    if (user) {
        // In a real scenario, you might change a user's status from 'pending' to 'active'
        // user.status = 'active';
        // await user.save();
        res.json({ message: 'User registration approved conceptually.' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});


module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserProfile,
  approveMemberRegistration,
};
