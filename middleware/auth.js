const jwt = require("jsonwebtoken");
require("dotenv").config({
  path: "./.env",
});
const jwtSecret = process.env.JWT_SECRET;

const auth = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader.split(" ")[1];

  if (!token) return res.status(401).send("No token, authorization denied");

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).send("Token is not valid");
  }
};

module.exports = auth;
