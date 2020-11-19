const express = require("express");
const eventRouter = express.Router();
const q2m = require("query-to-mongo");
const EventModel = require("./schema");
const UserModel = require("../users/UserSchema");
const { auth } = require("../../middleware/auth");

// get all events
eventRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const events = await EventModel.find(query.criteria, query.options.fields)
      .populate("user", "name avatar")
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);

    res.send({
      data: events,
      total: events.length,
    });
  } catch (error) {
    next(error);
  }
});

// get a specific event

eventRouter.get("/:id", async (req, res, next) => {
  try {
    const event = 
      await EventModel.findById(req.params.id)
    .populate("user", ["name", "avatar"]);

    if (event) {
      res.status(200).send(event);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});

// // create an event
// eventRouter.post ("/", async(req,res,next)=>{
//     const newEvent = new EventModel(req.body)
//     const response = await newEvent.save()
//     res.status(201).send(response)
// })

// update event
eventRouter.put("/:id", async (req, res, next) => {
  try {
    const event = await EventModel.findByIdAndUpdate(req.params.id, req.body);
    if (event) {
      res.status(200).send(event);
    } else {
      const error = new Error();
      error.httpStatusCode = 404;
      next(error);
    }
  } catch (error) {
    next(error);
  }
});


// create new review
eventRouter.post("/:id/reviews", auth, async (req, res, next) => {
  const { comment, user, rating } = req.body;

  const event = await EventModel.findById(req.params.id);

  if (event) {
    const alreadyReviewed = event.reviews.find(
      (r) => r.user.toString() === user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("event already reviewed");
    }

    const review = {
      name: user.name,
      rating: Number(rating),
      comment,
      user: user._id,
    };

    console.log("REVIEW", review);

    event.reviews.push(review);

    event.numReviews = event.reviews.length;
    event.rating =
      event.reviews.reduce((acc, item) => item.rating + acc, 0) /
      event.reviews.length;

    await event.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("review not added");
  }
});

// delete event

eventRouter.delete("/:id", async (req, res, next) => {
    try {
      const event = await EventModel.findByIdAndDelete(req.params.id);
      if (event) {
        res.status(200).send("deleted");
      } else {
        const error = new Error();
        error.httpStatusCode = 404;
        next(error);
      }
    } catch (error) {
      next(error);
    }
  });
  

  
// create a new event
eventRouter.post("/", auth, async (req, res, next) => {
    try {
      
      const newEvent = new EventModel({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        time: req.body.time,
        location: req.body.location,
        date: req.body.date,
        user: req.user.id,
      });
  
      console.log(newEvent);
  
      const event = await newEvent.save();
      console.log(event);
      res.json(event);
    } catch (error) {
      next(error);
    }
  });
  

module.exports = eventRouter;
