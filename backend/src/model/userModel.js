const mongoose = require("mongoose")

const userModel = new mongoose.Schema({
    firstName:{
        type :String,
        required: true
    },
    lastName : {
        type : String,
        required : true
    },
    roles :{
        type : String,
        enum:['Customer', 'Partner', 'Admin'],
        required : true
    },
    // profilePhoto :{
    //     type : String
    // },
    email :{
        type:String,
        required : true,
        index:true
    },
    password : {
        type: String,
        required : true
    },
    address : [{
        type: String
    }],
    
}, {timestamps : true})

const user = mongoose.model('User',userModel)
module.exports = user