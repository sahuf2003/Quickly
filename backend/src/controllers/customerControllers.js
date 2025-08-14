const customerService = require('../services/customerService')

exports.placeOrder = async(req,res)=>{
    try{
        const response = await customerService.placeOrder(req.body,req.user)
        return res.status(response.status).json(response.data)
    }catch(error){
        console.error(error)
        return res.status(500).json('Internal Server Error')
    }
}
exports.viewOrders = async(req,res)=>{
    try{
        const response = await customerService.viewOrder(req.user)
        return res.status(response.status).json(response.data)
    }catch(error){
        console.error(error)
        return res.status(500).json('Internal Server Error')
    }
}