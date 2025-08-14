const Joi = require('joi')

exports.orderDetails = {
    body :Joi.object({
        Items:Joi.array().items(
            Joi.object({
                name:Joi.string().required(),
                quantity: Joi.number().required().min(1)
            }).required()
        ).min(1).required(),
        Amount:Joi.number().required()
    }).required()

}