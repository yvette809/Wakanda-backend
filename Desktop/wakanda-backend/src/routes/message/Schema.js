const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },

  email: {
    type: String,
    required: [true, "email is required"],
  },
  phone: {
    type: String,
    rewuired: [true, "phone number is required"],
  },

  text: {
    type: String,
    required: true,
  },
});

const MessageModel = mongoose.model("message", MessageSchema);
module.exports = MessageModel;
