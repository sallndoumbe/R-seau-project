const router = require("express").Router();

const authController = require("../controllers/auth.controllers");
const usercontroller = require("../controllers/user.controllers");


//auth

router.post("/register", authController.signUp);
router.post("/login", authController.signIn);
router.get("/logout", authController.logout);

//users

router.get("/", usercontroller.getAllUsers);
router.get("/:id", usercontroller.userInfo);
router.put("/:id", usercontroller.updateUser);
router.delete("/:id", usercontroller.deleteUser);
router.patch("/follow/:id", usercontroller.follow);
router.patch("/unfollow/:id", usercontroller.unfollow);

module.exports = router;



