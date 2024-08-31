const express = require("express");
const app = express();

require("dotenv").config({
  path: "./.env",
});
const PORT = process.env.PORT;

console.log(PORT);

const db = require("./database");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite = require("sqlite3").verbose();
const authRoutes = require("./auth");
const favouritesRoutes = require("./favourites");

const SALT_ROUNDS = 10;

// Middleware to parse JSON data
app.use(cors());
app.use(express.json());

// Simple route to check server
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// DB code was here

// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/", favouritesRoutes);

/* app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.all(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) return res.status(500).send("Server error");
      if (!user) return res.status(400).send("User not found");

      // Compare the password with the hashed password
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch) return res.status(400).send("Invalid credentials");

      // Create and send a JWT token
      const payload = { user: { id: user.id } };
      jwt.sign(payload, "123456", { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    }
  );
});

app.post("/register", (req, res) => {
  const { username, password, repeatPass } = req.body;

  db.all(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        throw err;
      }

      if (user.length === 0) {
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        db.all(
          `INSERT INTO users (username, password) VALUES (?,?)`,
          [username, passwordHash],
          (err) => {
            if (err) {
              throw err;
            }
            if (password !== repeatPass) {
              return res.status(409).send("Password doesn't match!");
            }
            return res.send(`New accound for user ${username} is created!`);
          }
        );
      } else {
        res.status(409).send("Username already exists");
      }
    }
  );
}); */

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
