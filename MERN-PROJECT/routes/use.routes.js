const router = require("express").Router();
const authcontroller = require("../controllers/auth.controllers");

router.post("/register", authcontroller.signup);

module.exports = router;
