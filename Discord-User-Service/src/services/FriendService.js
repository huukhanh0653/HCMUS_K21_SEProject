const User = require("../models/User");
const Friend = require("../models/Friend");
const FriendRequest = require("../models/FriendRequest");
const { Op } = require("sequelize");

class FriendService {
  async addFriend(user_id, friend_id) {
    try {
      if (!user_id || !friend_id) {
        throw new Error("Both user_id and friend_id are required");
      }

      const existingFriend = await Friend.findOne({
        where: {
          [Op.or]: [
            { user_id, friend_id },
            { user_id: friend_id, friend_id: user_id },
          ],
        },
      });
      if (existingFriend) {
        throw new Error("Friend already exists");
      }

      return await Friend.create({ user_id, friend_id });
    } catch (error) {
      throw new Error(`Failed to add friend: ${error.message}`);
    }
  }

  async sendFriendRequest(user_id, friend_id) {
    try {
      if (!user_id || !friend_id) {
        throw new Error("Both user_id and friend_id are required");
      }

      const existingRequest = await FriendRequest.findOne({
        where: {
          [Op.or]: [
            { sender_id: user_id, receiver_id: friend_id },
            { sender_id: friend_id, receiver_id: user_id },
          ],
        },
      });
      if (existingRequest) {
        throw new Error("Friend request already exists");
      }

      return await FriendRequest.create({
        sender_id: user_id,
        receiver_id: friend_id,
      });
    } catch (error) {
      throw new Error(`Failed to send friend request: ${error.message}`);
    }
  }

  async getFriendRequests(user_id) {
    try {
      if (!user_id) {
        throw new Error("User id is required");
      }

      return await FriendRequest.findAll({
        where: { receiver_id: user_id, status: "pending" },
        include: [
          {
            model: User,
            as: "sender",
            attributes: { exclude: ["password"] },
          },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to get friend requests: ${error.message}`);
    }
  }

  async acceptFriendRequest(request_id) {
    try {
      if (!request_id) {
        throw new Error("request_id is required");
      }

      const request = await FriendRequest.findByPk(request_id);
      if (!request) {
        throw new Error("Friend request not found");
      }

      if (request.status !== "pending") {
        throw new Error("Friend request is not in pending status");
      }

      await this.addFriend(request.sender_id, request.receiver_id);
      await request.update({ status: "accepted" });
      await request.destroy();
    } catch (error) {
      throw new Error(`Failed to accept friend request: ${error.message}`);
    }
  }

  async declineFriendRequest(request_id) {
    try {
      if (!request_id) {
        throw new Error("request_id is required");
      }

      const request = await FriendRequest.findByPk(request_id);
      if (!request) {
        throw new Error("Friend request not found");
      }

      if (request.status !== "pending") {
        throw new Error("Friend request is not in pending status");
      }

      await request.update({ status: "declined" });
      await request.destroy();
    } catch (error) {
      throw new Error(`Failed to decline friend request: ${error.message}`);
    }
  }

  async getFriends(user_id) {
    try {
      if (!user_id) {
        throw new Error("User id is required");
      }

      const friends = await Friend.findAll({
        where: {
          [Op.or]: [{ user_id }, { friend_id: user_id }],
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: { exclude: ["password"] },
          },
          {
            model: User,
            as: "friend",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      const friendsSet = new Map();
      friends.forEach((f) => {
        const friend = f.user_id === user_id ? f.friend : f.user;
        friendsSet.set(friend.id, friend);
      });

      return Array.from(friendsSet.values());
    } catch (error) {
      throw new Error(`Failed to get friends: ${error.message}`);
    }
  }

  async removeFriend(user_id, friend_id) {
    try {
      if (!user_id || !friend_id) {
        throw new Error("Both user_id and friend_id are required");
      }

      const result = await Friend.destroy({
        where: {
          [Op.or]: [
            { user_id, friend_id },
            { user_id: friend_id, friend_id: user_id },
          ],
        },
      });

      if (result === 0) {
        throw new Error("No friend found to remove");
      }
    } catch (error) {
      throw new Error(`Failed to remove friend: ${error.message}`);
    }
  }
}

module.exports = new FriendService();
