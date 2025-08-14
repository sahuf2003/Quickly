const adminServices = require('../services/adminServices')

exports.getOrders = async(req,res)=>{
    try{
        const response = await adminServices.getOrders()
        return res.status(response.status).json(response.data)
    }catch(error){
        console.log("error",error)
        return res.status(400).json({error})
    }
}
exports.getCustomers = async(req, res)=>{
    try{
        const response = await adminServices.getCustomers()
        return res.status(response.status).json(response.data)
    }catch(error){
        console.log("error",error)
        return res.status(400).json({error})
    }
}
exports.getPartners = async(req, res)=>{
    try{
        const response = await adminServices.getPartners()
        return res.status(response.status).json(response.data)
    }catch(error){
        console.log("error",error)
        return res.status(400).json({error})
    }
}