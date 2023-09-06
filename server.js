require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3500;
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const { logger } = require("./middleware/logger");
const { logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
// const { error } = require("console");
// connect database.
connectDB();
// using logger, when the code gets inside this logger module it logs the requests requested by the user.
app.use(logger);
// using express.json(), this is a JSON parser
app.use(express.json());
// using CORS to allow public API Access
app.use(cors(corsOptions));
//using express.static for static files
app.use("/", express.static(path.join(__dirname, "public")));
// this is to evaluate the get request of root route "/"
app.use("/", require("./routes/root"));
// this is to evaluate requests for authorization
app.use("/auth", require("./routes/authRoutes"));
// this is to evaluate all http request regarding "/users"
app.use("/users", require("./routes/userRoutes"));

app.use("/notes", require("./routes/noteRoutes"));

//this is a 404 handler, if the request isnt dealtup with until now and there is no respone then this will get called.
app.all("*", (req, res) => {
  res.status(404);
  // req.accepts means that what the browser wants/accepts based on the request by the user. it either be html json.
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connection to mongoDB is successfull");
  app.listen(PORT, () => {
    console.log("Server Running on port : " + PORT);
  });
});

mongoose.connection.on("error", (err) => {
  logEvents(
    `${err.no}\t${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrorLog.log"
  );
});
