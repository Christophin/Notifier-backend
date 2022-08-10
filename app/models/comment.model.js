const mongoose = require("mongoose");
const Comment = mongoose.model(
  "Comment",
  new mongoose.Schema({
    content: String,
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    votes: [mongoose.Schema.Types.ObjectId],
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    },
    date: {
      type: Date,
      default: Date.now,
    }
  })
);
module.exports = Comment;
