const mongoose = require("mongoose");

const FriendshipSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  friendID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Friendship", FriendshipSchema);
