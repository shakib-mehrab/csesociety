const mongoose = require('mongoose');

const clubTaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  dueDate: { type: Date },
  assignedClubs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Club' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
}, { timestamps: true });

const ClubTask = mongoose.model('ClubTask', clubTaskSchema);

module.exports = ClubTask;
