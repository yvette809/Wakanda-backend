const express = require("express");
const mongoose = require("mongoose");
const { join } = require("path");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRouter = require("./src/routes/events");
const authRouter = require("./src/routes/auth");
const userRouter = require("./src/routes/users/users");
const profileRouter = require("./src/routes/profile/profile");
const postRouter = require("./src/routes/post/post");
const passport = require("passport");
const oAuth = require("./src/oAuth/")
const cookieParse = require('cookie-parser');
dotenv.config();
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./src/routes/errorHandler");


const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);


app.use(express.static(path.join(__dirname, "./src/public/images")));

app.use(cookieParse());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/events", eventRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/profiles", profileRouter);
app.use("/posts", postRouter);



// Error handler middleware
app.use(badRequestHandler);
app.use(notFoundHandler);
app.use(genericErrorHandler);

const port = process.env.PORT;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bc5f.mongodb.net/test`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(
    app.listen(port, () => {
      console.log(`server running on port ${port}`);
    })
  )
  .catch((error) => console.log(error));
