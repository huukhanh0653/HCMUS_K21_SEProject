const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "offline",
    },
    avatar: {
      type: DataTypes.STRING,
    },
    background: {
      type: DataTypes.STRING,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

User.beforeUpdate((user) => {
  user.updated_at = new Date();
});

module.exports = User;
