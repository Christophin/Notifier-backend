const { authJwt } = require("../middlewares");
const controller = require("../controllers/post.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.get("/api/post/all", controller.allPosts);
  app.get("/api/post/user", [authJwt.verifyToken], controller.allPostsByUser);
  app.get('/api/post/:id', controller.onePost);
  app.post("/api/post/newpost", [authJwt.verifyToken], controller.newPost)
  app.patch("/api/post/:id", [authJwt.verifyToken], controller.updatePost)
  app.delete("/api/post/mod/:id", [authJwt.verifyToken, authJwt.isModerator], controller.modDeletePost)
  app.delete("/api/post/:id", [authJwt.verifyToken], controller.deletePost)

};
