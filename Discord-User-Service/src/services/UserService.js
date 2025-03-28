const User = require('../models/User');
const bcrypt = require('bcrypt');
const admin = require("../config/firebaseAdmin"); // Correct import
class UserService {
  async createUser(username, email, password, role, avatar) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, avatar });
    return user.save();
  }
  async getAllFirebaseUsers() {
    try {
      const listUsersResult = await admin.auth().listUsers();
      return listUsersResult.users.map(userRecord => ({
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
      const firebaseUsers = await this.getAllFirebaseUsers(); // Ensure this works
  
      const emails = firebaseUsers.map(user => user.email);
      const existingUsers = await User.find({ email: { $in: emails } }); // Fetch all at once
      const existingEmails = new Set(existingUsers.map(user => user.email));
  
      for (const user of firebaseUsers) {
        if (!existingEmails.has(user.email)) {
          try {
            await User.create({
              username: user.displayName || "Unknown",
              email: user.email,
              password: null, // Handled by Firebase
              role: "user",
              avatar: user.photoURL || "",
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
    return User.findById(id).select('-password');
  }
  async getUsersByUsername(username) {
    return User.find({ username }).select('-password');
  }
  
  async getUserByEmail(email){  
    return User.findOne({email: email}).select('-password');
  }

  async updateUser(id, updates) {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    return User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();