// Connect to MongoDB first
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/cafeflow";
mongoose
  .connect(uri)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.warn("⚠️ MongoDB connection error:", err.message));

// Import and use all routes
const routes = require("./routes/index.js");
app.use("/", routes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running: http://localhost:${PORT}`);
  console.log(`📍 Home: http://localhost:${PORT}/`);
  console.log(`📍 Admin: http://localhost:${PORT}/admin`);
  console.log(`📍 Menu: http://localhost:${PORT}/menu`);
});