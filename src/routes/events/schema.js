const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },

    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const EventsSchema = new Schema({

    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
  title: {
    type: String,
    required: [true, "Title is required"],
  },

  description: {
    type: String,
    required: [true, "An event must have a description"],
  },
  image: {
    type: String,
    required: [true, "Event image is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
  numReviews:{
      type:Number,
      required:true,
      default:0
  }
});

const EventModel = mongoose.model("event", EventsSchema);
module.exports = EventModel;
