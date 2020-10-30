const mongoose = require("mongoose");

const ProfileSChema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  nationality: {
    type: String,
    required: [true, "nationality is required"],
  },
  gender: {
    type: String,
  },
  location: {
    type: String,
    required: [true, "location is required"],
  },
  dateOfBirth: {
    type: String,
    required: [true, "date of birth required"],
  },

  bio: {
    type: String,
  },

  image:{
    type:String,
  
  },

  skills: {
    type: [String],
    required: [true, "skills is required"],
  },

  experience: [
    {
      title: {
        type: String,
        required: true,
      },

      sportsClub: {
        type: String,
        required: true,
      },

      location: {
        type: String,
      },
      from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
     
    },
  ],

  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
});

const ProfileModel = mongoose.model("profile", ProfileSChema);

module.exports = ProfileModel;
