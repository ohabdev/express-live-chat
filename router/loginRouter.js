const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { getLogin, login } = require("../controller/loginController");
const express = require("express");
const {
  doLoginValidator,
  doLoginValidationHandler,
} = require("../middlewares/login/loginValidator");
const router = express.Router();

const page_title = "Login";

router.get("/", decorateHtmlResponse(page_title), getLogin);

router.post(
  "/",
  decorateHtmlResponse(page_title),
  doLoginValidator,
  doLoginValidationHandler,
  login
);

module.exports = router;
