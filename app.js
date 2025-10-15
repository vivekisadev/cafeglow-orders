"use strict";

require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Basic middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static assets
app.use(express.static(path.join(__dirname, "public")));

// Health endpoint
app.get("/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime(), timestamp: Date.now() });
});

// Mount page routes (/, /menu)
try {
  const pageRoutes = require("./routes/page.routes.js");
  app.use("/", pageRoutes);
} catch (e) {
  console.warn("Failed to load page routes:", e.message);
  // Fallback minimal homepage
  app.get("/", (_req, res) => {
    res.send(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>CafeGlow Backend</title>
    <style>
      :root { color-scheme: dark; }
      body { font-family: system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif; margin:0; padding:2rem; background:#0f1115; color:#e5e7eb; }
      .card { max-width:720px; margin:3rem auto; background:#1c1f26; border:1px solid #2a2f3a; border-radius:16px; padding:24px; }
      .btn { display:inline-block; padding:10px 16px; border-radius:10px; background:#ff6b00; color:white; text-decoration:none; margin-right:8px; }
      .muted { color:#9aa4b2; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>✅ CafeGlow server is running</h1>
      <p class="muted">Routes package is missing. Running with minimal endpoints.</p>
      <p><a class="btn" href="/health">Health</a></p>
    </div>
  </body>
</html>`);
  });
}

// 404 handler
app.use((_req, res) => {
  res.status(404).send("Not Found");
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`CafeGlow server listening at http://localhost:${port}`);
});

module.exports = app;
