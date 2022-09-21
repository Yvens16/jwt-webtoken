/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { sqlDB } = require("../../db");

const hashPassword = (req, res, next) => {
  argon2
    .hash(req.body.password)
    .then(hashedPassword => {
      req.body.hashedPassword = hashedPassword;
      delete req.body.password;

      next();
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    });
};

const createWebToken = userId => {
  const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

const verifyPassword = (req, res) => {
  const { password } = req.body;
  const { hashedPassword, id: userId } = req.user;
  argon2.verify(hashedPassword, password).then(isVerified => {
    if (!isVerified) {
      res.sendStatus(401);
    }
    const token = createWebToken(userId);
    delete req.user.hashedPassword;
    res.send({ token, user: req.user });
  });
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader == null) {
      throw new Error("Authorization header is missing");
    }

    const [type, token] = authorizationHeader.split(" ");

    if (type !== "Bearer") {
      throw new Error("Authorization header has not the 'Bearer' type");
    }

    req.payload = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

const blackListToken = (req, res, next) => {
  const authorizationHeader = req.get("Authorization");

  if (authorizationHeader == null) {
    throw new Error("Authorization header is missing");
  }

  // `Bearer ${token}`; ["Bearer", "fneufnkefbnke"]

  const [, token] = authorizationHeader.split(" ");
  sqlDB
    .query("INSERT INTO  token_blacklist (token) VALUES(?)", [token])
    .then(([insertedToken]) => {
      console.warn("TOKEN ID", insertedToken.insertId);
      res.send({ msg: "USER LOGGED OUT" });
    })
    .catch(err => {
      console.warn("ERROR IN blackListToken", err);
      res.sendStatus(400);
    });
};

const isTokenBlackListed = (req, res, next) => {
  const authorizationHeader = req.get("Authorization");

  if (authorizationHeader == null) {
    throw new Error("Authorization header is missing");
  }

  const [, token] = authorizationHeader.split(" ");
  // the comma let us skip the first element of the array here type
  // const [type, token] = authorizationHeader.split(" ");
  sqlDB
    .query("SELECT * FROM token_blacklist WHERE token=?", [token])
    .then(([tokens]) => {
      if (tokens[0] != null) {
        res.send({ msg: "TOKEN EXPIRED" });
      }
      next();
    })
    .catch((err) => {
      console.warn("ERROR IN isTokenBlacklisted", err);
      res.sendStatus(400);
    });
};

module.exports = {
  hashPassword,
  createWebToken,
  verifyToken,
  verifyPassword,
  blackListToken,
  isTokenBlackListed,
};
