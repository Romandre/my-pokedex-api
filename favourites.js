const express = require("express");
const router = express.Router();
const db = require("./database");

// Route to add pokemon to favourites
router.post("/add", (req, res) => {
  const { userId, pokemon } = req.body;
  const query = "SELECT * FROM favourites WHERE userId = ? AND pokemon = ?";

  db.all(query, [userId, pokemon], (err, rows) => {
    if (err) {
      throw err;
    }

    if (rows.length === 0) {
      db.all(
        `INSERT INTO favourites (userId, pokemon) VALUES (?,?)`,
        [userId, pokemon],
        (err) => {
          if (err) {
            throw err;
          }
          return res.send(`Pokemon ${pokemon} is added to favourites!`);
        }
      );
    } else {
      res.status(409).send("Pokemon is already in favourites");
    }
  });
});

// Route to remove pokemon from favourites
router.post("/remove", (req, res) => {
  const { userId, pokemon } = req.body;
  const query = "DELETE FROM favourites WHERE userId = ? AND pokemon = ?";

  db.all(query, [userId, pokemon], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Favorite item not found" });
    }
    res.json({ message: "Favorite item removed successfully!" });
  });
});

router.delete("/removeall", (req, res) => {
  const query = "DELETE FROM favourites";

  db.all(query, function (err) {
    if (!!err) {
      return res.status(500).send({ error: err.message });
    }
    res.send("Favourites table is flushed!");
  });
});

// Route to get favourite pokemons from db
router.get("/get/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = "SELECT * FROM favourites WHERE userId = ?";

  db.all(query, [userId], (err, rows) => {
    if (err) return res.status(500).send("Server error");
    res.json(rows);
  });
});

module.exports = router;
