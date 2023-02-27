const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = socketio(server);
// const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// mongoose.connect("mongodb://127.0.0.1/nativeDB", (err) => {
//   if (err) console.log(err);
//   else console.log("mongdb is connected");
// });

// const socket = require("socket.io-client")(
//   "https://7a15-203-110-242-42.in.ngrok.io"
// );

// socket.on("connect_error", (err) => {
//   console.log(`connect_error due to ${err.message}`);
// });

io.on("connection", (socket) => {
  console.log("New client connected");
  console.log(socket.id);
  // socket.join("New Room");
  // app.post("/", (req, res) => {
  //   console.log(req.body.text);
  //   socket.join(req.body.text);
  //   // socket.disconnect();
  // });

  socket.on("roomName", (roomName) => {
    console.log("Room name1 :" + roomName);
    socket.join(roomName);
  });

  socket.on("message", (msg) => {
    console.log("message received");
    //how to enter room dynamically?
    console.log("Room name2 :" + msg.room);
    io.in(msg.room).emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.disconnect();
  });
});

const PORT = process.env.PORT || 3000;

// Using app.listen(3000) will not work here, as it creates a new HTTP server.
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
