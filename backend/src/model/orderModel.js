const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    Items : [{
        name: String,
        quantity : Number
    }],
    partnerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    OrderStatus : {
        Picked : {
            type : Boolean,
            default : false
        },
        OntheWay : {
            type : Boolean,
            default : false
        },
        Delivered : {
            type : Boolean,
            default : false
        }
    },
    locked:{
        type:Boolean,
        default : false,
    },
    Amount : {
        type : Number,
        required : true
    }

}, {
    timestamps: true
}
)
const Order = mongoose.model('Order',orderSchema)
module.exports = Order