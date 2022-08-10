const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { expressjwt: jwt } = require("express-jwt")

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/api/user/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminGetUsers
  );
  app.get(
    "/api/user/admin/autosuggest",
    [ authJwt.verifyToken, authJwt.isAdmin],
    controller.userAutosuggest
  );
  app.put(
    "/api/user/admin/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminUserRoles
  );

};
