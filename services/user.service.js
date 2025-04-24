const User = require("../models/user");

async function getUserById(id) {
  return await User.findById(id);
}

async function getAllUsers() {
  return await User.find();
}

async function getAllUsersv2() {
  return await User.find({role: "member"}).select("-password");
}

async function createUser(data) {
  // Check if the user already exists
  const existingUser = await User.findOne({
    $or: [
      { email: data.email },
      { phone: data.phone },
      { identity_number: data.identity_number },
    ],
  });
  if (existingUser) {
    throw new Error("User already exists");
  }
  return await User.create(data);
}

async function updateUser(id, data) {
  const existingUser = await User.findById(id);
  if (!existingUser) {
    throw new Error("User not found");
  }
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
  getAllUsersv2,
};
