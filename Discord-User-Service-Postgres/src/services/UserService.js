const User = require("../models/User");
const bcrypt = require("bcrypt");
const admin = require("../config/firebaseAdmin");

class UserService {
  async createUser(username, email, password, avatar, background) {
    try {
      const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
      return await User.create({
        username,
        email,
        password: hashedPassword,
        avatar,
        background,
      });
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async getAllUsers() {
    return await User.findAll({ attributes: { exclude: ["password"] } });
  }

  async getAllFirebaseUsers() {
    try {
      const listUsersResult = await admin.auth().listUsers();
      return listUsersResult.users.map((userRecord) => ({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        providerData: userRecord.providerData,
      }));
    } catch (error) {
      console.error("Error fetching Firebase users:", error);
      throw error;
    }
  }

  async syncFirebaseUsers() {
    try {
      const firebaseUsers = await this.getAllFirebaseUsers();
      const emails = firebaseUsers.map((user) => user.email);
      const existingUsers = await User.findAll({ where: { email: emails } });
      const existingEmails = new Set(existingUsers.map((user) => user.email));

      for (const user of firebaseUsers) {
        if (!existingEmails.has(user.email)) {
          try {
            await User.create({
              username: user.displayName,
              email: user.email,
              password: null,
              avatar: user.photoURL,
              background: user.photoURL,
            });
          } catch (createError) {
            console.error(`Failed to create user ${user.email}:`, createError);
          }
        }
      }

      return { message: "Firebase users synchronized with PostgreSQL" };
    } catch (error) {
      console.error("Error syncing Firebase users:", error);
      throw error;
    }
  }

  async getUserBy_id(id) {
    return await User.findByPk(id, { attributes: { exclude: ["password"] } });
  }

  async getUsersByUsername(username) {
    return await User.findAll({
      where: { username },
      attributes: { exclude: ["password"] },
    });
  }

  async getUserByEmail(email) {
    return await User.findOne({
      where: { email },
      attributes: { exclude: ["password"] },
    });
  }

  async updateUser(id, updates) {
    try {
      if (updates.password) {
        updates.password = await bcrypt.hash(updates.password, 10);
      }
      const [updatedCount, updatedUsers] = await User.update(updates, {
        where: { id },
        returning: true,
      });
      if (updatedCount === 0) {
        throw new Error("User not found");
      }
      return updatedUsers[0];
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  async banUser(id) {
    try {
      const bannedCount = await User.update(
        { status: "banned" },
        {
          where: { id },
          returning: true,
        }
      );
      if (bannedCount === 0) {
        throw new Error("User not found");
      }
      return { message: "User banned successfully" };
    } catch (error) {
      throw new Error(`Failed to ban user: ${error.message}`);
    }
  }
}

module.exports = new UserService();
