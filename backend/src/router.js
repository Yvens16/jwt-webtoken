const express = require("express");

const router = express.Router();

const authMiddlewares = require("./middlewars/auth");
const userControllers = require("./controllers/userControllers");

router.post("/signup", authMiddlewares.hashPassword, userControllers.signUp);

const getMovies = (req, res) => {
  res
    .status(200)
    .json({ movies: [{ name: "Kung Fu Panda" }, { name: "Superman" }] });
};

// Authentification wall
router.use(authMiddlewares.verifyToken);

router.get("/movies", getMovies);

module.exports = router;
