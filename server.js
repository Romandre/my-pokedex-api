const express = require("express");
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

// Simple route to check server
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/", favouritesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
