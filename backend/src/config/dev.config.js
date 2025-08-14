require('dotenv').config()
module.exports = {
    JWT_KEY : process.env.JWT_KEY,
    MONGODB_URL : process.env.MONGODB_URL,
    PORT : process.env.PORT
}  