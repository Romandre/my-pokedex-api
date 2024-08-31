const express = require("express");
const path = require("path");
const app = express();

require("dotenv").config({
  path: "./.env",
});
const PORT = process.env.PORT;

const db = require("./database");
const cors = require("cors");
const authRoutes = require("./auth");
const favouritesRoutes = require("./favourites");

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Simple route to check server
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/", favouritesRoutes);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
