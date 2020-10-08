const UsersModel = require("./schema");

const getUsers = async () => {
  const users = await UsersModel.find();
  return users;
};

const removeUser = async (socketId) => {
  const users = getUsers();
  const findUser = users.find((user) => user.socketId === socketId);
  if (findUser) {
    await UsersModel.findOneAndDelete({ socketId });
  }
};

const setUsername = async (username, socketId) => {
  const findUser = await UsersModel.findOne({ username });
  if (findUser) {
    await UsersModel.findOneAndUpdate({ username, socketId });
  } else {
    const newUser = new UsersModel({ username, socketId });
    await newUser.save();
  }
  return await getUsers();
};

module.exports = {
  getUsers,
  setUsername,
  removeUser,
};
