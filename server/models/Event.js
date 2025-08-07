const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    venue: { type: String, required: true },
    type: { type: String, enum: ["society", "club"], required: true }, // 'society' or 'club'
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: function() { return this.type === 'club'; } },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registrationDeadline: { type: Date },
    interviewTimeline: { type: String },
    fee: { type: Number, default: 0 },
    poster: { type: String }, // Cloudinary URL
    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
