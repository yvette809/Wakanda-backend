const express = require("express");
const profileRouter = express.Router();
const request = require("request");
const ProfileModel = require("./ProfileSchema");
const UserModel = require("../../routes/users/UserSchema");
const PostModel = require("../../routes/post/PostSchema");
const MessageModel = require('../chat/messages/messageSchema');
const auth = require("../../middleware/auth");

// Get the profile of the logged in user
profileRouter.get("/me", auth, async (req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    } else {
      res.json(profile);
      console.log(profile);
    }
  } catch (error) {
    next(error);
  }
});

//@route   POST api/profile
// @desc create or update user profile
// @access  private

profileRouter.post("/", auth, async (req, res, next) => {
  const {
    nationality,
    gender,
    location,
    dateOfBirth,
    bio,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin,
  } = req.body;

  // build profile object
  const profileFields = {};
  profileFields.user = req.user.id;
  if (nationality) profileFields.nationality = nationality;
  if (gender) profileFields.gender = gender;
  if (location) profileFields.location = location;
  if (dateOfBirth) profileFields.dateOfBirth = dateOfBirth;
  if (bio) profileFields.bio = bio;

  if (skills) {
    profileFields.skills = skills.split(",").map((skill) => skill.trim());
  }
  console.log(profileFields.skills);

  // build social object
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (instagram) profileFields.social.instagram = instagram;

  try {
    let profile = await ProfileModel.findOne({ user: req.user.id });
    if (profile) {
      //update
      profile = await ProfileModel.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    } else {
      // create profile
      const profile = new ProfileModel(profileFields);
      await profile.save();
      res.json(profile);
    }
  } catch (error) {
    next(error);
  }
});

// get all profiles

profileRouter.get("/", async (req, res, next) => {
  try {
    const profiles = await ProfileModel.find().populate("user", [
      "name",
      "avatar",
    ]);
    if (profiles.length < 0) {
      const error = new Error("profiles not found");
      error.httpStatusCode = 404;
      next(error);
    } else {
      res.status(200).send(profiles);
    }
  } catch (error) {
    next(error);
  }
});

//@route   GET /profile/user/:user_id
// @desc Get profile by user id
// @access  public

profileRouter.get("/user/:user_id", async (req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (profile) {
      return res.status(200).send(profile);
    } else {
      const error = new Error("there is no profile for this user");
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

//@route   Delete /profile
// @desc delete profile, user and posts
// @access  private

profileRouter.delete("/", auth, async (req, res, next) => {
  try {
    // remove profile
    await ProfileModel.findOneAndRemove({ user: req.user.id });

    // remove user
    await UserModel.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "user deleted" });
  } catch (error) {
    next(error);
  }
});

//@route   PUT /profile/experience
// @desc add profile experience
// @access  private

profileRouter.put("/experience", auth, async (req, res, next) => {
  const {
    title,
    sportsClub,
    location,
    from,
    to,
    current,
    description,
  } = req.body;

  const newExp = {
    title,
    sportsClub,
    location,
    from,
    to,
    current,
    description,
  };
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id });

    // experience is a key in the profile model. we use unshift instead of push because we want to add the experience in the beginning of the array.
    profile.experience.unshift(newExp);
    await profile.save();
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

//@route   PUT /profile/experience/:exp_id
// @desc delete experience from profile
// @access  private

profileRouter.delete("/experience/:exp_id", auth, async (req, res, next) => {
  try {
    const profile = await ProfileModel.findOne({ user: req.user.id });

    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (error) {
    next(error);
  }
});

// delete user profile
profileRouter.delete("/", auth, async (req, res) => {
  try {
    //remove user posts
    await PostModel.deleteMany({ user: req.user.id });
    // remove profile
    await ProfileModel.findOneAndRemove({ user: req.user.id });
    // remove user
    await UserModel.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "user deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

// messages
profileRouter.get('/messages', auth, async (req, res) => {
  const messages = await MessageModel.find();

  res.send(messages);
});

profileRouter.delete('/messages', auth, async (req, res) => {
  await MessageModel.collection.deleteMany();
  res.send('Done');
});

profileRouter.post("/messages", auth, async(req,res)=>{
  const messages = await MessageModel(req.body)
  const newMessage = messages.save()
  res.status(201).send(newMessage)

})
module.exports = profileRouter;
