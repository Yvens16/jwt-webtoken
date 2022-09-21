const express = require("express");

const router = express.Router();

const itemControllers = require("./controllers/itemControllers");
const userControllers = require("./controllers/usersControllers");
const auth = require("./middlewares/auth");

router.get("/items", itemControllers.browse);
router.get("/items/:id", itemControllers.read);
router.put("/items/:id", itemControllers.edit);
router.post("/items", itemControllers.add);
router.delete("/items/:id", itemControllers.destroy);

router.post("/signup", auth.hashPassword, userControllers.signUp);
router.post("/login", userControllers.login, auth.verifyPassword);
router.get("/user", userControllers.getUserByEmail);
router.post("/logout", auth.blackListToken)

// Authentification wall
router.use(auth.verifyToken, auth.isTokenBlackListed);
const getMovies = (req, res) => {
  res.json([
    {
      id: 0,
      name: "Godfather",
    },
  ]);
};
router.get("/movies", getMovies);
module.exports = router;

/** *
 * If you want to restrict the usage of a token when a user logs out. simply follow these 4 bullet points:

   ** Set a reasonable expiration time on tokens
   ** Delete the stored token from client-side upon log out
   ** Have DB of no longer active tokens that still have some time to live
   ** Query provided token against The Blacklist on every authorized request
 */
