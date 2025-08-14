const userModel = require('../model/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const devConfig = require('../config/dev.config')
exports.register = async(body)=>{
    try{
        const userExist = await userModel.findOne({email: body.email})
        if(userExist){
            // response.status(400).message('Email already exist')
            return {status : 400 , data:{message : 'Email Already Exist' , success : false}}}
        // const user = await userModel.create({body})
     
        const hash = await bcrypt.hash(body.password,10)
        body.password = hash
        const user = await userModel.create(body)
        return {status : 200 , data:{message : 'User Registered Successfully', success : true, user}}

        
    }catch(error){
        return {status : 400 , data:{message : error , success : false, }
    }
}}

exports.login = async(body)=>{
    try{
        const user = await userModel.findOne({'email': body.email})
        if(!user){
            // response.status(404).message('User Not Found')
            return {status : 404 , data :{message: 'User Not Found',success : false}}
        }
        const pass = await bcrypt.compare(body.password,user.password)
        if(!pass){
        return {status : 400 , data:{message : 'Email or password is incorrect' , success : false }}
        }
        if(body.roles !== user.roles){
            return {status : 400 , data:{message : 'Forbidden Access' , success : false }}
        }
        const token = jwt.sign({_id:user._id},devConfig.JWT_KEY)
       
        return {status : 200 , data:{message : 'Login Successfully' ,token, success : true }}
    }catch(error){
        return {status : 400 , data:{message : error , success : false }
    }
    }}