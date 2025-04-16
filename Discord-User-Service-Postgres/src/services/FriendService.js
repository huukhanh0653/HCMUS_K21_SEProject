const Friend = require("../models/Friend");
const FriendRequest = require("../models/FriendRequest");
const { Op } = require("sequelize");

class FriendService {
  async addFriend(userId, friendId) {
    try {
      if (!userId || !friendId) {
        throw new Error("Both userId and friendId are required");
      }

      const existingFriend = await Friend.findOne({
        where: {
          [Op.or]: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
          ],
        },
      });
      if (existingFriend) {
        throw new Error("Friend already exists");
      }

      return await Friend.create({ userId, friendId });
    } catch (error) {
      throw new Error(`Failed to add friend: ${error.message}`);
    }
  }

  async sendFriendRequest(userId, friendId) {
    try {
      if (!userId || !friendId) {
        throw new Error("Both userId and friendId are required");
      }

      const existingRequest = await FriendRequest.findOne({
        where: {
          [Op.or]: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
          ],
        },
      });
      if (existingRequest) {
        throw new Error("Friend request already exists");
      }

      return await FriendRequest.create({
        senderId: userId,
        receiverId: friendId,
      });
    } catch (error) {
      throw new Error(`Failed to send friend request: ${error.message}`);
    }
  }

  async getFriendRequests(userId) {
    try {
      if (!userId) {
        throw new Error("userId is required");
      }

      return await FriendRequest.findAll({
        where: { receiverId: userId, status: "pending" }, // Chỉ lấy các yêu cầu đang pending
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["username", "email", "avatar"],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Failed to get friend requests: ${error.message}`);
    }
  }

  async acceptFriendRequest(requestId) {
    try {
      if (!requestId) {
        throw new Error("requestId is required");
      }

      const request = await FriendRequest.findByPk(requestId);
      if (!request) {
        throw new Error("Friend request not found");
      }

      if (request.status !== "pending") {
        throw new Error("Friend request is not in pending status");
      }

      await this.addFriend(request.senderId, request.receiverId);
      await request.update({ status: "accepted" });
      await request.destroy();
    } catch (error) {
      throw new Error(`Failed to accept friend request: ${error.message}`);
    }
  }

  async declineFriendRequest(requestId) {
    try {
      if (!requestId) {
        throw new Error("requestId is required");
      }

      const request = await FriendRequest.findByPk(requestId);
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

  async getFriends(userId) {
    try {
      if (!userId) {
        throw new Error("userId is required");
      }

      const friends = await Friend.findAll({
        where: {
          [Op.or]: [{ userId }, { friendId: userId }],
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username", "email", "avatar"],
          },
          {
            model: User,
            as: "friend",
            attributes: ["username", "email", "avatar"],
          },
        ],
      });

      const friendsSet = new Map();
      friends.forEach((f) => {
        const friend = f.userId === userId ? f.friend : f.user;
        friendsSet.set(friend.id, friend);
      });

      return Array.from(friendsSet.values());
    } catch (error) {
      throw new Error(`Failed to get friends: ${error.message}`);
    }
  }

  async removeFriend(userId, friendId) {
    try {
      if (!userId || !friendId) {
        throw new Error("Both userId and friendId are required");
      }

      const result = await Friend.destroy({
        where: {
          [Op.or]: [
            { userId, friendId },
            { userId: friendId, friendId: userId },
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
