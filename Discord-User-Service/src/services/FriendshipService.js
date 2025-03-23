const Friendship = require('../models/Friendship');

class FriendshipService {
  async addFriend(userID, friendID) {
    const existingFriendship = await Friendship.findOne({
      $or: [{ userID, friendID }, { userID: friendID, friendID: userID }]
    });
    if (existingFriendship) {
      throw new Error('Friendship already exists');
    }
    const friendship = new Friendship({ userID, friendID });
    return friendship.save();
  }
  async getFriends(userID) {
    const friendships = await Friendship.find({ $or: [{ userID }, { friendID: userID }] })
      .populate('friendID', 'username email avatar')
      .populate('userID', 'username email avatar');
  
    const friendsSet = new Map();
  
    friendships.forEach(f => {
      const friend = f.userID._id.toString() === userID ? f.friendID : f.userID;
      friendsSet.set(friend._id.toString(), friend); // Ensure uniqueness
    });
  
    return Array.from(friendsSet.values());
  }
  

  async removeFriend(userID, friendID) {
    await Friendship.deleteMany({ 
      $or: [{ userID, friendID }, { userID: friendID, friendID: userID }] 
    });
  }
}

module.exports = new FriendshipService();