const Post = require("../models/post-model");
const mongodb = require('mongodb')
let ObjectId = mongodb.ObjectId
const validation = require("../util/verification")

async function getPosts(req, res) {
  const posts = await Post.findAllPosts();
  return res.render("blog", { posts: posts });
}

async function getMyPosts(req, res) {
  const id = String(res.locals._id)
  const posts = await Post.findPostsAuthor(id); 
  return res.render("my-posts", { posts: posts });
}

async function postCreate(req, res){
  var title = req.body.title
  var summary = req.body.summary
  var author = req.body.author
  var content = req.body.content

  if(!validation.validatePostCreation){
    res.session.errorData = {
      hasError : true,
      message: "Wrong input data",
      title: title,
      summary: summary,
      author: author,
      content: content
    }
    res.session.save( function(){
      res.redirect("/myposts")
    })
    return
  }
  var newPost = new Post(title, summary, author, res.locals.email, content)
  await newPost.createPost()
  res.redirect("/myposts")

}

async function deletePost(req, res){
  let id = new ObjectId(req.params.id)
  await Post.deletePost(id)
  res.redirect('/myposts')
}

async function updatePost(req, res){
  let id = new ObjectId(req.params.id)
  const post = await Post.findSingePost(id)
  res.render('update-post', {post: post})
}

module.exports = {
    getPosts: getPosts,
    getMyPosts: getMyPosts,
    postCreate: postCreate,
    deletePost: deletePost,
    updatePost: updatePost
}