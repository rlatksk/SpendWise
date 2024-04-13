const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,
  username: { type: String, unique: true, required: true},
  email: { type: String, unique: true, required: true},
  password: { type: String, required: true },
  verificationCode: String,
  verified: { type: Boolean, default: false },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;