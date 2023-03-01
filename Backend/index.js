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

//for encryption and decryption
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = Buffer.from(
  "232f150296ffd446fc0b39fa32d1c1d42c2e232ccd3203df729b7f3c3c63a5da2",
  "hex"
);
const iv = crypto.randomBytes(16);

//encryption function
function encrypt(text) {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

//decryption function
function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  decipher.setAutoPadding((auto_padding = true));
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

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
      password: encrypt(user.password).encryptedData,
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
        content: encrypt(msg.content.decryptedMessage),
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
    Message.find({ room: room })
      .populate("postedBy")
      .exec((err, messages) => {
        if (!err) {
          let temporaryMessages = JSON.parse(JSON.stringify(messages));

          if (temporaryMessages.length > 0) {
            temporaryMessages.map((temporaryMessage) => {
              try {
                temporaryMessage.content = {
                  decryptedMessage: decrypt(temporaryMessage.content),
                };
                console.log(decrypt(temporaryMessage.content));
              } catch (error) {
                console.log(error);
              }
            });
          }
          io.in(room).emit("setMessages", temporaryMessages);
        } else console.log(err);
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
