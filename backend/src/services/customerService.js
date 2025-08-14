const userModel = require('../model/userModel')
const OrderModel = require('../model/orderModel')

exports.placeOrder = async(body,user)=>{
    try{
        body.userId = user
        const order = await OrderModel.create(body)
        if(!order){
            return{status : 400, data:{message : 'Couldnt Place Order', success:false}}
        }
        return {status:200 , data:{message: 'Order Placed Successfully', success:true , order }}
    }catch(error){
        console.error(error)
        return {status:500, data:{message:error, success:false}}
    }
}

exports.viewOrder = async(user)=>{
    try{
        const orders = await OrderModel.find({userId:user}).sort({createdAt:-1})
        if(!orders){
            return{status : 400, data:{message : 'No Order Found  Order', succes:false}}
        }
        return {status:200 , data:{message: 'Order Placed Successfully', orders, succes:true}}
    }catch(error){
        console.error(error)
        return {status:500, data:{message:error, success:false}}
    }
}