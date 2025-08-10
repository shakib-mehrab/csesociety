const asyncHandler = require('express-async-handler');
const Notice = require('../models/Notice');
const Club = require('../models/Club');

// @desc    Create a notice
// @route   POST /api/notices
// @access  Private/Super_Admin_Admin
const createNotice = asyncHandler(async (req, res) => {
  const { title, content, type, clubId, expiresAt, attachments } = req.body;

  if (type === 'club') {
    if (!clubId) {
      res.status(400);
      throw new Error('Club ID is required for club notices');
    }
    const club = await Club.findById(clubId);
    if (!club) {
        res.status(404);
        throw new Error('Club not found');
    }
    if ((req.user.role === 'admin' || req.user.role === 'coordinator') && club.coordinator.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to create notices for this club');
    }
  }

  const notice = new Notice({
    title,
    content,
    type,
    clubId: type === 'club' ? clubId : null,
    author: req.user._id,
    expiresAt,
    attachments,
  });

  const createdNotice = await notice.save();
  res.status(201).json(createdNotice);
});

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
const getAllNotices = asyncHandler(async (req, res) => {
  const { type, clubId } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (clubId) filter.clubId = clubId;

  const notices = await Notice.find(filter).populate('author', 'name').populate('clubId', 'name');
  res.json(notices);
});

// @desc    Get notice by ID
// @route   GET /api/notices/:id
// @access  Public
const getNoticeById = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id).populate('author', 'name').populate('clubId', 'name');
  if (notice) {
    res.json(notice);
  } else {
    res.status(404);
    throw new Error('Notice not found');
  }
});

// @desc    Update a notice
// @route   PUT /api/notices/:id
// @access  Private/Super_Admin_Admin
const updateNotice = asyncHandler(async (req, res) => {
  const { title, content, expiresAt, attachments } = req.body;

  const notice = await Notice.findById(req.params.id);

  if (notice) {
    if (req.user.role === 'admin' || req.user.role === 'coordinator') {
        const club = await Club.findById(notice.clubId);
        if (!club || club.coordinator.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to update this notice');
        }
    }

    notice.title = title || notice.title;
    notice.content = content || notice.content;
    notice.expiresAt = expiresAt || notice.expiresAt;
    notice.attachments = attachments || notice.attachments;

    const updatedNotice = await notice.save();
    res.json(updatedNotice);
  } else {
    res.status(404);
    throw new Error('Notice not found');
  }
});

// @desc    Delete a notice
// @route   DELETE /api/notices/:id
// @access  Private/Super_Admin_Admin
const deleteNotice = asyncHandler(async (req, res) => {
  const notice = await Notice.findById(req.params.id);

  if (notice) {
    if (req.user.role === 'admin' || req.user.role === 'coordinator') {
        const club = await Club.findById(notice.clubId);
        if (!club || club.coordinator.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Not authorized to delete this notice');
        }
    }
  await Notice.deleteOne({ _id: notice._id });
  res.json({ message: 'Notice removed' });
  } else {
    res.status(404);
    throw new Error('Notice not found');
  }
});

module.exports = {
  createNotice,
  getAllNotices,
  getNoticeById,
  updateNotice,
  deleteNotice,
};
