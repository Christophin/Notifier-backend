const { authJwt } = require("../middlewares");
const controller = require("../controllers/comment.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();

  })
  app.post("/api/comment/:id", [authJwt.verifyToken], controller.newComment)
  //app.patch("/api/post/:id", [authJwt.verifyToken], controller.updatePost)
  //app.delete("/api/post/:id", [authJwt.verifyToken], controller.deletePost)
}
