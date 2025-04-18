const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },
    identity_number: { type: String },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    role: { type: String, enum: ["admin", "staff", "student"], required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
