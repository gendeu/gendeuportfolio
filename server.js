import express from "express";
import fetch from "node-fetch";
const app = express();

const BIN_ID = "690db0d2ae596e708f49fb59";
const MASTER_KEY = "$2a$10$gd9X3ByoFpoehGbHhRiwlu4KHQDdrRssEdrY2bYDJ/FxAlF4FkEtm"; // keep private

app.get("/update", async (req, res) => {
  try {
    const getRes = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
      headers: { "X-Master-Key": MASTER_KEY }
    });
    const data = await getRes.json();
    const count = data.record.visits + 1;

    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": MASTER_KEY
      },
      body: JSON.stringify({ visits: count })
    });

    res.json({ success: true, visits: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("✅ Counter API running"));
