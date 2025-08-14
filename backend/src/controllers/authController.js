const authService = require('../services/authService')

exports.register = async(req, res)=>{
    try{
        const response = await authService.register(req.body)
        return res.status(response.status).json(response.data)
    }catch(error){
        console.log("error",error)
        return res.status(400).json({error})
    }
}
exports.login = async(req, res)=>{
    try{
        const response = await authService.login(req.body)
        return res.status(response.status).json(response.data)
    }catch(error){
        console.log("error",error)
        return res.status(400).json({error})
    }
}
