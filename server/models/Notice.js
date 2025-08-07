const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["society", "club", "scholarship"], required: true },
    clubId: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: function() { return this.type === 'club'; } },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    publishedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    attachments: [{ type: String }], // Cloudinary URLs
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
