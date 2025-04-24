const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const config = require("../config/server");
const ResponseHandler = require("../utils/response-handlers");

async function register(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const existingUser = await User.findOne({
    $or: [
      { email: data.email },
      { phone: data.phone },
      { identity_number: data.identity_number },
    ],
  });
  console.log(existingUser);
  
  if (existingUser) {
    throw new Error("User already exists");
  }
  const user = await User.create({
    ...data,
    password: hashedPassword,
    role: "member",
    is_verified: false, // Set to false by default
    is_active: true, // Set to true by default
  });
  return user;
}

async function login(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const accessToken = jwt.sign({ id: user._id }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn || "7d",
  });

  return { user, accessToken };
}

async function changePasswordFirstTime(userId, newPassword) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const user = await User.findByIdAndUpdate(
    userId,
    { password: hashedPassword, is_verified: true },
    { new: true },
  );
  if (!user) {
    return ResponseHandler.notFound(null, "User not found");
  }
  return user;
}

module.exports = {
  register,
  login,
  changePasswordFirstTime,
};
