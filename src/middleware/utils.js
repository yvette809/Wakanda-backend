const jwt = require('jsonwebtoken');
const UserModel = require('../routes/users/UserSchema');

const generateTokens = async (user) => {
  try {
    const token = await generateJWT({ _id: user._id });
    const newUser = await UserModel.findById(user._id);
    newUser.token = token;
    await newUser.save({ validateBeforeSave: false });
    return { token };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const generateJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.jwt_Secret,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyGeneratedJWT = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.jwt_Secret, (err, credentials) => {
      if (err) {
        if (err.name == 'TokenExpiredError') {
          resolve();
        } else {
          reject(err);
        }
      } else {
        resolve(credentials);
      }
    });
  });



module.exports = {
  generateTokens,
  verifyGeneratedJWT,
};
