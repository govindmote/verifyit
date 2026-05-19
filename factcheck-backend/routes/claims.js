const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");

// ── POST /api/claims  →  Submit a new claim ───────────────────
router.post("/", async (req, res) => {
  try {
    const { title, description, sourceUrl, submittedBy } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const claim = await Claim.create({ title, description, sourceUrl, submittedBy });
    res.status(201).json({ success: true, claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/claims  →  List claims (with filters) ───────────
router.get("/", async (req, res) => {
  try {
    const { status = "active", page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status !== "all") filter.status = status;

    const [claims, total] = await Promise.all([
      Claim.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Claim.countDocuments(filter),
    ]);

    res.json({ claims, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/claims/search  →  Full-text search ───────────────
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query parameter q is required" });

    const claims = await Claim.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20);

    res.json({ claims });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/claims/trending  →  Most voted active claims ─────
router.get("/trending", async (req, res) => {
  try {
    const claims = await Claim.find({ status: "active" })
      .sort({ totalVotes: -1 })
      .limit(5);
    res.json({ claims });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/claims/:id  →  Single claim detail ───────────────
router.get("/:id", async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: "Claim not found" });
    res.json({ claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
