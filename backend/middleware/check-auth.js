const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    // Bearer tokenstring => its more convension
    const token = req.headers.authorization.split(' ')[1];  // may fail throw error => go to catch
    jwt.verify(token,"secret_gsdgsdgwegfw3")               // may fail throw error => go to catch
    next();
  } catch{
    res.status(401).json({message : 'Authentication failed !'});
  }
};
