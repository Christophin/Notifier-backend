const db = require("../models");
const Comment = db.comment;
const Post = db.post

exports.newComment = async(req, res) => {
  //req.body
  const newComment = new Comment({
    content: req.body.content,
    post: req.params.id,
    user: req.userId,
    votes: [req.userId]
  });
  try {
    const comment = await newComment.save();
    if(!comment) throw Error('Something went wrong with saving the comment.')

    const post = await Post.findById(comment.post)
    if(!post) throw Error('Something went wrong with finding the post.')

    post.comments.push(comment._id)
    
    const savedPost = await post.save()
    if(!savedPost) throw Error("Something went wrong with updating the post.")

    res.status(200).json(comment);
  } catch(err) {
    console.log("error", err)
    res.status(400).json({message: err})
  }
}
