const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    logo: { type: String }, // Cloudinary URL
    coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subCoordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    contactEmail: { type: String },
}, { timestamps: true });

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
