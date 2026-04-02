const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());

// ✅ Test routes FIRST
app.get("/", (req, res) => {
  res.send("Server is working");
});

app.get("/test", (req, res) => {
  res.send("Test route working");
});

// ✅ MangaDex proxy (VERY IMPORTANT: exact path)
app.get("/api/*", async (req, res) => {
  const url = "https://api.mangadex.org" + req.originalUrl.replace("/api", "");

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// ✅ fallback route (IMPORTANT)
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// ✅ start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
