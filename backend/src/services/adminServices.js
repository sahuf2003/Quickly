const userModel = require('../model/userModel')
const orderModel = require('../model/orderModel')
exports.getOrders = async()=>{
    try{
        const orders = await orderModel.find().sort({CreatedAt:-1})

        if(!orders){
            return {status:404 , data:{message:'No Orders Found'}}
        }
        return {status:200 , data:{message:'Order Fetch Successfully', orders}}
    }catch(error){
      return {status:400 , data:{message : error , success : false }}

    }
}

exports.getPartners = async()=>{
    try{
        const partners = await userModel.find({roles:'Partner' })
        if(!partners){
            return {status:404 , data:{message:'No Delivery Partners Found'}}
        }
        return {status:200 , data:{message:'Delivery Partners Fetch Successfully', partners}}
    }catch(error){
      return {status : 400 , data:{message : error , success : false }}

    }
}

exports.getCustomers = async()=>{
    try{
        const customers = await userModel.find({roles:'Customer'}).sort({CreatedAt:-1})
        if(!customers){
            return {status:404 , data:{message:'No Customers Found'}}
        }
        return {status:200 , data:{message:'Customers Fetch Successfully', customers}}
    }catch(error){
      return {status : 400 , data:{message : error , success : false }}

    }
}