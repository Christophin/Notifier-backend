const mongoose = require("mongoose");
const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    },
    date: {
      type: Date,
      default: Date.now,
    },
    enabled: {
      type: Boolean,
      default: false
    },
    groups: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group"
    }],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    recurring: {
      type: Boolean,
      default: false
    },
    reminderTime: {
      type: Date,
      default: Date.now()
    },
    repeat: {
      type: String,
      default: "yearly"
    },
    restricted: Boolean,
    wasSent: Boolean
    // This idea but for repetitive alerts.
  })
);

module.exports = Event;
