const  errorField = (resStatusCode, errMsg, next)=>{
  const error = new Error(errMsg);
  error.statusCode = resStatusCode || 500;
  error.isOperational = true;
  next(error)
}
module.exports = errorField;