const createError = require("http-errors");
const User = require("../models/People");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// get login page
function getLogin(req, res, next) {
  res.render("index");
}

// do login
async function login(req, res, next) {
  try {
    // find user in database exits or not
    const user = await User.findOne({
      $or: [{ email: req.body.username }, { mobile: req.body.username }],
    });
    if (user && user._id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        const userOject = {
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          role: "user",
        };

        // generate token
        const token = jwt.sign(userOject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        //set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        //set logged in user local identifier
        res.locals.loggedInUser = userOject;
        res.redirect("inbox");
      } else {
        throw createError("Login failed! Please try again");
      }
    } else {
      throw createError("Login failed! Please try again");
    }
  } catch (error) {
    res.render("inbox", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: error.message,
        },
      },
    });
  }
}

function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.send("logged out");
}

module.exports = {
  getLogin,
  login,
  logout,
};
