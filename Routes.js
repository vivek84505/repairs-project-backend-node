const { Router } = require("express");

const UserController = require("./src/controllers/UserController");

const router = Router();

//User Routes
router.post("/", UserController.getUsers);
router.post("/adduser", UserController.addUser);
router.post("/updateuser", UserController.updateUser);
router.post("/deleteuser", UserController.removeUser);

module.exports = router;
