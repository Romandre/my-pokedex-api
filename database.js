const bcrypt = require("bcryptjs");
const sqlite = require("sqlite3").verbose();
const SALT_ROUNDS = 10;

// Prepare DB with "users" table
const dbPath = "./pokedex.db";
let db;
const demoUser = {
  name: "admin",
  pass: "admin123",
};
function OpenDB() {
  return new Promise(function (resolve, reject) {
    db = new sqlite.Database(dbPath, sqlite.OPEN_READWRITE, (err) => {
      if (err) {
        console.error(err.message);
        return reject(err);
      } else {
        console.log("Database connection is successful!");
        return resolve();
      }
    });
  });
}

function CreateUsersTable() {
  return new Promise(function (resolve, reject) {
    const createUsersSql = `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY, 
        username TEXT UNIQUE, 
        password TEXT)`;

    db.run(createUsersSql, (err) => (err ? reject(err) : resolve()));
  });
}

function CreateAdminUser() {
  db.all(`SELECT * FROM users WHERE username = 'admin'`, async (err, user) => {
    if (err) {
      console.error(err);
    }
    if (!user.length) {
      const passwordHash = await bcrypt.hash(demoUser.pass, SALT_ROUNDS);
      db.run(
        `INSERT INTO users (username, password) VALUES ('${demoUser.name}', '${passwordHash}')`
      );
      console.log("Users table created!");
    }
  });
}

function CreateFavouritesTable() {
  return new Promise(function (resolve, reject) {
    const createUsersSql = `CREATE TABLE IF NOT EXISTS favourites (
        id INTEGER PRIMARY KEY, 
        userId INTEGER, 
        pokemon TEXT,
        FOREIGN KEY(userId) REFERENCES users(id))`;

    db.run(createUsersSql, (err) => (err ? reject(err) : resolve()));
  });
}

OpenDB()
  .then(() => CreateUsersTable())
  .then(() => CreateAdminUser());

CreateFavouritesTable();

module.exports = db;
