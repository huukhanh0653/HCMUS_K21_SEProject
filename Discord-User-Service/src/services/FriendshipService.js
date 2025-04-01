const Friendship = require('../models/Friendship');
const FriendRequest = require('../models/FriendRequest'); // Assuming you create a FriendRequest model

class FriendshipService {
  async addFriend(userID, friendID) {
    try {
      if (!userID || !friendID) {
        throw new Error('Both userID and friendID are required');
      }

      const existingFriendship = await Friendship.findOne({
        $or: [{ userID, friendID }, { userID: friendID, friendID: userID }]
      });
      if (existingFriendship) {
        throw new Error('Friendship already exists');
      }

      const friendship = new Friendship({ userID, friendID });
      return await friendship.save();
    } catch (error) {
      throw new Error(`Failed to add friend: ${error.message}`);
    }
  }

  async sendFriendRequest(userID, friendID) {
    try {
      if (!userID || !friendID) {
        throw new Error('Both userID and friendID are required');
      }

      const existingRequest = await FriendRequest.findOne({
        $or: [{ sender: userID, receiver: friendID }, { sender: friendID, receiver: userID }]
      });
      if (existingRequest) {
        throw new Error('Friend request already exists');
      }

      const friendRequest = new FriendRequest({ sender: userID, receiver: friendID });
      return await friendRequest.save();
    } catch (error) {
      throw new Error(`Failed to send friend request: ${error.message}`);
    }
  }

  async getFriendRequests(userID) {
    try {
      if (!userID) {
        throw new Error('userID is required');
      }

      return await FriendRequest.find({ receiver: userID }).populate('sender', 'username email avatar');
    } catch (error) {
      throw new Error(`Failed to get friend requests: ${error.message}`);
    }
  }

  async acceptFriendRequest(requestID) {
    try {
      if (!requestID) {
        throw new Error('requestID is required');
      }

      const request = await FriendRequest.findById(requestID);
      if (!request) {
        throw new Error('Friend request not found');
      }

      await this.addFriend(request.sender, request.receiver);
      await FriendRequest.deleteOne({ _id: requestID });
    } catch (error) {
      throw new Error(`Failed to accept friend request: ${error.message}`);
    }
  }

  async declineFriendRequest(requestID) {
    try {
      if (!requestID) {
        throw new Error('requestID is required');
      }

      const request = await FriendRequest.findById(requestID);
      if (!request) {
        throw new Error('Friend request not found');
      }

      await FriendRequest.deleteOne({ _id: requestID });
    } catch (error) {
      throw new Error(`Failed to decline friend request: ${error.message}`);
    }
  }

  async getFriends(userID) {
    try {
      if (!userID) {
        throw new Error('userID is required');
      }

      const friendships = await Friendship.find({ $or: [{ userID }, { friendID: userID }] })
        .populate('friendID', 'username email avatar')
        .populate('userID', 'username email avatar');

      const friendsSet = new Map();

      friendships.forEach(f => {
        const friend = f.userID._id.toString() === userID ? f.friendID : f.userID;
        friendsSet.set(friend._id.toString(), friend); // Ensure uniqueness
      });

      return Array.from(friendsSet.values());
    } catch (error) {
      throw new Error(`Failed to get friends: ${error.message}`);
    }
  }

  async removeFriend(userID, friendID) {
    try {
      if (!userID || !friendID) {
        throw new Error('Both userID and friendID are required');
      }

      const result = await Friendship.deleteMany({
        $or: [{ userID, friendID }, { userID: friendID, friendID: userID }]
      });

      if (result.deletedCount === 0) {
        throw new Error('No friendship found to remove');
      }
    } catch (error) {
      throw new Error(`Failed to remove friend: ${error.message}`);
    }
  }
}

module.exports = new FriendshipService();