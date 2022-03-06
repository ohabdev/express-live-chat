const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidators");
const avatarUpload = require("../middlewares/users/avatarUpload");
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controller/usersController");
const express = require("express");
const router = express.Router();

router.get("/", decorateHtmlResponse("Users"), getUsers);

router.post(
  "/",
  avatarUpload,
  addUserValidators,
  addUserValidationHandler,
  addUser
);

router.delete("/:id", removeUser);

module.exports = router;
