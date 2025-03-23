const Friendship = require('../models/Friendship');

class FriendshipService {
  async addFriend(userID, friendID) {
    const friendship = new Friendship({ userID, friendID });
    return friendship.save();
  }

  async getFriends(userID) {
    return Friendship.find({ userID }).populate('friendID');
  }

  async removeFriend(userID, friendID) {
    return Friendship.findOneAndDelete({ userID, friendID });
  }
}

module.exports = new FriendshipService();