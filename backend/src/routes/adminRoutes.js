const controllers = require('../controllers/adminControllers')
const express = require('express')
const adminAuth = require('../middlewares/adminAuth')
const router = express.Router()
router.get('/getOrders',adminAuth,controllers.getOrders)
router.get('/getCustomers',adminAuth,controllers.getCustomers)
router.get('/getPartners',adminAuth,controllers.getPartners)

// router.get('/hello',customerAuth,(req,res)=>{
//     res.json({message:'hello '})
// })
module.exports = router