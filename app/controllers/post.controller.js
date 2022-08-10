const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const db = require("../models");
const Post = db.post;
const Comment = db.comment;

exports.allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('comments')
      .populate('user')
    if(!posts) throw Error('No Items');
    res.status(200).json(posts);
  }catch(err) {
    res.status(400).json({message: err})
  }

};

exports.allPostsByUser = async (req, res) => {
  try {
    const posts = await Post.find({
      user: req.userId
    })
    .populate('comments');
    if(!posts) throw Error('No Items');
    res.status(200).json(posts);
  }catch(err) {
    console.log(err)
    res.status(400).json({message: err})
  }
}

exports.newPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const post = await newPost.save();
    if(!post) throw Error('Something went wrong with the post')
    res.status(200).json(post);
  } catch(err) {
    res.status(400).json({message: err})
  }

};

exports.onePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user')
      .populate({
        path: 'comments',
        populate: { path: 'user'}
      })

    if(!post) throw Error('No Items');
    console.log(post)
    res.status(200).json(post);
  }catch(err) {
    res.status(400).json({message: err})
  }
};

exports.updatePost = async(req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body);
    if(!post) throw Error('Something went wrong while updating the post');
    res.status(200).json({success: true});
  }catch(err) {
    res.status(400).json({message:err});
  }
};

exports.deletePost = async(req, res) => {
  console.log("am I here?")
  try {
    const post = await Post.findById(req.params.id);
    if(!post) throw Error('No post found!');
    if( post.user.toString() === req.userId) {
      const deletedPost = await post.delete()
      if(!deletedPost) throw Error("Something went wrong deleting the post")
      res.status(200).json({success: true})
    } else {
      throw Error("You do not have permission to delete this post.")
    }

  } catch(err) {
    res.status(400).json({message: err})
  }
}

exports.modDeletePost = async(req, res) => {
  console.log("inside modDeletePost", req.params.id)
  try {
    const post = await Post.findById(req.params.id)
    if(!post) throw Error("something went wrong with finding the post")
    const deletedPost = await post.delete()
    if(!deletedPost) throw Error("Something went wrong with deleting the post")
    res.status(200).json({ success: true })
  } catch(err) {
    console.log("err", err)
    res.status(400).json({message: err})
  }
}
