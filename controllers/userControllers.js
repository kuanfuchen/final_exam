const User = require('../models/usersModel');
const handleSuccess = require('../severices/handleSuccess');
const handleErrorAsync = require('../severices/handleErrorAsync');
const errorField = require('../severices/errorField');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require('../severices/auth');
const Post = require('../models/postsModel');

const usersContrllers = {
	userSignUp: handleErrorAsync(async(req, res, next)=>{
		let {email, password, confirmpassword, name, sex, photo  } = req.body;
		
		const errMessage = [];
		if(!email || !password || !confirmpassword || !name) errMessage.push('欄位未填寫');
		if(password !== confirmpassword) errMessage.push('密碼不一致');
		
		if(!validator.isLength(password,{min:8})) errMessage.push('密碼小於8碼');
		if(!validator.isEmail(email)) errMessage.push('Email 格式錯誤');
		const allSex = ['Male', 'Female'];
		
		if(!validator.isIn(sex,allSex)) errMessage.push('性別格式有誤');
		// if(sex === "" || sex === undefined || sex !== 'Male' && sex !== 'Female') errMessage.push('性別格式有誤');
		if(errMessage.length > 0) return next(errorField(400,errMessage,next));
		const repeatEmail = await User.findOne({email});
		if(repeatEmail !== null) return errorField(400,'email已註冊過',next);
		password = await bcryptjs.hash(req.body.password, 12);
		const newUser = await User.create({
			name,
			password,
			email,
			sex,
			photo
		})
		generateJWT(newUser, 201, res);
	}),
	userSignIn: handleErrorAsync(async(req, res, next)=>{
		let { email, password} = req.body;
		const errMessage = [];
		if( !email || !password) errMessage.push('帳號密碼有空，請檢查');
		if( !validator.isEmail(email)) errMessage.push('Email 格式錯誤');
		if(!validator.isLength(password,{min:8})) errMessage.push('密碼小於8碼');
		if(errMessage.length > 0)return errorField(400,errMessage,next);
		const user = await User.findOne({ email }).select('+password');
		if(user === null)return errorField(401, '請確認此帳號是否有誤', next);
		const auth = await bcryptjs.compare(password, user.password);
		if(!auth){
			return errorField(401, '你的密碼不正確',next);
		};
		generateJWT(user, 200, res);
	}),
	userProfile: handleErrorAsync(async(req, res, next)=>{
		req.user.password = undefined;
		const data = req.user;
		handleSuccess(res, data)
	}),
	userUpdatepassword: handleErrorAsync(async(req, res, next)=>{
		const {password, confirmpassword} = req.body;
		const errMessage = [];
		if(!validator.isLength(password,{min:8})) errMessage.push('密碼小於8碼');
		if(password !== confirmpassword) errMessage.push('密碼不一致');
		if(errMessage.length >0 )return errorField(401, errMessage, next);
		const newpassword = await bcryptjs.hash(password, 12);
		const updateUser= await User.findByIdAndUpdate(req.user.id, {password: newpassword});
		generateJWT(updateUser, 202, res)
	}),
	userPatchUpdatePersonalInfo: handleErrorAsync(async(req, res ,next)=>{
		let { name, photo, sex  } = req.body;
		const errMessage = [];
		if(!name) errMessage.push('必須要有名稱');
		
		if(sex === undefined || sex === "" || sex !== 'Male' && sex !== 'Female') errMessage.push('性別格式有誤');
		
		if(errMessage.length>0) return errorField(401, errMessage, next);
		const updateInfo = {
			sex,
			name,
		};
		const personalInfo = await User.findByIdAndUpdate(req.user.id, updateInfo, {new:true, runValidators: true});
		handleSuccess(res, personalInfo)
	}),
	userLikeLists: handleErrorAsync(async(req,res,next)=>{
		const likeList = await Post.find({
			likes:{$in:[req.user.id]}
		}).populate({
			path:'user',
			select:"name _id"
		});
		handleSuccess(res,likeList)
	}),
	userFollower:handleErrorAsync(async(req, res, next) =>{
		const userId = req.user.id;
		const followerId = req.params.id;
		if(userId === followerId)return errorField(401, '追蹤者不能是自己',next);
		await User.updateOne(
			{
				_id: userId,
				'following.user':{ $ne: followerId }
			},{
				$addToSet:{
					following: {user:followerId}
				}
			}
		);
		await User.updateOne({
			_id: followerId,
			'followers.user':{ $ne:userId }
		},{
			$addToSet:{
				followers: {user:userId}
			}
		}
		)
		
		handleSuccess(res, '追蹤成功')
	}),
	userUnfollower:handleErrorAsync(async(req,res,next)=>{
		const userId = req.user.id;
		const unFollowId = req.params.id;
		if(userId === unFollowId)return errorField(401, '取消追蹤者不能是自己', next)
		await User.updateOne({
			_id: userId,
		},{
			$pull:{
				following:{user: unFollowId}
			}
		});
		await User.updateOne({
			_id: unFollowId,
		},{
			$pull:{
				followers:{user:userId}
			}
		});
		handleSuccess(res,'取消追蹤成功')
	}),
	userPersonalFollowing: handleErrorAsync(async(req, res, next)=>{
		const _id = req.user.id
		const following = await User.findById(_id).select('following');
		handleSuccess(res, following)
	})
};
module.exports = usersContrllers