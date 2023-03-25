const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const socket = require("socket.io");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const { resourceUsage } = require("process");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const server = app.listen("3000", () => {
  console.log(`Server started on http://localhost:3000`);
});

const io = socket(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log("user joined at room " + roomId);
  });

  socket.on("textChange", (dataRC) => {
    const { inputVal, RoomId } = dataRC;
    console.log("text From room " + RoomId + ":" + inputVal);
    socket.to(RoomId).emit("UpdateText", inputVal);
  });
});
