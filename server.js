const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());

// ✅ Test routes
app.get("/", (req, res) => {
  res.send("Server is working");
});

app.get("/test", (req, res) => {
  res.send("Test route working");
});

// ✅ MangaDex proxy route
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

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
