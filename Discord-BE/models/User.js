const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true, maxlength: 255 },
    password: { type: String, required: true, maxlength: 100 },
    email: { type: String, unique: true, required: true, maxlength: 255 },
    status: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
