const handleErrorAsync = require('../severices/handleErrorAsync');
const errorField = require('../severices/errorField');
const handleSuccess = require('../severices/handleSuccess');
const imageSize = require('image-size');
const { ImgurClient } = require('imgur');
const User = require('../models/usersModel');

const uploadImgControllers = {
  postImg: handleErrorAsync(async(req,res,next)=>{
    if(!req.files.length)return next(errorField(400, '沒有上傳檔案', next));
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_Refresh_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type:'base64',
      album: process.env.IMGUR_ALBUM_ID
    });
    console.log(response,'response')
    handleSuccess(res, response.data.link, 200)
  }),
  postAvatarImg: handleErrorAsync(async(req,res,next)=>{
    if(!req.file)return next(errorField(400, '沒有上傳檔案', next));
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_Refresh_TOKEN,
    });
    const imgSize = imageSize(req.file.buffer);
    if(imgSize.width !== imgSize.height)return errorField(400, '圖片比例非1:1',next);
    const response = await client.upload({
      image:req.file.buffer.toString('base64'),
      type:'base64',
      album: process.env.IMGUR_ALBUM_ID
    });
    const userId = req.user.id;
    if(!userId)return errorField(401,'登入者狀態有誤',next);
    const updateUserPhoto = {
      photo: response.data.link
    };
    const personalInfo = await User.findByIdAndUpdate(userId, updateUserPhoto, {new:true, runValidators: true});
    handleSuccess(res, personalInfo, 200)
  })
}
module.exports = uploadImgControllers;
