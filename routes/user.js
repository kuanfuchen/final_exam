const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userControllers')
const  {isAuth} = require('../severices/auth');

router.get('/profile', isAuth,(req,res,next)=>{
  usersController.userProfile(req,res,next);
});
router.post('/sign_up',(req,res,next)=>{
  usersController.userSignUp(req,res,next);
});
router.post('/sign_in',(req,res,next)=>{
  usersController.userSignIn(req,res,next)
});
router.post('/updata_password', isAuth,(req,res,next)=>{
  usersController.userUpdatePassword(req,res,next)
});
router.patch('/profile', isAuth, (req,res,next)=>{
  usersController.userPatchUpdatePersonalInfo(req, res, next);
});
router.get('/getLikesList',isAuth, (req,res,next)=>{
  usersController.userLikeLists(req, res, next)
});
router.get('/following', isAuth, (req,res,next)=>{
  usersController.userPersonalFollowing(req,res,next);
})
router.post('/:id/follow',isAuth, (req, res, next)=>{
  usersController.userFollower(req, res, next);
});
router.delete('/:id/unfollow',isAuth, (req,res,next)=>{
  usersController.userUnfollower(req,res,next);
});
module.exports = router;
