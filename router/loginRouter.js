const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { getLogin, login, logout } = require("../controller/loginController");
const express = require("express");
const {
  doLoginValidator,
  doLoginValidationHandler,
} = require("../middlewares/login/loginValidator");
const { redirectLoggedIn } = require("../middlewares/common/checkLogin");
const router = express.Router();

const page_title = "Login";

router.get("/", decorateHtmlResponse(page_title), redirectLoggedIn, getLogin);

router.post(
  "/",
  decorateHtmlResponse(page_title),
  doLoginValidator,
  doLoginValidationHandler,
  login
);

router.delete("/", logout);

module.exports = router;
