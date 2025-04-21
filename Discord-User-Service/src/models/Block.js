const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");
const User = require("./User");

const Block = sequelize.define(
  "Block",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    friend_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "blocks",
    timestamps: false,
  }
);

User.hasMany(Block, { foreignKey: "user_id", as: "blocks" });
User.hasMany(Block, { foreignKey: "friend_id", as: "blockedBy" });
Block.belongsTo(User, { foreignKey: "user_id", as: "user" });
Block.belongsTo(User, { foreignKey: "friend_id", as: "friend" });

module.exports = Block;
