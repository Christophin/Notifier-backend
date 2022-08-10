const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const authJwt = require("../middlewares/authJwt")
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );
  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/signout", [authJwt.verifyToken], controller.signout)
  app.get("/api/auth/current", [authJwt.verifyToken], controller.currentUser)
};
