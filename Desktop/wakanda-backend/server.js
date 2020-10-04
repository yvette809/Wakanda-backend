const express = require("express");
const mongoose = require("mongoose");
const server = express();
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const eventRouter = require("./src/routes/events");
const messageRouter = require("./src/routes/message");
const authRouter = require("./src/routes/auth");
const userRouter = require("./src/routes/users/users");
const profileRouter = require("./src/routes/profile/profile");
const postRouter = require("./src/routes/post/post");
dotenv.config();
const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./src/routes/errorHandler");
const { Mongoose } = require("mongoose");

server.use(cors());
server.use(express.json());
server.use(
  express.urlencoded({
    extended: false,
  })
);

// Routes
server.use("/events", eventRouter);
server.use("/auth", authRouter);
server.use("/users", userRouter);
server.use("/profiles", profileRouter);
server.use("/posts", postRouter);
// server.use("/email", messageRouter)

// serve static assets in production
// if(process.env.NODE_ENV ==='production'){
//   //set static folder
//   server.use(express.static('wakanda-frontend/build'))

//   server.get('*', (req,res)=>{
//     res.sendFile(path.resolve(__dirname, 'wakanda-frontend', 'build', 'index.html'))
//   })
// }

// Error handler middleware
server.use(badRequestHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

const port = process.env.PORT;

mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4bc5f.mongodb.net/test`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log(`server running on port ${port}`);
    })
  )
  .catch((error) => console.log(error));

// mongoose.connect("mongodb://localhost:27017/students-profile",{
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// })
// .then(
//     server.listen(port, () =>{
//         console.log(`something is runnning on port ${port}`)
//     })
// )
// .catch(error => console.log(error)

// )
