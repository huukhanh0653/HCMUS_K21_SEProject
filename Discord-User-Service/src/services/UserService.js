const User = require('../models/User');
const bcrypt = require('bcrypt');

class UserService {
  async createUser(username, email, password, role, avatar) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role, avatar });
    return user.save();
  }

  async getUserById(id) {
    return User.findById(id).select('-password');
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