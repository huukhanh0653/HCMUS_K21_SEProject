const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    message_id: { type: String, required: true, unique: true },
    channel_id: { type: String, required: true },
    sender_id: { type: String, required: true },
    content: { type: String, required: true },
    attachments: [{ type: String }],
    timestamp: { type: Date, default: Date.now },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', MessageSchema);