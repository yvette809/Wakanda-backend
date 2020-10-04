const express = require("express");
const userRouter = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const basicAuth = require("../../middleware/auth");
const UserModel = require("./UserSchema");

// Register user
userRouter.post("/register", async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    // see if user exists
    let user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).json({ msg: "user already exists" });
    } else {
      // get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new UserModel({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password before saving user in to th database
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(
        payload,
        process.env.jwt_Secret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ token });
          }
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", basicAuth, async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      const error = new Error("user not found");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = userRouter;
