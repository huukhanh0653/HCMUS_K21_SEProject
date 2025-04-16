const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");
const User = require("./User");

const Friend = sequelize.define(
  "Friend",
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
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "friends",
    timestamps: false,
  }
);

User.hasMany(Friend, { foreignKey: "userId", as: "friends" });
User.hasMany(Friend, { foreignKey: "friendId", as: "friendOf" });
Friend.belongsTo(User, { foreignKey: "userId", as: "user" });
Friend.belongsTo(User, { foreignKey: "friendId", as: "friend" });

module.exports = Friend;
