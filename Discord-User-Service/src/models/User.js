const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  avatar: { type: String },
  background: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isActivated: { type: Boolean, default: true },
  createdAt : { type: Date, default: Date.now },
  updatedAt : { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);