const express = require("express");
const router = express.Router();
const db = require("./database");

// Route to add custom pokemon to custompoke
router.post("/add", (req, res) => {
  const { userId, name, weight, mainAbility, secondAbility, private } =
    req.body;
  const query = "SELECT * FROM custompoke WHERE userId = ? AND name = ?";

  db.all(query, [userId, name], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length === 0) {
      const privatInt = private ? 1 : 0;

      db.all(
        `INSERT INTO custompoke (userId, name, weight, mainAbility, secondAbility, private) VALUES (?,?,?,?,?,?)`,
        [userId, name, weight, mainAbility, secondAbility, privatInt],
        (err) => {
          if (err) {
            throw err;
          }
          return res.send(`New Pokemon "${name}" is created!`);
        }
      );
    } else {
      res.status(409).send(`Pokemon with name "${name}" already exists`);
    }
  });
});

// Route to remove custom pokemon from custompoke
router.post("/remove", (req, res) => {
  const { userId, name } = req.body;
  const query = "DELETE FROM custompoke WHERE userId = ? AND name = ?";

  db.all(query, [userId, name], function (err) {
    if (err) {
      return res.status(500).send(`Custom pokemon "${name}" not found`);
    }
    res.send(`Custom pokemon "${name}" is removed`);
  });
});

// Route to get all user custom pokemons from db
router.get("/get/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM custompoke WHERE userId = ?";

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).send("Server error");
    res.json(rows);
  });
});

// Route to get all custom pokemons that are not private from db
router.get("/getall", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM custompoke WHERE private = 0";

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).send("Server error");
    res.json(rows);
  });
});

module.exports = router;
