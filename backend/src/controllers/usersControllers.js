/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
// const argon2 = require("argon2");
const { sqlDB } = require("../../db");
const { createWebToken } = require("../middlewares/auth");

// ARGON OPTIONS: https://github.com/ranisalt/node-argon2/wiki/Options

const createUser = ({ name, email, hashPassword }) => {
  return sqlDB
    .query("INSERT INTO users (name, email, hashedPassword) values (?, ?,?)", [
      name,
      email,
      hashPassword,
    ])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        return false;
      }
      return result.insertId;
    });
};

const getUserByEmail = (email) => {
  let user;
  return sqlDB
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        console.warn("@@@@@@", users);
        user = users[0];
        return user;
      }
      return null;
    })
    .catch((err) => {
      console.warn("ERROR IN getUserByEmail", err);
    });
};

const signUp = (req, res) => {
  const { name, email, hashedPassword } = req.body;
  return createUser({ name, email, hashPassword: hashedPassword })
    .then((insertId) => {
      if (!insertId) {
        res.status(400).json({ msg: "User not created", code: 400 });
      }
      const token = createWebToken(insertId);
      res.status(200).json({
        msg: "User created",
        code: 200,
        token,
        user: { name, email, hashedPassword },
      });
    })
    .catch((err) => {
      console.warn("Error", err);
      res.status(500).json({ msg: "Error", code: 500 });
    });
};

const login = (req, res, next) => {
  const { email } = req.body;
  return getUserByEmail(email)
    .then((user) => {
      if (!user) {
        res.sendStatus(401);
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.warn("ERROR IN login", err);
      res.sendStatus(400);
    });
};

module.exports = {
  signUp,
  getUserByEmail,
  login,
};
