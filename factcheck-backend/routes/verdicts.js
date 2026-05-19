const express = require("express");
const router = express.Router();
const Claim = require("../models/Claim");

// ── GET /api/verdicts  →  All settled/recorded claims ─────────
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [claims, total] = await Promise.all([
      Claim.find({ status: { $in: ["settled", "recorded"] } })
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Claim.countDocuments({ status: { $in: ["settled", "recorded"] } }),
    ]);

    res.json({ claims, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/verdicts/record  →  Save blockchain tx hash ─────
// Called by the frontend after MetaMask signs the storeVerdict() tx
router.post("/record", async (req, res) => {
  try {
    const { claimId, txHash, network } = req.body;

    if (!claimId || !txHash) {
      return res.status(400).json({ error: "claimId and txHash are required" });
    }

    const claim = await Claim.findById(claimId);
    if (!claim) return res.status(404).json({ error: "Claim not found" });
    if (claim.status === "active") {
      return res.status(400).json({ error: "Claim is still in voting phase" });
    }

    claim.blockchain.txHash = txHash;
    claim.blockchain.network = network || "polygon-amoy";
    claim.blockchain.recordedAt = new Date();
    claim.status = "recorded";
    await claim.save();

    res.json({ success: true, claim });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/verdicts/:id  →  Verdict detail with blockchain proof
router.get("/:id", async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ error: "Claim not found" });
    if (claim.status === "active") {
      return res.status(400).json({ error: "Verdict not yet reached" });
    }

    res.json({
      claim,
      polygonscanUrl: claim.blockchain.txHash
        ? `https://amoy.polygonscan.com/tx/${claim.blockchain.txHash}`
        : null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
