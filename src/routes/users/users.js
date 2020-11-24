const express = require("express");
const userRouter = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { auth } = require("../../middleware/auth");
const path = require("path");
const fs = require("fs-extra");
const { join } = require("path");
const UserModel = require("./UserSchema");
const UsersModel = require("./UserSchema");
const multer = require("multer");
const passport = require("passport");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Register user
userRouter.post("/register", async (req, res, next) => {
  const { name, username, email, password } = req.body;
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
        username,
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

userRouter.get("/me", auth, async (req, res, next) => {
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

// get all users
userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    if (users) {
      res.status(200).send(users);
    } else {
      const err = new Error("users not found");
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});


userRouter.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);


userRouter.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  async (req, res, next) => {
    try {
      const token = req.user.token;
      console.log("TOKEN", token);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.writeHead(301, {
        Location: process.env.FRONTEND_URL + "/profiles/me"
      });
      res.end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);


userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// userRouter.get(
//   "/auth/google/redirect",
//   passport.authenticate("google", { failureRedirect: "/login" }),
//   function (req, res) {
//     // Successful authentication, redirect home.

//     res.redirect(process.env.FRONTEND_URL + "/profiles/me");
//   }
// );

userRouter.get(
  "/auth/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res, next) => {
    try {
      const token = req.user.token;
      console.log("TOKEN", token);

      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.writeHead(301, {
        Location: process.env.FRONTEND_URL + "/profiles/me"
      });
      res.end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = userRouter;
