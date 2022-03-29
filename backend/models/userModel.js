const { match } = require("assert");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  confirmPassword: String,
  firstName: String,
  surname: String,
  dateOfBirth: {
    type: Date,
    required: true,
    trim: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
