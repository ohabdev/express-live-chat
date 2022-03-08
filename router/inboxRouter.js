const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const { checkLogin } = require("../middlewares/common/checkLogin");
const {
  getInbox,
  searchUser,
  addConversation,
} = require("../controller/inboxController");
const express = require("express");
const router = express.Router();

router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

// search user for
router.post("/search", checkLogin, searchUser);
router.post("/conversation", checkLogin, addConversation);

module.exports = router;
