const createError = require("http-errors");
const Conversation = require("../models/Conversation");
const User = require("../models/People");

const excape = require("../utilities/escape");

async function getInbox(req, res, next) {
  try {
    const conversation = await Conversation.find({
      $or: [
        { "creator.id": req.user.userid },
        { "participant.id": req.user.userid },
      ],
    });
    res.locals.data = conversation;
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

module.exports = {
  getInbox,
  searchUser,
  addConversation,
};
