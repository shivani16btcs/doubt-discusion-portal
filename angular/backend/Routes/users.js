const express = require('express');
const UserController = require('../Controllers/user');
const checkAuth = require('../Middlewares/check-Auth');
router = express.Router();

router.post("/register", UserController.register);
router.post("/changPassword",UserController.ChangePassword);

router.get("/getUser/:emailId", checkAuth, UserController.getUser);

router.post("/forgetPassword/:emailId", UserController.forgetPassword);


router.put("/updateUser/:emailId", checkAuth, UserController.updateUser);

router.post("/login", UserController.login);


router.post("/verify/:emailId", UserController.verify);



router.post("/resetPassword/:emailId", UserController.resetPassword);



module.exports = router;