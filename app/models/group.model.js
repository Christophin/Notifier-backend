const mongoose = require("mongoose");
const Group = mongoose.model(
  "Group",
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
      ref: "User"
    },
    members: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
      }
    ],
    leads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
      }
    ],
    date: {
      type: Date,
      default: Date.now,
    }
  })
);
module.exports = Group;
