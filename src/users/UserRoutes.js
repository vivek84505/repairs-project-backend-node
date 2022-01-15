const { Router } = require("express");

const UserController = require("./UserController");

const router = Router();

router.post("/", UserController.getUsers);
router.post("/adduser", UserController.addUser);
router.post("/updateuser", UserController.updateUser);
router.post("/deleteuser", UserController.removeUser);
router.post("/login", UserController.login);

module.exports = router;
