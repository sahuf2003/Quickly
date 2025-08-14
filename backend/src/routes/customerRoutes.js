const controllers = require('../controllers/customerControllers')
const express = require('express')
const {validate} = require('../helpers/validate')
const orderVal = require('../validators/orderValidation')
const customerAuth = require('../middlewares/customerAuth')
const router = express.Router()
router.post('/place',validate(orderVal.orderDetails),customerAuth,controllers.placeOrder)
router.get('/view',customerAuth,controllers.viewOrders)
module.exports = router