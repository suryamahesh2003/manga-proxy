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

// ✅ CLEAN Manga API (FIXED)
app.get("/api/manga", async (req, res) => {
  const query = req.query.title || "";
  const url = `https://api.mangadex.org/manga?title=${query}&limit=20&includes[]=cover_art`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const cleaned = data.data.map((manga) => {
      const id = manga.id;

      // ✅ Title fix
      const titleObj = manga.attributes.title;
      const title =
        titleObj.en ||
        Object.values(titleObj)[0] ||
        "No Title";

      // ✅ Cover fix
      const coverRel = manga.relationships.find(
        (rel) => rel.type === "cover_art"
      );

      let cover = "";
      if (coverRel) {
        const fileName = coverRel.attributes.fileName;
        cover = `https://uploads.mangadex.org/covers/${id}/${fileName}.jpg`;
      }

      return {
        id,
        title,
        cover,
      };
    });

    res.json(cleaned);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch manga" });
  }
});

// ✅ fallback route
app.use((req, res) => {
  res.status(404).send("Route not found");
});

// ✅ start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});
