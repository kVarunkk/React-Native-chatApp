const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const messageSchema = new mongoose.Schema({
  content: {
    type: Object,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  time: {
    type: String,
  },
  room: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { User, Message };
