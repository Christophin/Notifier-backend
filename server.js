const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./app/models");
const Role = db.role;
const Event = db.event;
const Group = db.group;
const { expressjwt: jwt } = require("express-jwt")
const cookieSession = require("cookie-session");
const cookieParser = require('cookie-parser');
const config = { headers: { 'Content-Type': 'application/json', },withCredentials: true,}
const dotenv = require('dotenv')
dotenv.config()
const corsOptions = {
  origin: "http://localhost:8081"
};
const cron = require('node-cron');
const nodemailer = require('nodemailer')
let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASSWORD
      }
});

app.use(cors(corsOptions));
app.use(cookieParser());
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the back end of the application." });
});

db.mongoose
  .connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}/${process.env.DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

async function processEventTimes(date) {
  const day = date.toDateString()
  const hour = date.getHours()
  const minute = date.getMinutes()
  try {
    const events = await Event.find()
      .exec()
    if(!events) throw Error("No events found")
    const matchingEvents = events.filter(singleEvent => {
      return (
        singleEvent.enabled &&
        day === singleEvent.reminderTime.toDateString() &&
        hour === singleEvent.reminderTime.getHours() &&
        minute === singleEvent.reminderTime.getMinutes()
      )
    })
    console.log("matching after filter" , matchingEvents);
    if(matchingEvents.length > 0) {
      console.log("inside matching events!!!!", matchingEvents);
      for(let i = 0; i < matchingEvents.length; i++) {
        const groups = await Group.find({ events: matchingEvents[i]._id })
          .populate('members')
        if(!groups) throw Error("No groups attachted to event")
        console.log("groups", groups);
        for(let j = 0; j < groups.length; j++) {
          console.log("group members", groups[j].members, groups[j].members);
        }
      }
    }
  } catch(err) {
    console.log("error in finding the events", err);
  }
}

async function initial() {
  cron.schedule('* * * * * ', () => {
    const date = new Date();
    console.log("we scheduled a cron task!!", date);
    processEventTimes(date)

  });
}
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/post.routes')(app);
require('./app/routes/comment.routes')(app);
require('./app/routes/group.routes')(app);
require('./app/routes/event.routes')(app);
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
