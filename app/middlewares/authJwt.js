const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Group = db.group;
const Event = db.event;

verifyToken = (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.SECRET, (err, decoded) => {
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
      next()
      return
    }
    res.status(403).send({ message: "Requires Moderator Role!" })
  } catch(err) {
    res.status(500).send({ message: err })
  }
};
isGroupAdmin = async(req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId)
    if(!group) throw Error("Group not found!")
    const filteredAdmin = group.admins.filter(admin => {
      return String(admin) === req.userId
    })
    if(filteredAdmin.length > 0) {
      console.log("found admin");
      next()
      return
    }
    res.status(403).send({ message: "Requires group admin role!"})
  } catch(err) {
    console.log("err", err);
    res.status(500).json({ message: err})
  }
};
isGroupLead = async(req, res, next) => {
  try {
    const group = await Group.findById(req.params.groupId)
    if(!group) throw Error("group not found in isGroupLead")
    const filteredLead = group.leads.filter(lead => {
      return String(lead) === req.userId
    })
    if(filteredLead.length > 0) {
      next()
      return
    }
    res.status(403).send({ message: "Requires group lead role!"})
  } catch(err) {
    console.log("err in islead", err)
    res.status(500).json({ message: err })
  }
};
isEventCreator = async(req, res, next) => {
  try {
    const singleEvent = await Event.findById(req.params.eventId)
    if(!singleEvent) throw Error("event not found in is event creator")
    if(String(singleEvent.creator) === req.params.groupId) {
      next()
      return;
    } else {
      res.status(403).send({ message: "This group is not the creator of the Event"})
    }
  } catch(err) {
    console.log("err in is event creator", err);
    res.status(500).json({ message: err })
  }
}
const authJwt = {
  verifyToken,
  isAdmin,
  isModerator,
  isGroupAdmin,
  isGroupLead,
  isEventCreator
};
module.exports = authJwt;
