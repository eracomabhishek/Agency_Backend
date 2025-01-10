const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  
  // console.log("token here", token)

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  // console.log("token here", token)
  try {
    // const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);   //for production  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  // for postman
    req.user = decoded;  
    console.log("token middleware", req.user);
    next();  
  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = verifyToken;