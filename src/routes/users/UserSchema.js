const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const v = require("validator");

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  username:{
    type: String,
    required: true
  },
 
  socketId: {
    type: String,
    
  },
  email: {
    type: String,
    required: [true, "please include a valid email"],
    unique: true,
    validate: {
      validator: async (value) => {
        if (!v.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },

  avatar: {
    type: String,
  },
 
  date: {
    type: Date,
    default: Date.now,
  },
});

const UsersModel = mongoose.model("user", UserSchema);
module.exports = UsersModel;
