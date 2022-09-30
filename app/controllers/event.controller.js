const db = require("../models");
const Event = db.event;
const Group = db.group

exports.newEvent = async(req, res) => {
  console.log("req", req.body, req.userId)
  const newEvent = new Event({
    name: req.body.name,
    description: req.body.description,
    creator: req.params.groupId,
    groups: [],
    comments: [],
    restricted: req.body.private
  })
  newEvent.groups.push(req.params.groupId)
  try {
    const group = await Group.findById(req.params.groupId)
    if(!group) throw Error("Group not found")

    const savedEvent = await newEvent.save()
    if(!savedEvent) throw Error("Something went wrong saving the event")
    console.log("group before", group);
    group.events.push(savedEvent._id)
    console.log("group after", group);
    const savedGroup = group.save()
    if(!savedGroup) throw Error("Something went wrong saving the group")

    res.status(200).send(group)
  } catch(err) {
    console.log("err in new event", err);
    res.status(500).json({ message: err })
  }
}

exports.getEvent = async(req, res) => {
  try {
    const singleEvent = await Event.findById(req.params.eventId)
      .populate("creator")
    if(!singleEvent) throw Error("event not found")
    res.status(200).send(singleEvent)
  } catch(err) {
    console.log("err in get event", err);
    res.status(500).json({ message: err })
  }
}

exports.removeEvent = async(req, res) => {
  console.log("inside removeEvent", req.params, req.body);
  try {
    const singleEvent = await Event.findById(req.params.eventId)
    if(!singleEvent) throw Error("Event not found")
    console.log("group compare", String(singleEvent.creator), req.params.groupId);
    if(String(singleEvent.creator) === req.params.groupId) {
      console.log("this group created the event!");
      const deletedEvent = await singleEvent.delete()
      if(!deletedEvent) throw Error("something went wrong deleteing the event")
      res.status(200).send(deletedEvent)
    } else {
      res.status(401).json({ message: "This group did not create this event!"})
    }
  } catch(err) {
    console.log("err in removeEvent", err);
    res.status(500).json({ message: err })
  }
}

exports.toggleEventBools = async(req, res) => {
  try {
    const singleEvent = await Event.findById(req.params.eventId)
    if(!singleEvent) throw Error("Event not found!")
    if(String(singleEvent.creator) === req.params.groupId) {
      singleEvent[req.body.name] = req.body.value
      const savedEvent = await singleEvent.save()
      if(!savedEvent) throw Error("something went wrong saving the event")
      res.status(200).send(savedEvent)
    } else {
      res.status(401).json({ message: "This group did not create this event"})
    }
  } catch(err) {
    console.log("err in toggleEnabled", err);
    res.status(500).json({ message: err })
  }
}

exports.reminderTime = async(req, res) => {
  try {
    const singleEvent = await Event.findById(req.params.eventId)
    if(!singleEvent) throw Error("Event not found!")
    if(String(singleEvent.creator) === req.params.groupId) {
      singleEvent.reminderTime = req.body.reminderTime
      const savedEvent = await singleEvent.save()
      if(!savedEvent) throw Error("something went wrong saving the event")
      res.status(200).send(savedEvent)
    } else {
      res.status(401).json({ message: "This group did not create this event"})
    }
  } catch(err) {
    console.log("err in reminderTime", err);
    res.status(500).json({ message: err })
  }
}

exports.handleRepeat = async(req, res) => {
  try {
    const singleEvent = await Event.findById(req.params.eventId)
    if(!singleEvent) throw Error("event not found!")
    if(String(singleEvent.creator) === req.params.groupId) {
      singleEvent.repeat = req.body.repeat
      const savedEvent = await singleEvent.save()
      if(!savedEvent) throw Error("Something went wrong saving the event")
      res.status(200).send(savedEvent)
    } else {
      res.status(401).json({ message: "This group did not create this event" })
    }
  } catch(err) {
    console.log("err in handle repeat", err);
    res.status(500).json({ message: err })
  }
}
