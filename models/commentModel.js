const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ({
  comment:{
    type:String,
    require:[true, 'comment is require']
  },
  user:{
    type:mongoose.Schema.ObjectId,
    ref:'user',
    require:[true, '查不到此ID']
  },
  post:{
    type:mongoose.Schema.ObjectId,
    ref:'post',
    require:[true,'無此貼文']
  }
},{
  versionKey:0
})
commentSchema.pre(/^find/,function(next){
  this.populate({
    path:'user',
    select:'name id createdAt'
  });
  next()
})
const Comment = mongoose.model('Comment',commentSchema);
module.exports = Comment;
