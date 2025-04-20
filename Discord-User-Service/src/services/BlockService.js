const Block = require("../models/Block");
const FriendService = require("./FriendService");
const { Op } = require("sequelize");

class BlockService {
  async addBlock(user_id, friend_id) {
    try {
      if (!user_id || !friend_id) {
        throw new Error("Both user_id and friend_id are required");
      }

      const existingBlock = await Block.findOne({
        where: {
          user_id,
          friend_id,
        },
      });

      if (existingBlock) {
        throw new Error("Block already exists");
      }

      await Block.destroy({
        where: {
          user_id: friend_id,
          friend_id: user_id,
        },
      });

      await FriendService.removeFriend(user_id, friend_id);

      return await Block.create({ user_id, friend_id });
    } catch (error) {
      throw new Error(`Failed to add block: ${error.message}`);
    }
  }

  async removeBlock(user_id, friend_id) {
    try {
      if (!user_id || !friend_id) {
        throw new Error("Both user_id and friend_id are required");
      }

      const result = await Block.destroy({
        where: {
          user_id,
          friend_id,
        },
      });

      if (result === 0) {
        throw new Error("No block found to remove");
      }

      return { message: "Block removed successfully" };
    } catch (error) {
      throw new Error(`Failed to remove block: ${error.message}`);
    }
  }

  async getBlockedFriends(user_id) {
    try {
      if (!user_id) {
        throw new Error("User id is required");
      }

      const blocks = await Block.findAll({
        where: { user_id },
        include: [
          {
            model: require("../models/User"),
            as: "friend",
            attributes: { exclude: ["password"] },
          },
        ],
      });

      return blocks.map((block) => block.friend);
    } catch (error) {
      throw new Error(`Failed to get blocked friends: ${error.message}`);
    }
  }
}

module.exports = new BlockService();
