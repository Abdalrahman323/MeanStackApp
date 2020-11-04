const exprss = require('express');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


const User = require('../models/user');
const user = require('../models/user');


const router = exprss.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // Store hash in your password DB.
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "user created",
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            error: err
          })
        })

    });

});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  // first
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {  // if user email doesn't exist in database
        return res.status(401).json({ message: "Auth Fail" });
      }
      // compare password user entered with the password stored in the database (hashed) , we can't unhash
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) { // we do have successful match
        return res.status(401).json({ message: "Auth Fail" });
      }
      // we have a valid password
      // let's continue and create JWT
      // this method create a new token based on some input data of your choice here we used (email , user_id)
      console.log("logged in user " + fetchedUser.email, fetchedUser._id);
      const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
        "secret_gsdgsdgwegfw3",
        { expiresIn: "1hr" })

      res.status(200).json({
        token: token,
        expiresIn:3600
      });
    })
    .catch(err => {
      return res.status(401).json({ message: "Auth Fail" });
    })
});
module.exports = router;
