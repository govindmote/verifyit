const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "verifyit_secret_2026";

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const validDomains = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com'];
    const emailDomain = email.split('@')[1];
    if (!validDomains.includes(emailDomain)) return res.status(400).json({ error: 'Please use a valid email (Gmail, Yahoo, Outlook, iCloud only)' });
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields required" });
    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists)
      return res.status(409).json({ error: exists.email === email ? "Email already registered" : "Username already taken" });
    const user = await User.create({ username, email, password });
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: "All fields required" });
    const user = await User.findOne({ $or: [{ email: username }, { username }] });
    if (!user)
      return res.status(401).json({ error: "Invalid username or password" });
    const valid = await user.comparePassword(password);
    if (!valid)
      return res.status(401).json({ error: "Invalid username or password" });
    const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});


router.get("/reputation/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.json({ reputation: 1.0 });
    res.json({ reputation: user.reputation, totalVotes: user.totalVotes, correctVotes: user.correctVotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
