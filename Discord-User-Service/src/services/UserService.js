const User = require("../models/User");
const bcrypt = require("bcrypt");
const admin = require("../config/firebaseAdmin"); // Correct import
class UserService {
  async createUser(username, email, password, avatar, isAdmin) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      avatar,
      isAdmin,
    });
    return user.save();
  }

  async getAllUsers() {
    return User.find().select("-password");
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
      User.deleteMany({}); // Clear the User collection before syncing
      const firebaseUsers = await this.getAllFirebaseUsers(); // Ensure this works
<<<<<<< HEAD
      const emails = firebaseUsers.map(user => user.email);
      const existingUsers = await User.find({ email: { $in: emails } }); // Fetch all at once
      const existingEmails = new Set(existingUsers.map(user => user.email));
      
=======

      const emails = firebaseUsers.map((user) => user.email);
      const existingUsers = await User.find({ email: { $in: emails } }); // Fetch all at once
      const existingEmails = new Set(existingUsers.map((user) => user.email));

>>>>>>> 8122bc607127f61a34d0ff217fddca21be8062e5
      for (const user of firebaseUsers) {
        if (!existingEmails.has(user.email)) {
          try {
            await User.create({
              username: user.displayName || "Unknown",
              email: user.email,
              password: null, // Handled by Firebase
              avatar: user.photoURL || "",
              background: user.photoURL || "",
<<<<<<< HEAD
              isActivated: true,
=======
              isAdmin: false,
>>>>>>> 8122bc607127f61a34d0ff217fddca21be8062e5
            });
          } catch (createError) {
            console.error(`Failed to create user ${user.email}:`, createError);
          }
        }
      }

      return { message: "Firebase users synchronized with MongoDB" };
    } catch (error) {
      console.error("Error syncing Firebase users:", error);
      throw error;
    }
  }

  async getUserById(id) {
    return User.findById(id).select("-password");
  }
  async getUsersByUsername(username) {
    return User.find({ username }).select("-password");
  }

  async getUserByEmail(email) {
    return User.findOne({ email: email }).select("-password");
  }

  async updateUser(id, updates) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    return User.findByIdAndUpdate(id, updates, { new: true }).select(
      "-password"
    );
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
  async deactivateUser(id) {
    return User.findByIdAndUpdate(id, { isActivated: false }, { new: true }).select('-password');
  }
}

module.exports = new UserService();
