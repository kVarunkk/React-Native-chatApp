const http = require("http");
const socketio = require("socket.io");
const express = require("express");

const app = express();
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

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });
});

const PORT = process.env.PORT || 3000;

// Using app.listen(3000) will not work here, as it creates a new HTTP server.
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
