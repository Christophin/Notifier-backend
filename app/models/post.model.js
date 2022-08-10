const mongoose = require("mongoose");
const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    imgUrl: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    votes: [mongoose.Schema.Types.ObjectId],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    date: {
      type: Date,
      default: Date.now,
    }
  })
);
module.exports = Post;


// ,{
// virtuals:{
//   id:{
//     get() {
//       return this._id;
//     }
//     // set(v) {
//     //   this.name.first = v.substr(0, v.indexOf(' '));
//     //   this.name.last = v.substr(v.indexOf(' ') + 1);
//     // }
//   }
// },
// toObject: {
//     virtuals: true
//   }
// ,toJSON: {
//     virtuals: true
//   }
// }
