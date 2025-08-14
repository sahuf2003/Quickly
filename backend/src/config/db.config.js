const devConfig = require('./dev.config')
const mongoose = require('mongoose')
mongoose.connect(devConfig.MONGODB_URL).then(()=> console.log("Less go we got connected")).catch(err=> console.log("ooopsie",err))
