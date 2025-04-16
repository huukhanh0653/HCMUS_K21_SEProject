const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");
const User = require("./User");

const FriendRequest = sequelize.define(
  "FriendRequest",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "declined"),
      allowNull: false,
      defaultValue: "pending",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "friend_requests",
    timestamps: false,
  }
);

User.hasMany(FriendRequest, { foreignKey: "sender_id", as: "sentRequests" });
User.hasMany(FriendRequest, {
  foreignKey: "receiver_id",
  as: "receivedRequests",
});
FriendRequest.belongsTo(User, { foreignKey: "sender_id", as: "sender" });
FriendRequest.belongsTo(User, { foreignKey: "receiver_id", as: "receiver" });

module.exports = FriendRequest;
