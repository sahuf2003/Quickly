const controllers = require('../controllers/authController')
const express = require('express')
const {validate} = require('../helpers/validate')
const authVal = require('../validators/authValidation')
const customerAuth = require('../middlewares/customerAuth')
const router = express.Router()
router.post('/register',validate(authVal.register),controllers.register)
router.post('/login',validate(authVal.login),controllers.login)
// router.get('/hello',customerAuth,(req,res)=>{
//     res.json({message:'hello '})
// })
module.exports = router