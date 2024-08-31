const express = require("express");
const router = express.Router();
const db = require("./database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");

require("dotenv").config({
  path: "./.env",
});
const jwtSecret = process.env.JWT_SECRET;

const SALT_ROUNDS = 10;

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) return res.status(500).send("Server error");
      if (!user) return res.status(400).send("User not found");

      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).send("Invalid password");
      }

      // Create and send a JWT token
      const payload = { user: { id: user.id } };
      jwt.sign(payload, jwtSecret, { expiresIn: "24h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    }
  );
});

router.post("/register", (req, res) => {
  const { username, password, repeatPass } = req.body;

  db.all(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        throw err;
      }

      if (password !== repeatPass) {
        return res.status(409).send("Password doesn't match!");
      } else if (user.length === 0) {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        db.all(
          `INSERT INTO users (username, password) VALUES (?,?)`,
          [username, passwordHash],
          (err) => {
            if (err) {
              throw err;
            }

            return res.send(`New accound for user ${username} is created!`);
          }
        );
      } else {
        res.status(409).send("Username already exists");
      }
    }
  );
});

// Protected route to get user data
router.get("/getuser", auth, (req, res) => {
  db.get("SELECT * FROM users WHERE id = ?", [req.user.id], (err, user) => {
    if (err) return res.status(500).send("Server error");
    res.json(user);
  });
});

module.exports = router;
