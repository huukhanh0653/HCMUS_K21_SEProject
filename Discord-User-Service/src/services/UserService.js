const User = require('../models/User');

class UserService {
  async createUser(username, email, role, avatar) {
    const user = new User({ username, email,password, role, avatar });
    return user.save();
  }

  async getUserById(id) {
    return User.findById(id);
  }

  async updateUser(id, updates) {
    return User.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteUser(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserService();