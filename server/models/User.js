const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'], 
    required: true
  }
});

module.exports = mongoose.model('User', UserSchema);