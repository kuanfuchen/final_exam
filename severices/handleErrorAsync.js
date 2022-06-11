const handleErrorAsync = (func)=>{
  return (req,res,next)=>{
    func(req,res,next).catch((err)=>{
      return next(err)
    })
  }
}
module.exports = handleErrorAsync;