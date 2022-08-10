const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
var bcrypt = require("bcryptjs");
const jsonwebtoken = require('jsonwebtoken');

exports.signup = async(req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    groups: []
  });
  try {
    if(req.body.roles) {
      const roles = await Role.find(
        {
          name: { $in: req.body.roles}
        }
      )
      if(!roles) throw Error ("Something went wrong finding the roles")

      newUser.roles = roles.map(role => role._id)

      const user = await newUser.save()
      if(!user) throw Error("Something went wrong with saving the user")

      res.send({ message: "User was registered successfully"})
    } else {
      const role = await Role.findOne({ name: "user" })
      if(!role) throw Error("Something went wrong finding the user role")

      newUser.role = [role._id]

      const user = await newUser.save()
      if(!user) throw Error("Something went wrong saving the user")
      res.send({message: "User was registered successfully"})
    }
  } catch(err) {
    console.log("err", err)
    res.status(500).send({ message: err });
  }

};
exports.signin = async(req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username
    })
      .select("+password")
      .populate("roles", "-__v")
      .populate("groups", "-__v")
      .exec()
    if(!user) throw Error("User not found")

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    )
    if(!passwordIsValid) throw Error("Invalid Password")
    let userBanned = false
    user.roles.forEach(role => {
      if(role.name === "banned") {
        userBanned = true
      }
    })
    if(userBanned) {
      console.log("user banned", user)
      res.status(403).send({ message: "User had been banned"})
    }
    const token = jsonwebtoken.sign({ id: user._id}, config.secret, {
      expiresIn: 86400 // 24 hours
    })
    res.cookie('token', token, { httpOnly: true });
    let authorities = [];
    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      groups: user.groups
    });
  } catch(err) {
    console.log("err", err)
    res.status(500).send({ message: err})
  }
};
exports.signout = async (req, res, next) => {
  console.log("signout")
  try {
    res.clearCookie('token')
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
}
exports.currentUser = async(req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("roles", "-__v")
      .populate("groups", "-__v")
      .exec()
    if(!user) throw Error("something went wrong finding the user")
    let userBanned = false
    user.roles.forEach(role => {
      if(role.name === "banned") {
        userBanned = true
      }
    })
    if(userBanned) {
      console.log("user banned", user)
      res.status(403).send({ message: "User had been banned"})
    }
    let authorities = [];
    user.roles.forEach(role => {
      authorities.push("ROLE_" + role.name.toUpperCase());
    })
    user.groups.map(group => {
      group.id = group._id
      delete group._id
      console.log("group", group)
    })
    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      roles: authorities,
      groups: user.groups
    });
  } catch(err) {
    console.log("err", err)
    res.status(500).send({ message: err })
  }
}
