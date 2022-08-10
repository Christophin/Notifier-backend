const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Group = db.group

verifyToken = (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
isAdmin = async(req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("roles", "-__v")
      .exec()
    if(!user) throw Error("User not found")
    for (let i = 0; i < user.roles.length; i++) {
      if (user.roles[i].name === "admin") {
        next();
        return;
      }
    }
    res.status(403).send({ message: "Requires Admin Role!" })
  } catch(err) {
    res.status(500).send({ message: err })
  }
};
isModerator = async(req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("roles", "-__v")
      .exec()
    if(!user) throw Error("User not found")
    const moderator = user.roles.filter(role => {
      role.name === "moderator"
    })
    if(moderator) {
      console.log("Found moderator")
      next()
      return
    }
    res.status(403).send({ message: "Requires Moderator Role!" })
  } catch(err) {
    res.status(500).send({ message: err })
  }
};
isGroupAdmin = async(req, res, next) => {
  console.log("inside group admin")
  try {
    const group = await Group.findById(req.params.id)
    if(!group) throw Error("Group not found!")
    const filteredAdmin = group.admins.filter(admin => {
      console.log("filering admins", String(admin) === req.userId)
      return String(admin) === req.userId
    })
    console.log("admin", filteredAdmin)
    if(filteredAdmin.length > 0) {
      console.log("found admin");
      next()
      return
    }
    res.status(403).send({ message: "Requires group admin role!"})
  } catch(err) {
    console.log("err", err);
  }
};
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isGroupAdmin
};
module.exports = authJwt;
