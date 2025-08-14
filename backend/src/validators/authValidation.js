const Joi = require('joi')

exports.register = {
    body: Joi.object({
    firstName : Joi.string().required(),
    lastName : Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().required().min(8),
    roles : Joi.string().valid('Customer', 'Partner', 'Admin').required()
}).required()}

exports.login = {
    body: Joi.object({
        email: Joi.string().email().required(),
        password : Joi.string().required().min(8),
        roles : Joi.string().valid('Customer', 'Partner', 'Admin').required()
    }).required()
}