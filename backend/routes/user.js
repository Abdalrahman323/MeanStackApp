const exprss = require('express');
const UserController = require('../controller/user')



const router = exprss.Router();
// passing a refrence to the UserController.createUser function
router.post("/signup",UserController.createUser);

router.post("/login",UserController.userLogin );

module.exports = router;
