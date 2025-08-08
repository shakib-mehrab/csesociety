const express = require('express');
const router = express.Router();
const scholarshipController = require('../controllers/scholarshipController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/scholarship_photos/' });

// Public
router.get('/', scholarshipController.getScholarships);
router.get('/:id', scholarshipController.getScholarship);

// Super Admin only
router.post('/', protect, authorizeRoles('super_admin'), scholarshipController.createScholarship);
router.delete('/:id', protect, authorizeRoles('super_admin'), scholarshipController.deleteScholarship);
router.get('/applications/all', protect, authorizeRoles('super_admin'), scholarshipController.getAllApplications);
router.get('/:id/applications', protect, authorizeRoles('super_admin'), scholarshipController.getScholarshipApplications);
router.put('/applications/:id/review', protect, authorizeRoles('super_admin'), scholarshipController.reviewApplication);

// User
router.post('/apply', protect, upload.single('photo'), scholarshipController.applyScholarship);
router.get('/application/:id', protect, scholarshipController.getApplication);

module.exports = router;
