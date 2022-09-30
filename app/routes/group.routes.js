const controller = require("../controllers/group.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/group/user/:id",[authJwt.verifyToken], controller.allGroupsById);
  app.get("/api/group/:groupId", [authJwt.verifyToken], controller.groupById)
  app.post("/api/group", [authJwt.verifyToken], controller.newGroup)
  app.put("/api/group/member/:groupId", [authJwt.verifyToken, authJwt.isGroupAdmin], controller.addMemberToGroup)
  app.put("/api/group/member/remove/:groupId", [authJwt.verifyToken, authJwt.isGroupAdmin], controller.removeMember)
  app.put("/api/group/lead/:groupId", [authJwt.verifyToken, authJwt.isGroupAdmin], controller.addLead)
  app.put("/api/group/lead/remove/:groupId", [authJwt.verifyToken, authJwt.isGroupAdmin], controller.removeLead)
  app.put("/api/group/admin/:groupId", [ authJwt.verifyToken, authJwt.isGroupAdmin], controller.addAdmin)
  app.put("/api/group/admin/remove/:groupId", [authJwt.verifyToken, authJwt.isGroupAdmin], controller.removeAdmin)
};
