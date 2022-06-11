const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsControllers');
const  {isAuth} = require('../severices/auth');

/* GET users listing. */
router.get('/posts',isAuth, (req, res, next) =>{
  postsController.getPosts(req,res,next)
});
router.post('/post', isAuth,(req, res, next)=>{
  postsController.createPost(req, res, next)
})
router.delete('/post/:id', isAuth,(req,res,next)=>{
  postsController.deleteOnePosts(req,res,next)
});
router.patch('/post/:id', isAuth,(req, res, next)=>{
  postsController.updataPosts(req,res,next)
});
router.post('/post/:id/likes',isAuth,(req,res,next)=>{
  postsController.addLikePost(req,res,next)
});
router.delete('/post/:id/likes',isAuth,(req,res,next)=>{
  postsController.deleteLikePost(req,res,next)
});
router.post('/post/:id/comment',isAuth, (req,res,next)=>{
  postsController.addCommentPost(req, res, next);
});
router.get('/post/:postId', isAuth, (req,res,next)=>{
  postsController.getSinglePost(req, res, next);
});
router.get('/post/user/:userId', isAuth, (req,res,next)=>{
  postsController.getUserAllPosts(req,res,next);
});
module.exports = router;
