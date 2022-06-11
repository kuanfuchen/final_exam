const express = require('express');
const router = express.Router();
const {isAuth} = require('../severices/auth');
const uploadImg = require('../severices/image');
const uploadImgControllers = require('../controllers/uploadImgControllers'); 
router.post('/',isAuth, uploadImg.uploadMany, (req,res,next)=>{
  uploadImgControllers.postImg(req,res,next);
});
router.post('/avatar',isAuth,uploadImg.uploadSingle, (req,res,next)=>{
  uploadImgControllers.postAvatarImg(req,res,next)
})
module.exports = router;