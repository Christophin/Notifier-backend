const db = require("../models");
const Group = db.group;
const User = db.user;

exports.allGroupsById = async(req, res) => {
  try {
    const groups = await Group.find()
      .where("members").in(req.userId)
      .populate("creator")
      .exec()
    res.status(200).json(groups)
  } catch(err) {
    console.log("err", err)
    res.status(400).json({ message: err })
  }
}

exports.groupById = async(req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator')
      .populate('members')
      .populate('leads')
      .populate('admins')
      .populate('events')
      .exec()
    if(!group) throw Error("Group not found")
    res.status(200).json(group)
  } catch(err) {
    console.log("err", err)
    res.status(400).json({ message: err })
  }
}

exports.newGroup = async (req, res) => {
  const newGroup = new Group({
    name: req.body.name,
    description: req.body.description,
    creator: req.userId,
    members: [req.userId],
    leads: [req.userId],
    admins: [req.userId],
    events: []
  });
  try {
    const user = await User.findById(req.userId)
    if(!user) throw Error("User not found")
    const group = await newGroup.save();
    if(!group) throw Error('Something went wrong with the post')
    user.groups.push(group._id)
    const savedUser = await user.save()
    if(!savedUser) throw Error("something went wrong with saving the user")
    res.status(200).json(group);
  } catch(err) {
    res.status(400).json({message: err.message})
  }
};

exports.addMemberToGroup = async(req, res) => {
  try {
    const user = await User.findOne().where("username").equals(req.body.username)
    if(!user) throw Error("user not found!")

    const group = await Group.findById(req.params.id)
    if(!group) throw Error("Group not found!")

    let alreadyMember = false
    group.members.forEach(member => {
      if(String(member) === String(user._id)) {
        alreadyMember = true
      }
    })
    if(alreadyMember) throw Error("User already a member!")

    group.members.push(user._id)
    const savedGroup = await group.save()
    if(!savedGroup) throw Error("Something went wrong saving the group")

    user.groups.push(group._id)
    const savedUser = await user.save()
    if(!savedUser) throw Error("Something went wrong saving the user.")

    res.status(200).send(savedGroup)
  } catch(err) {
    console.log("err", err);
    res.status(500).json({ message: err.message })
  }
}

exports.removeMember = async(req, res) => {
  try {
    const user = await User.findById(req.body.id)
    if(!user) throw Error("User not found!")

    const group = await Group.findById(req.params.id)
    if(!group) throw Error("Group not found!")

    let isMember = false
    group.members.forEach(member => {
      if(String(member) === String(user.id)) {
        isMember = true
      }
    })
    if(!isMember) throw Error("User is not a member of this group")
    group.members.pull(user.id)
    const savedGroup = await group.save()
    if(!savedGroup) throw Error("Something went wrong with saving the group")

    user.groups.pull(group.id)
    const savedUser = await user.save()
    if(!savedUser) throw Error("Something went wrong with saving the user")

    res.status(200).send(savedGroup)
  } catch (err) {
    console.log("err", err.message);
    res.status(500).json({ message: err.message })
  }
}

exports.addLead = async(req, res) => {
  try {
    const user = await User.findById(req.body.id)
    if(!user) throw Error("something went wrong with finding the user")

    const group = await Group.findById(req.params.id)
    if(!group) throw Error("Something went wrong finding the group")

    let isMember = false
    group.members.forEach(member => {
      if(String(member) === String(user.id)) {
        isMember = true
      }
    })
    if(!isMember) throw Error("User must be a member of the group to be a lead")

    let isLead = false
    group.leads.forEach(lead => {
      if(String(lead) === String(user.id)) {
        isLead = true
      }
    })
    if(isLead) throw Error("Member is already a lead")

    group.leads.push(user.id)
    const savedGroup = await group.save()
    if(!savedGroup) throw Error("Something went wrong saving the group")
    res.status(200).send(savedGroup)
  } catch(err) {
    console.log("err in addLead", err);
    res.status(500).json({ message: err.message })
  }
}

exports.removeLead = async(req, res) => {
  try {
    const user = await User.findById(req.body.id)
    if(!user) throw Error("User not found!")

    const group = await Group.findById(req.params.id)
    if(!group) throw Error("Group not found!")

    let isLead = false
    group.leads.forEach(lead => {
      if(String(lead) === String(user.id)) {
        isLead = true
      }
    })
    if(!isLead) throw Error("Member is not a lead")
    group.leads.pull(user.id)

    const savedGroup = await group.save()
    if(!savedGroup) throw Error("Group not saved")
    res.status(200).send(savedGroup)
  } catch(err) {
    console.log("err in remove lead", err);
    res.status(500).json({ message: err.message})
  }
}

exports.addAdmin = async(req, res) => {
  try {
    const user = await User.findById(req.body.id)
    if(!user) throw Error("User not found!")

    const group = await Group.findById(req.params.id)
    if(!group) throw Error("Group not found!")

    let isMember = false
    group.members.forEach(member => {
      if(String(member) === String(user.id)) {
        isMember = true
      }
    })
    if(!isMember) throw Error("User must be a member of the group to be an admin")

    let isAdmin = false
    group.admins.forEach(admin => {
      if(String(admin) === String(user.id)) {
        isAdmin = true
      }
    })
    if(isAdmin) throw Error("Member is already an admin!")

    group.admins.push(user.id)

    const savedGroup = await group.save()
    if(!savedGroup) throw Error("something went wrong saving the group")

    res.status(200).send(savedGroup)
  } catch(err) {
    console.log("err in add admin", err);
    res.status(500).json({ message: err })
  }
}

exports.removeAdmin = async(req, res) => {
  try {
    const user = await User.findById(req.body.id)
    if(!user) throw Error("User not found!")
    console.log("user vs user", String(user.id) === req.userId);
    if(String(user.id) === req.userId) throw Error("you cannot remove yourself as admin.")

    const group = await Group.findById(req.params.id)
    if(!group) throw Error("Group not found")

    let isAdmin = false
    group.admins.forEach(admin => {
      if(String(admin) === String(user.id)) {
        isAdmin = true
      }
    })
    if(!isAdmin) throw Error("Member is not an admin!")

    group.admins.pull(user.id)
    const savedGroup = await group.save()
    if(!savedGroup) throw Error("Error saving the group")
    res.status(200).send(savedGroup)
  } catch(err) {
    console.log("err in remove admin", err);
    res.status(500).json({ message: err })
  }
}
