const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});
const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.role = require("./role.model");
db.post = require("./post.model");
db.group = require("./group.model");
db.event = require("./event.model")
db.comment = require("./comment.model")
db.ROLES = ["user", "admin", "moderator"];
module.exports = db;
