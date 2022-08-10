const db = require("../models");
const User = db.user;
const Role = db.role;

exports.adminGetUsers = async (req, res) => {
  console.log("inside adminGetUsers", req.body)
  try {
    const users = await User.find()
      .populate("roles", "-__v")
      .populate("groups", "-__v")
    if(!users) throw Error("Something went wrong finding all users for admin.")

    let userAuthorities = users.map(user => {
      let authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities
      }
    })
    res.status(200).json(userAuthorities)
  } catch(err) {
    console.log("err", err)
    res.status(400).json({message: err})
  }
}

exports.adminUserRoles = async(req, res) => {
  console.log("req", req.body)
  try {
    let user = await User.findById(req.params.id)
      .exec()
    if(!user) throw Error("User not found")
    const actionRole = req.body.value.split("-")
    const role = await Role.find(
        {
          name: actionRole[1]
        }
    )
    if(!role) throw Error("something went wrong with finding the role")
    if(actionRole[0] === "add") {
      user.roles.push(role[0]._id)
      const savedUser = await user.save()
      if(!savedUser) throw Error("something went wrong with saving the user")
      res.status(200).send(savedUser)
    } else if(actionRole[0] === "remove") {
      user.roles.pull(role[0]._id)
      const savedUser = await user.save()
      if(!savedUser) throw Error("something went wrong with saving the user")
      res.status(200).send(savedUser)
    }
  } catch(err) {
    console.log("err", err)
    res.status(400).json({ message: err })
  }
}

exports.userAutosuggest = async(req, res, next) => {
  console.log("We did it", req.query)
  try {
    const suggestions = await User.find({ username: { $regex: req.query.value, $options: "i" } })
    res.status(200).send(suggestions)
  } catch(err) {
    console.log("err", err)
    res.status(400).json({ message: err })
  }
}
