const Post = require('../models/postsModel');
const User = require('../models/usersModel');
const handleSuccess = require('../severices/handleSuccess');
const handleErrorAsync = require('../severices/handleErrorAsync');
const errorField = require('../severices/errorField');
const Comment = require('../models/commentModel'); 

const postsContrllers = {
  getPosts: handleErrorAsync(async(req, res,next)=>{
		const searchContent = req.query.search !==undefined && req.query.search !== null? {'content':new RegExp(req.query.search)} :{};
    const timeStamp = req.query.timeStamp==='asc'?'createdAt':'-createdAt';
    const data = await Post.find(searchContent).populate({
			path:'user',
      select:'name photo'
    }).populate({
			path:'comments',
			select:'comment user'
		}).sort(timeStamp);
    handleSuccess(res, data)
  }),
	createPost: handleErrorAsync(async(req, res, next)=>{
		const userId = req.user.id;
		const content = req.body.content.trim();
		if(userId && content){
			const data = {
				'user':userId,
				'content':content,
				'image':req.body.image
			}
			const info = await Post.create(data);
			handleSuccess(res,info);
		}else{
			errorField(400, '缺少user || content 資訊', next)
		};
	}),
	deleteOnePosts: handleErrorAsync(async(req, res, next)=>{
		const id = req.params.id;
		const deleteMessage = await Post.findByIdAndDelete(id);
		if(deleteMessage !== null){
			handleSuccess(res,'刪除成功')
		}else{
			errorField(400, '貼文重複刪除', next)
		}
	}),
	updataPosts: handleErrorAsync(async(req,res,next)=>{
		const id = req.params.id;
		const info = req.body;
		const userId = req.user.id;
		await User.findById(id).exec(()=> console.log);
		if( id && info.content){
			const data = await Post.findByIdAndUpdate(id,{
				'user':userId,
				'content':info.content,
				'image':info.image
			},{new:true, runValidators: true})
			if(data === null){
				return errorField(400, '資料為空', next)
			}
			handleSuccess(res, data)
		}else{
			errorField(403, '變更缺少必要資訊(id || user || content)', next)
		}
	}),
	addLikePost: handleErrorAsync(async(req,res,next)=>{
		const _id = req.params.id;
		const updateLikeInfo = await Post.findByIdAndUpdate({_id},{
			$addToSet:{ likes: req.user.id}
		},{new:true, runValidators: true});
		if(updateLikeInfo === undefined || updateLikeInfo === null){
			errorField(403, '貼文已不存在', next)
		}else{
			const userInfo= {
				id: _id,
				useId:req.user.id
			}
			handleSuccess(res,userInfo)
		}
	}),
	deleteLikePost: handleErrorAsync(async(req,res,next)=>{
		const _id = req.params.id;
		const removeLikeInfo = await Post.findOneAndUpdate({_id},
			{$pull: {likes: req.user.id}},
			{new:true, runValidators: true}
		)
		if(removeLikeInfo === undefined || removeLikeInfo === null){
			errorField(403, '貼文已不存在', next)
		}else{
			const userInfo= {
				id: _id,
				useId:req.user.id
			}	
			handleSuccess(res,userInfo,201)
		}
	}),
	addCommentPost: handleErrorAsync(async(req,res,next)=>{
		const user = req.user.id;
		const post = req.params.id;
		const comment = req.body.comment.trim();
		if(comment === '' || comment === null){
			return errorField(401,'填入回文資料',next)
		}
		const data = {
			user,
			post,
			comment
		}
		const info = await Comment.create(data);
		handleSuccess(res, info)
	}),
	getSinglePost: handleErrorAsync(async(req,res,next)=>{
		// const useId = req.user.id;
		const postId = req.params.postId;
		const postArticle = await Post.findById(postId).populate({
			path:'likes',
			select:'name _id'
		}).populate({
			path:'comments',
			select:'comment user'
		})
		handleSuccess(res, postArticle)
	}),
	getUserAllPosts:handleErrorAsync(async(req,res,next)=>{
		const userId = req.params.userId;
		const getUserPosts = await Post.find({user:{_id:userId}}).populate({
			path:'likes',
			select:'name _id'
		}).populate({
			path:'comments',
			select:'comment user'
		});
		handleSuccess(res, getUserPosts)
	})
}
module.exports = postsContrllers