// server.js
const express = require("express");
const fetch = require("node-fetch"); // npm install node-fetch@2
const cors = require("cors");
const ping = require("ping");        // npm install ping

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/check", async (req, res) => {
  const { services } = req.body || {};
  if (!Array.isArray(services)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  const results = await Promise.all(
    services.map(async ({ id, url }) => {
      if (!url) {
        return { id, status: "down", latency_ms: null, error: "Missing URL" };
      }

      // HTTP/HTTPS check
      if (/^https?:\/\//i.test(url)) {
        const start = Date.now();
        try {
          const resp = await fetch(url, { method: "GET", timeout: 5000 });
          const latency_ms = Date.now() - start;
          if (!resp.ok) {
            return { id, status: "down", latency_ms, error: `HTTP ${resp.status}` };
          }
          return { id, status: "up", latency_ms };
        } catch (err) {
          return { id, status: "down", latency_ms: null, error: err.message };
        }
      }

      // ICMP ping check
      try {
        const start = Date.now();
        const probe = await ping.promise.probe(url, { timeout: 5 });
        const latency_ms = Date.now() - start;
        if (probe.alive) {
          return { id, status: "up", latency_ms };
        } else {
          return { id, status: "down", latency_ms, error: probe.output };
        }
      } catch (err) {
        return { id, status: "down", latency_ms: null, error: err.message };
      }
    })
  );

  res.json({ results });
});

app.listen(PORT, () => {
  console.log(`✅ Status API running at http://localhost:${PORT}`);
});
