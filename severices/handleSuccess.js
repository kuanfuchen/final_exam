const handleSuccess = (res,data, code)=>{
    const codeStatus = code || 200;
    res.status(codeStatus).send({
        status:'success',
        data
    })
}
module.exports = handleSuccess;