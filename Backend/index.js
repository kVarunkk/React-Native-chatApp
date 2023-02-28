const http = require("http");
const socketio = require("socket.io");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { User, Message } = require("./models/File");
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = socketio(server);
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1/nativeDB", (err) => {
  if (err) console.log(err);
  else console.log("mongdb is connected");
});

io.on("connection", (socket) => {
  console.log("New client connected");
  console.log(socket.id);

  socket.on("signUp", (user) => {
    const dbUser = new User({
      username: user.username,
      password: user.password,
    });

    dbUser.save();
  });

  socket.on("roomName", (roomName) => {
    socket.join(roomName);
  });

  socket.on("message", async (msg) => {
    console.log("message received");

    User.findOne({ username: msg.postedBy.username }, (err, user) => {
      const dbMessage = new Message({
        content: msg.content,
        postedBy: user._id,
        time: msg.time,
        room: msg.room,
      });
      dbMessage.save();

      user.messages.push(dbMessage._id);
      user.save();
    });

    io.in(msg.room).emit("message", msg);
  });

  socket.on("getMessages", (room) => {
    //find a way to get the username of previouse messages from the database
    Message.find({ room: room })
      .populate("postedBy")
      .exec((err, messages) => {
        io.in(room).emit("setMessages", messages);
      });
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
