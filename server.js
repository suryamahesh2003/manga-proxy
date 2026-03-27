const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

app.get("/api/*", async (req, res) => {
  const url = "https://api.mangadex.org" + req.originalUrl.replace("/api", "");

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

app.listen(process.env.PORT || 3000);
