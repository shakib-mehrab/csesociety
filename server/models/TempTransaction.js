// models/TempTransaction.js
const mongoose = require('mongoose');


const tempTransactionSchema = new mongoose.Schema({
  tran_id: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
}, { 
  timestamps: true,
  validate: {
    validator: function() {
      // Require at least one of club or event
      return !!(this.club || this.event);
    },
    message: 'Either club or event is required.'
  }
});

module.exports = mongoose.model('TempTransaction', tempTransactionSchema);
