const express = require("express");
const userRouter = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const path = require ("path")
const fs = require("fs-extra");
const { join } = require("path");
const UserModel = require("./UserSchema");
const UsersModel = require("./UserSchema");
const multer = require("multer");

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
userRouter.get("/",  async (req,res,next)=>{
  try{
    const users = await UserModel.find()
    if(users){
      res.status(200).send(users)
    }else{
      const err = new Error('users not found');
      err.httpStatusCode= 404;
      next(err)
    }
  }catch(error){
    next (error)
  }
})

// post profile pic

// const upload =multer({
//   limits:{
//     fileSize: 2000000
//   },
//   fileFilter(req,file,cb){
//     if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
//     return cb(new Error("please upload an image"))
//   }
//   cb(undefined,true)
// }
// })
// userRouter.post("/me/image", auth, upload.single('profile'), async(req,res)=>{
//   const user = await UsersModel.findOneAndUpdate(req.user.id)
//   req.user.image = req.file.buffer
//   user.save()
//   res.send('uploaded')
// },(error,req,res,next)=>{
//   res.status(400).send({errors:error.message})
// })



module.exports = userRouter;
