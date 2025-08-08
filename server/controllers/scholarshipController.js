const Scholarship = require('../models/Scholarship');
const ScholarshipApplication = require('../models/ScholarshipApplication');
const User = require('../models/User');

// Create a new scholarship
exports.createScholarship = async (req, res) => {
  try {
    const { name, eligibility, rules } = req.body;
    const scholarship = await Scholarship.create({ name, eligibility, rules });
    res.status(201).json(scholarship);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create scholarship' });
  }
};

// List all scholarships
exports.getScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scholarships' });
  }
};

// Get scholarship by ID
exports.getScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ error: 'Not found' });
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scholarship' });
  }
};

// Delete scholarship
exports.deleteScholarship = async (req, res) => {
  try {
    await Scholarship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete scholarship' });
  }
};

// Create a scholarship application
exports.applyScholarship = async (req, res) => {
  try {
    const data = req.body;
    data.user = req.user._id;
    if (req.file) data.photo = req.file.path;
    const exists = await ScholarshipApplication.findOne({ user: req.user._id, scholarship: data.scholarship });
    if (exists) return res.status(400).json({ error: 'Already applied' });
    const app = await ScholarshipApplication.create(data);
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to apply' });
  }
};

// List all applications (admin)
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await ScholarshipApplication.find().populate('user').populate('scholarship').sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// List applications for a scholarship
exports.getScholarshipApplications = async (req, res) => {
  try {
    const apps = await ScholarshipApplication.find({ scholarship: req.params.id }).populate('user').sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// Review (approve/reject) application
exports.reviewApplication = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const app = await ScholarshipApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application' });
  }
};

// Get application by ID
exports.getApplication = async (req, res) => {
  try {
    const app = await ScholarshipApplication.findById(req.params.id).populate('user').populate('scholarship');
    if (!app) return res.status(404).json({ error: 'Not found' });
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch application' });
  }
};
