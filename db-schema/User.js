const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,
  username: String,
  email: { type: String, unique: true },
  password: String,
});

const User = mongoose.model('User', userSchema);

const getUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

module.exports = User;