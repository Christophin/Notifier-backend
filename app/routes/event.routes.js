const controller = require("../controllers/event.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/api/group/:groupId/event", [authJwt.verifyToken, authJwt.isGroupLead], controller.newEvent)
  app.get("/api/event/:eventId", [authJwt.verifyToken], controller.getEvent)
  app.delete("/api/group/:groupId/event/:eventId", [authJwt.verifyToken, authJwt.isGroupLead, authJwt.isEventCreator], controller.removeEvent)
  app.put("/api/group/:groupId/event/:eventId", [authJwt.verifyToken, authJwt.isGroupLead, authJwt.isEventCreator], controller.toggleEventBools)
  app.put("/api/group/:groupId/event/:eventId/reminderTime", [authJwt.verifyToken, authJwt.isGroupLead, authJwt.isEventCreator], controller.reminderTime)
  app.put("/api/group/:groupId/event/:eventId/repeat", [ authJwt.verifyToken, authJwt.isGroupLead, authJwt.isEventCreator], controller.handleRepeat)
};
