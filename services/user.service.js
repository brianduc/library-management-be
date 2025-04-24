const User = require("../models/user");

async function getUserById(id) {
  return await User.findById(id);
}

async function getAllUsers() {
  return await User.find();
}

async function createUser(data) {
  return await User.create(data);
}

async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, { new: true });
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id);
}

async function lockUser(id) {
  return await User.findByIdAndUpdate(id, { is_active: false }, { new: true });
}

async function unlockUser(id) {
  return await User.findByIdAndUpdate(id, { is_active: true }, { new: true });
}

module.exports = {
  getUserById,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  lockUser,
  unlockUser,
};
