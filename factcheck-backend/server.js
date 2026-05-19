const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const claimRoutes = require("./routes/claims");
const voteRoutes = require("./routes/votes");
const verdictRoutes = require("./routes/verdicts");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/factcheck")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));
app.use("/api/claims", claimRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/verdicts", verdictRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong", details: err.message });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
