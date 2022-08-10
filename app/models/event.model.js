const mongoose = require("mongoose");
const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    desription: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    reminderTime: {
      type: Date
    },
    date: {
      type: Date,
      default: Date.now,
    }
  })
);
module.exports = Event;
