const Conversation = require("../models/Conversation");
const excape = require("../utilities/escape");
const Message = require("../models/Message");
const createError = require("http-errors");
const User = require("../models/People");
const { rawListeners } = require("../models/Conversation");

// get all inbox participant id
async function getInbox(req, res, next) {
  try {
    const conversation = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });
    res.locals.data = conversation;
    console.log(res.locals.data);
    res.render("inbox");
  } catch (error) {
    console.log(error);
  }
}

// get search user
async function searchUser(req, res, next) {
  const user = req.body.user;
  const searchQuery = user.replace("+88", "");

  const name_search_regex = new RegExp(excape(searchQuery), "i");
  const mobile_search_regex = new RegExp("^" + excape("+88", searchQuery));
  const email_search_regex = new RegExp("^" + excape(searchQuery) + "$", "i");

  try {
    if (searchQuery !== "") {
      const users = await User.find(
        {
          $or: [
            {
              name: name_search_regex,
            },
            {
              mobile: mobile_search_regex,
            },
            {
              email: email_search_regex,
            },
          ],
        },
        "name avatar"
      );
      res.json(users);
    } else {
      throw createError("you must be provide some text to search");
    }
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}

// add conversation
async function addConversation(req, res, next) {
  try {
    console.log(req.user);
    console.log(req.body);
    const newConversation = new Conversation({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
      },
    });

    const result = await newConversation.save();
    res.status(200).json({
      message: "Conversaton was added successfully",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}

// get message of a conversation
async function getMessages(req, res, next) {
  try {
    console.log(req.params.conversation_id);
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );
    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}

async function sendMessage(req, res, next) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      let attachments = null;
      if (req.files && req.files.length > 0) {
        attachments = [];
        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.id,
          name: req.user.name,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();
    } catch (error) {
      res.status(500).json({
        errors: {
          common: {
            msg: error.message,
          },
        },
      });
    }
  } else {
    res.status(500).json({
      errors: {
        common: "message text or attachment is required!",
      },
    });
  }
}

module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
};
