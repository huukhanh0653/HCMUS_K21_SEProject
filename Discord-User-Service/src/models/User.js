const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  avatar: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);