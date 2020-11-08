const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    // Bearer tokenstring => its more convension
    const token = req.headers.authorization.split(' ')[1];  // may fail throw error => go to catch
    const decodedToken = jwt.verify(token,process.env.JWT_KEY)               // may fail throw error => go to catch
    // we append decodedToken in the request , so that we can access it in the post route
    // Be caution :  request.(add a new field here) just make sure to not overrite one which already exist
    req.userData = {email : decodedToken.email , userId:decodedToken.userId};
    next();
  } catch{
    res.status(401).json({message : 'Your are not authenticated !'});
  }
};
