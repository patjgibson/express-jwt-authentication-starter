const mongoose = require("mongoose");
const router = require("express").Router();
const User = mongoose.model("User");
const passport = require("passport");
const utils = require("../lib/utils");
const pool = require("../db/pool");

// TODO
router.get("/protected", (req, res, next) => {});

// TODO
router.post("/login", function (req, res, next) {});

// TODO
router.post("/register", function (req, res, next) {
  const saltHash = utils.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  pool
    .query("INSERT INTO users (username, hash, salt) VALUES ($1, $2, $3)", [
      req.body.username,
      hash,
      salt,
    ])
    .then((user) => {
      const jwt = utils.issueJWT(user.rows[0]);
      res.json({
        success: true,
        user: user,
        token: jwt.token,
        expiresIn: jwt.expires,
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
