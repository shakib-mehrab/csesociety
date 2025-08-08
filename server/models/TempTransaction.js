// models/TempTransaction.js
const mongoose = require('mongoose');

const tempTransactionSchema = new mongoose.Schema({
  tran_id: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
}, { timestamps: true });

module.exports = mongoose.model('TempTransaction', tempTransactionSchema);
