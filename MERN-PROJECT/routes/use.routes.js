const router = require("express").Router();
const authcontroller = require("../controllers/auth.controllers");
const usercontroller = require("../controllers/user.controllers");

router.post("/register", authcontroller.signup);

module.exports = router;
