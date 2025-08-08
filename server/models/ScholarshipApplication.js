const mongoose = require('mongoose');

const ScholarshipApplicationSchema = new mongoose.Schema({
  scholarship: { type: mongoose.Schema.Types.ObjectId, ref: 'Scholarship', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photo: { type: String },
  studentName: { type: String, required: true },
  motherName: { type: String, required: true },
  fatherName: { type: String, required: true },
  institution: { type: String, required: true },
  batch: { type: String, required: true },
  semester: { type: String, required: true },
  session: { type: String, required: true },
  roll: { type: String, required: true },
  sscGrade: { type: String, required: true },
  hscGrade: { type: String, required: true },
  semesterGrades: { type: String, required: true },
  permanentAddress: {
    village: String,
    postOffice: String,
    upozilla: String,
    district: String,
  },
  presentAddress: { type: String, required: true },
  familyExpense: { type: Boolean, required: true },
  familyCondition: { type: String, required: true },
  reference: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScholarshipApplication', ScholarshipApplicationSchema);
