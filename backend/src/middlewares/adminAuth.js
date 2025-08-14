const jwt = require('jsonwebtoken');
const devConfig = require('../config/dev.config');
const userModel = require('../model/userModel');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json('Token must be provided');
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7) // removes "Bearer " prefix
      : authHeader;

    let decoded;
    try {
      decoded = jwt.verify(token, devConfig.JWT_KEY);
    } catch (err) {
      console.error(err);
      return res.status(401).json('Invalid Token');
    }

    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(400).json('User Doesn’t Exist');
    }

    if (user.roles !== 'Admin') {
      return res.status(403).json('You are not authorized for this role');
    }

    next();

  } catch (error) {
    console.error(error);
    return res.status(500).json('Something went wrong');
  }
};
