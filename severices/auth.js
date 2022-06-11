const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const errorField = require('./errorField');
const handleErrorAsync = require('./handleErrorAsync');
const handleSuccess = require('./handleSuccess');
const generateJWT = (user, codeStatus, res)=>{
  const id = user._id;
  const token = jwt.sign({id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_DAY
  });
  user.password = undefined;
  const data = {
    name: user.name,
    token,
    id
  }
  handleSuccess(res, data, codeStatus);
}
const isAuth = handleErrorAsync(async(req,res,next)=>{
  let token;
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(/\s/)[1];
  }
  if(!token)return errorField(401, '非登入狀態，請再次登入', next);
  const checkTokenUser = await new Promise((resolve, reject)=>{
    jwt.verify(token, process.env.JWT_SECRET,(err, payload)=>{
      if(err){
        reject(err)
      }else{
        resolve(payload)
      }
    })
  });
  const userInfo = await User.findById(checkTokenUser.id)
  req.user = userInfo;
  next();
}) 
module.exports = {
  generateJWT,
  isAuth
};