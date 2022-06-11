const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    createdAt:{
        type:Date,
        default:Date.now,
    },
    content:{
        type:String,
        required:[true,'content補充']
    },
    user:{
        ref:'user',
        type: mongoose.Schema.ObjectId,
        require:[true,'none user']
    },
    image:{
        type:String
    },
    likes:[
      {
        type: mongoose.Schema.ObjectId,
        ref:'user'
      }
    ],
},{
    versionKey:false,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
postSchema.virtual('comments', {
    ref:'Comment',
    foreignField:'post',
    localField:'_id'
})
const Post = mongoose.model('post', postSchema);
module.exports = Post;