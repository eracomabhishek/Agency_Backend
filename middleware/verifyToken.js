const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  
  // console.log("token here", token)

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // console.log("token here", token)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  
    console.log("token middleware", req.user);
    next();  
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = verifyToken;