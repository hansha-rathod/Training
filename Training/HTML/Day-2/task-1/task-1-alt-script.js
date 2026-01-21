// server.js
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/proxy", async (req, res) => {
  try {
    const response = await axios.get("https://satvasolutions.com", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    res.send(response.data);
  } catch (err) {
    res.status(500).send("Failed to load external website");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
