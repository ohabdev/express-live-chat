const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const attachmentUpload = require("../middlewares/inbox/attachmentUpload");
const { checkLogin } = require("../middlewares/common/checkLogin");
const {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
  deleteConversation,
} = require("../controller/inboxController");
const express = require("express");
const router = express.Router();

router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

// search user for
router.post("/search", checkLogin, searchUser);
router.post("/conversation", checkLogin, addConversation);
router.get("/messages/:conversation_id", checkLogin, getMessages);
router.post("/message", checkLogin, attachmentUpload, sendMessage);
router.delete(
  "/:conversation_id",
  checkLogin,
  attachmentUpload,
  deleteConversation
);

module.exports = router;
