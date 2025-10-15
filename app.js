const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static assets
app.use("/javascript", express.static(path.join(__dirname, "public", "javascript")));
app.use("/images", express.static(path.join(__dirname, "public", "images")));
app.use(express.static(path.join(__dirname, "public")));

// Views (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Health check
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Connect to MongoDB first
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cafeflow";
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.warn("⚠️ MongoDB connection error:", err.message));

/**
 * Import and use all routes if available; otherwise, start with minimal routes
 * so the server boots successfully.
 */
try {
  const routes = require("./routes/index.js");
  app.use("/", routes);
} catch (err) {
  console.warn("⚠️ Routes module not found, starting with minimal routes:", err.message);
  app.get("/", (req, res) => {
    res.send(`<!doctype html>
<html><head><meta charset="utf-8"/><title>CafeGlow Backend</title>
<style>:root{color-scheme:dark}body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;margin:0;padding:2rem;background:#0f1115;color:#e5e7eb}.card{max-width:720px;margin:3rem auto;background:#1c1f26;border:1px solid #2a2f3a;border-radius:16px;padding:24px}.btn{display:inline-block;padding:10px 16px;border-radius:10px;background:#ff6b00;color:white;text-decoration:none;margin-right:8px}.muted{color:#9aa4b2}</style>
</head><body>
<div class="card">
  <h1>✅ CafeGlow server is running</h1>
  <p class="muted">Routes package is missing. Running with minimal endpoints.</p>
  <p><a class="btn" href="/health">Health</a></p>
</div>
</body></html>`);
  });
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
  console.log(`📍 Home: http://localhost:${PORT}/`);
  console.log(`📍 Admin: http://localhost:${PORT}/admin`);
  console.log(`📍 Menu: http://localhost:${PORT}/menu`);
});
