const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
  username: {
    type: String,
    required: true,
  },

  socketId: {
    type: String,
    required: true,
  },
});

const UsersModel = mongoose.model("User", UsersSchema);
module.exports = UsersModel;
