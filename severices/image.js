const path = require('path');
const multer  = require('multer');
const upload = multer({
  limits:{
    fileSize: 2*1024*1024
  },
  fileFilter (req, file, cb){
    const extname = path.extname(file.originalname).toLowerCase();
    if(extname !=='.jpg' && extname !== 'png' && extname !== '.jpeg'){
      cb(new Error('此圖片非支援的檔案格式(jpg,jpeg,png)'));
    }
    cb(null,true);
  },
});
const uploadImg = {
  'uploadSingle':upload.single('avatar'),
  'uploadMany':upload.any()
}
module.exports = uploadImg ; 